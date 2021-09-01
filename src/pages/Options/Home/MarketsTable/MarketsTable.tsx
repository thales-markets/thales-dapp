import React, { memo, useEffect, useMemo, useState } from 'react';
import { OptionsMarkets } from 'types/options';
import dotenv from 'dotenv';
import {
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    withStyles,
    TablePagination,
    TableFooter,
} from '@material-ui/core';
import Currency from 'components/Currency';
import { useTranslation } from 'react-i18next';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { buildOptionsMarketLink } from 'utils/routes';
import {
    Arrow,
    ArrowsWrapper,
    PhaseLabel,
    StyledTableCell,
    TableHeaderLabel,
    Star,
    DisplayContentsAnchor,
} from './components';
import Pagination from './Pagination';
import styled from 'styled-components';
import { OrderDirection, PhaseFilterEnum } from '../ExploreMarkets/ExploreMarketsDesktop';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import star from 'assets/images/star.svg';
import fullStar from 'assets/images/full-star.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import axios from 'axios';
import { USD_SIGN } from 'constants/currency';
import { Rates } from '../../../../queries/rates/useExchangeRatesQuery';
import { FlexDivCentered, Image } from '../../../../theme/common';
import arrowDown from 'assets/images/arrow-down.svg';
import { formatCurrencyWithSign, getPercentageDifference } from '../../../../utils/formatters/number';
import arrowUp from 'assets/images/arrow-up.svg';
import basketball from 'assets/images/basketball.svg';
import volleyball from 'assets/images/volleyball.svg';
import medals from 'assets/images/medals.png';
import tennis from 'assets/images/tennis.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactCountryFlag from 'react-country-flag';

dotenv.config();

type MarketsTableProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets: string[];
    isLoading?: boolean;
    phase: PhaseFilterEnum;
    orderBy: number;
    setOrderBy: (data: any) => void;
    orderDirection: OrderDirection;
    setOrderDirection: (data: any) => void;
    onChange: any;
};

interface HeadCell {
    id: keyof OptionsMarkets;
    label: string;
    sortable: boolean;
}

const headCells: HeadCell[] = [
    { id: 1, label: '', sortable: false },
    { id: 2, label: 'Asset', sortable: true },
    { id: 3, label: 'Asset Price', sortable: true },
    { id: 4, label: 'Strike Price', sortable: true },
    { id: 5, label: 'Market Size', sortable: true },
    { id: 6, label: 'Time Remaining', sortable: true },
    { id: 7, label: 'Open Orders', sortable: true },
    { id: 8, label: 'Phase', sortable: false },
];

const defaultOrderBy = 5; // time remaining

const MarketsTable: React.FC<MarketsTableProps> = memo(
    ({
        optionsMarkets,
        watchlistedMarkets,
        children,
        phase,
        onChange,
        exchangeRates,
        orderBy,
        setOrderDirection,
        orderDirection,
        setOrderBy,
    }) => {
        const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
        const networkId = useSelector((state: RootState) => getNetworkId(state));
        const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

        const [page, setPage] = useState(0);
        const handleChangePage = (_event: unknown, newPage: number) => {
            setPage(newPage);
        };
        const [rowsPerPage, setRowsPerPage] = React.useState(10);
        const numberOfPages = Math.ceil(optionsMarkets.length / rowsPerPage) || 1;

        const calcDirection = (cell: HeadCell) => {
            if (orderBy === cell.id) {
                switch (orderDirection) {
                    case OrderDirection.NONE:
                        setOrderDirection(OrderDirection.DESC);
                        break;
                    case OrderDirection.DESC:
                        setOrderDirection(OrderDirection.ASC);
                        break;
                    case OrderDirection.ASC:
                        setOrderDirection(OrderDirection.DESC);
                        setOrderBy(defaultOrderBy);
                        break;
                }
            } else {
                setOrderBy(parseInt(cell.id.toString()));
                setOrderDirection(OrderDirection.DESC);
            }
        };

        const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        useEffect(() => setPage(0), [phase]);

        const memoizedPage = useMemo(() => {
            if (page > numberOfPages - 1) {
                return numberOfPages - 1;
            }
            return page;
        }, [page, numberOfPages]);

        const toggleWatchlist = async (marketAddress: string) => {
            try {
                await axios.post('https://api.thales.market/watchlist', {
                    networkId,
                    walletAddress,
                    marketAddress,
                });
                onChange();
            } catch (e) {
                console.log(e);
            }
        };

        const slicedMarkets = useMemo(() => {
            return optionsMarkets.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
        }, [optionsMarkets, orderBy, orderDirection, memoizedPage, exchangeRates, rowsPerPage]);

        const { t } = useTranslation();
        return (
            <>
                <TableContainer
                    style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }}
                    component={Paper}
                >
                    <Table aria-label="customized table">
                        <TableHead style={{ textTransform: 'uppercase', background: '#04045a' }}>
                            <TableRow>
                                {headCells.map((cell: HeadCell, index) => {
                                    return (
                                        <StyledTableCell
                                            onClick={cell.sortable ? calcDirection.bind(this, cell) : () => {}}
                                            key={index}
                                            style={cell.sortable ? { cursor: 'pointer' } : {}}
                                        >
                                            <TableHeaderLabel
                                                className={cell.sortable && orderBy === cell.id ? 'selected' : ''}
                                            >
                                                {cell.label}
                                            </TableHeaderLabel>
                                            {cell.sortable && (
                                                <ArrowsWrapper>
                                                    {orderBy === cell.id && orderDirection !== OrderDirection.NONE ? (
                                                        <Arrow
                                                            src={
                                                                orderDirection === OrderDirection.ASC
                                                                    ? upSelected
                                                                    : downSelected
                                                            }
                                                        />
                                                    ) : (
                                                        <>
                                                            <Arrow src={up} />
                                                            <Arrow src={down} />
                                                        </>
                                                    )}
                                                </ArrowsWrapper>
                                            )}
                                        </StyledTableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {slicedMarkets.map((market, index) => {
                                const currentAssetPrice = exchangeRates?.[market.currencyKey] || 0;
                                const strikeAndAssetPriceDifference = getPercentageDifference(
                                    currentAssetPrice,
                                    market.strikePrice
                                );
                                return (
                                    <StyledTableRow
                                        className={`${market.phase !== 'expiry' ? 'clickable' : ''}`}
                                        key={index}
                                    >
                                        <StyledTableCell
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWatchlist(market.address);
                                            }}
                                            style={{ paddingRight: 0 }}
                                        >
                                            <Star
                                                style={{ visibility: isWalletConnected ? 'visible' : 'hidden' }}
                                                src={watchlistedMarkets?.includes(market.address) ? fullStar : star}
                                            />
                                        </StyledTableCell>
                                        <DisplayContentsAnchor
                                            style={{
                                                pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                                            }}
                                            href={buildOptionsMarketLink(market.address)}
                                        >
                                            {market.customMarket ? (
                                                <StyledAnchoredTableCell style={{ textAlign: 'left' }}>
                                                    <ReactCountryFlag
                                                        countryCode={countryToCountryCode(market.country as any)}
                                                        style={{ width: 32, height: 32, marginRight: 10 }}
                                                        svg
                                                    />
                                                    {!countryToCountryCode(market.country as any) && (
                                                        <CustomIcon
                                                            src={eventToIcon(market.eventName as any)}
                                                        ></CustomIcon>
                                                    )}
                                                    {market.country}
                                                </StyledAnchoredTableCell>
                                            ) : (
                                                <StyledAnchoredTableCell>
                                                    <Currency.Name
                                                        currencyKey={market.currencyKey}
                                                        showIcon={true}
                                                        iconProps={{ type: 'asset' }}
                                                        synthIconStyle={{ width: 32, height: 32 }}
                                                    />
                                                </StyledAnchoredTableCell>
                                            )}
                                        </DisplayContentsAnchor>
                                        <DisplayContentsAnchor
                                            style={{
                                                pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                                            }}
                                            href={buildOptionsMarketLink(market.address)}
                                        >
                                            <StyledAnchoredTableCell>
                                                {currentAssetPrice
                                                    ? formatCurrencyWithSign(USD_SIGN, currentAssetPrice)
                                                    : 'N/A'}
                                            </StyledAnchoredTableCell>
                                        </DisplayContentsAnchor>
                                        <DisplayContentsAnchor
                                            style={{
                                                pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                                            }}
                                            href={buildOptionsMarketLink(market.address)}
                                        >
                                            <StyledAnchoredTableCell>
                                                {market.customMarket ? (
                                                    market.eventName
                                                ) : (
                                                    <FlexDivCentered>
                                                        <span>
                                                            {formatCurrencyWithSign(USD_SIGN, market.strikePrice)}
                                                        </span>
                                                        {currentAssetPrice > market.strikePrice ? (
                                                            <RedText
                                                                style={{
                                                                    display: isFinite(strikeAndAssetPriceDifference)
                                                                        ? 'flex'
                                                                        : 'none',
                                                                }}
                                                            >
                                                                (
                                                                <PriceArrow src={arrowDown} />
                                                                <span>{strikeAndAssetPriceDifference.toFixed(2)}%</span>
                                                                )
                                                            </RedText>
                                                        ) : (
                                                            <GreenText
                                                                style={{
                                                                    display: isFinite(strikeAndAssetPriceDifference)
                                                                        ? 'flex'
                                                                        : 'none',
                                                                }}
                                                            >
                                                                (
                                                                <PriceArrow src={arrowUp} />
                                                                <span>{strikeAndAssetPriceDifference.toFixed(2)}%</span>
                                                                )
                                                            </GreenText>
                                                        )}
                                                    </FlexDivCentered>
                                                )}
                                            </StyledAnchoredTableCell>
                                        </DisplayContentsAnchor>
                                        <DisplayContentsAnchor
                                            style={{
                                                pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                                            }}
                                            href={buildOptionsMarketLink(market.address)}
                                        >
                                            <StyledAnchoredTableCell>
                                                {formatCurrencyWithSign(USD_SIGN, market.poolSize)}
                                            </StyledAnchoredTableCell>
                                        </DisplayContentsAnchor>
                                        <DisplayContentsAnchor
                                            style={{
                                                pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                                            }}
                                            href={buildOptionsMarketLink(market.address)}
                                        >
                                            <StyledAnchoredTableCell>
                                                <TimeRemaining end={market.timeRemaining} fontSize={14} />
                                            </StyledAnchoredTableCell>
                                        </DisplayContentsAnchor>
                                        <DisplayContentsAnchor
                                            style={{
                                                pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                                            }}
                                            href={buildOptionsMarketLink(market.address)}
                                        >
                                            <StyledAnchoredTableCell>
                                                {(market.phase === 'trading' && market.openOrders) ?? <StyledLoader />}
                                            </StyledAnchoredTableCell>
                                        </DisplayContentsAnchor>
                                        <DisplayContentsAnchor
                                            style={{
                                                pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                                            }}
                                            href={buildOptionsMarketLink(market.address)}
                                        >
                                            <StyledAnchoredTableCell>
                                                <PhaseLabel className={market.phase}>
                                                    {t(`options.phases.${market.phase}`)}
                                                </PhaseLabel>
                                            </StyledAnchoredTableCell>
                                        </DisplayContentsAnchor>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                        {optionsMarkets.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        count={optionsMarkets.length}
                                        rowsPerPage={rowsPerPage}
                                        page={memoizedPage}
                                        onPageChange={handleChangePage}
                                        ActionsComponent={() => (
                                            <Pagination
                                                page={memoizedPage}
                                                numberOfPages={numberOfPages}
                                                setPage={setPage}
                                            />
                                        )}
                                    />
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </TableContainer>
                {optionsMarkets.length === 0 && children}
            </>
        );
    }
);

const StyledLoader = styled(CircularProgress)`
    height: 16px !important;
    width: 16px !important;
`;

export const StyledTableRow = withStyles(() => ({
    root: {
        background: '#04045a',
        '&:last-child': {
            borderBottomLeftRadius: '23px',
            borderBottomRightRadius: '23px',
        },
        '&:last-child > td:first-child': {
            borderBottomLeftRadius: '23px',
        },
        '&:last-child a:last-child td': {
            borderBottomRightRadius: '23px',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: '#0a0b52',
            },
        },
    },
}))(TableRow);

const StyledAnchoredTableCell = styled(StyledTableCell)`
    vertical-align: middle !important;
`;

export const PaginationWrapper = styled(TablePagination)`
    border: none !important;
    display: flex;
    .MuiToolbar-root {
        color: #f6f6fe;
        padding: 0;
        margin-top: 16px;
        display: flex;
        .MuiSelect-icon {
            color: #f6f6fe;
        }
        .MuiTablePagination-spacer {
            display: none;
        }
    }
    .MuiTablePagination-toolbar > .MuiTablePagination-caption:last-of-type {
        display: none;
    }
`;

const PriceArrow = styled(Image)`
    width: 14px;
    height: 14px;
`;

const GreenText = styled.span`
    color: #01b977;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-left: 5px;
`;

const RedText = styled.span`
    color: #be2727;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-left: 5px;
`;

export const countryToCountryCode = (country: string) => {
    console.log(country);
    if (country) {
        switch (country) {
            case 'USA':
                return 'US';
            case 'JPN':
                return 'JP';
            case 'CHN':
                return 'CN';
            case 'RUS':
                return 'RU';
            case 'SRB':
                return 'RS';
            case 'AUS':
                return 'AU';
            case 'SLO':
                return 'SI';
            case 'POL':
                return 'PL';
            case 'ESP':
                return 'ES';
        }
    }
};

export const eventToIcon = (event: string) => {
    console.log(event);
    if (event) {
        if (event.toLowerCase().indexOf('basketball') !== -1) {
            return basketball;
        }
        if (event.toLowerCase().indexOf('volleyball') !== -1) {
            return volleyball;
        }
        if (event.toLowerCase().indexOf('medals') !== -1) {
            return medals;
        }
        if (event.toLowerCase().indexOf('tennis') !== -1 || event.toLowerCase().indexOf('us open') !== -1) {
            return tennis;
        }
    }
};

export const CustomIcon = styled(Image)`
    margin-bottom: -6px;
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;

export default MarketsTable;
