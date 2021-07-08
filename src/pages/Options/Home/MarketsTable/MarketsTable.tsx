import React, { memo, useEffect, useMemo, useState } from 'react';
import { HistoricalOptionsMarketInfo, OptionsMarkets } from 'types/options';
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
import { navigateToOptionsMarket } from 'utils/routes';
import { Arrow, ArrowsWrapper, PhaseLabel, StyledTableCell, TableHeaderLabel, Star } from './components';
import Pagination from './Pagination';
import styled from 'styled-components';
import { PhaseFilterEnum } from '../ExploreMarkets/ExploreMarkets';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import star from 'assets/images/star.svg';
import fullStar from 'assets/images/full-star.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import axios from 'axios';
import { USD_SIGN } from 'constants/currency';
import { Rates } from '../../../../queries/rates/useExchangeRatesQuery';
import { FlexDivCentered, Image } from '../../../../theme/common';
import arrowDown from '../../../../assets/images/arrow-down.svg';
import { getPercentageDifference } from '../../../../utils/formatters/number';
import arrowUp from '../../../../assets/images/arrow-up.svg';
import CircularProgress from '@material-ui/core/CircularProgress';

dotenv.config();

type MarketsTableProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets: string[];
    isLoading?: boolean;
    phase: PhaseFilterEnum;
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

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const defaultOrderBy = 5; // time remaining

const MarketsTable: React.FC<MarketsTableProps> = memo(
    ({ optionsMarkets, watchlistedMarkets, children, phase, onChange, exchangeRates }) => {
        const [page, setPage] = useState(0);
        const handleChangePage = (_event: unknown, newPage: number) => {
            setPage(newPage);
        };
        const numberOfPages = Math.ceil(optionsMarkets.length / 10) || 1;
        const [orderBy, setOrderBy] = useState(defaultOrderBy);
        const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
        const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
        const networkId = useSelector((state: RootState) => getNetworkId(state));

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

        useEffect(() => setPage(0), [phase]);

        const memoizedPage = useMemo(() => {
            if (page > numberOfPages - 1) {
                return numberOfPages - 1;
            }
            return page;
        }, [page, numberOfPages]);

        const toggleWatchlist = async (marketAddress: string) => {
            try {
                await axios.post(process.env.REACT_APP_THALES_API_URL + '/watchlist', {
                    networkId,
                    walletAddress,
                    marketAddress,
                });
                onChange();
            } catch (e) {
                console.log(e);
            }
        };

        const sortedMarkets = useMemo(() => {
            return optionsMarkets
                .sort((a, b) => {
                    switch (orderBy) {
                        case 1:
                        case 2:
                            return sortByField(a, b, orderDirection, 'asset');
                        case 3:
                            return sortByAssetPrice(a, b, orderDirection, exchangeRates);
                        case 4:
                            return sortByField(a, b, orderDirection, 'strikePrice');
                        case 5:
                            return sortByField(a, b, orderDirection, 'poolSize');
                        case 6:
                            return sortByTime(a, b, orderDirection);
                        case 7:
                            return orderDirection === OrderDirection.ASC
                                ? a.openOrders - b.openOrders
                                : b.openOrders - a.openOrders;
                        default:
                            return 0;
                    }
                })
                .slice(memoizedPage * 10, 10 * (memoizedPage + 1));
        }, [optionsMarkets, orderBy, orderDirection, memoizedPage, exchangeRates]);

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
                            {sortedMarkets.map((market, index) => {
                                const currentAssetPrice = exchangeRates?.[market.currencyKey] || 0;
                                return (
                                    <StyledTableRow
                                        onClick={() => {
                                            if (market.phase !== 'expiry') {
                                                navigateToOptionsMarket(market.address);
                                            }
                                        }}
                                        className={market.phase !== 'expiry' ? 'clickable' : ''}
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
                                                src={watchlistedMarkets?.includes(market.address) ? fullStar : star}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Currency.Name
                                                currencyKey={market.currencyKey}
                                                showIcon={true}
                                                iconProps={{ type: 'asset' }}
                                                synthIconStyle={{ width: 32, height: 32 }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>{USD_SIGN + currentAssetPrice.toFixed(2)}</StyledTableCell>
                                        <StyledTableCell>
                                            <FlexDivCentered>
                                                <span>{USD_SIGN + market.strikePrice.toFixed(2)}</span>
                                                {currentAssetPrice > market.strikePrice ? (
                                                    <RedText>
                                                        (
                                                        <PriceArrow src={arrowDown} />
                                                        <span>
                                                            {getPercentageDifference(
                                                                currentAssetPrice,
                                                                market.strikePrice
                                                            )}
                                                            %
                                                        </span>
                                                        )
                                                    </RedText>
                                                ) : (
                                                    <GreenText>
                                                        (
                                                        <PriceArrow src={arrowUp} />
                                                        <span>
                                                            {getPercentageDifference(
                                                                currentAssetPrice,
                                                                market.strikePrice
                                                            )}
                                                            %
                                                        </span>
                                                        )
                                                    </GreenText>
                                                )}
                                            </FlexDivCentered>
                                        </StyledTableCell>
                                        <StyledTableCell>{USD_SIGN + market.poolSize.toFixed(2)}</StyledTableCell>
                                        <StyledTableCell>
                                            <TimeRemaining end={market.timeRemaining} fontSize={14} />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {(market.phase === 'trading' && market.openOrders) ?? <StyledLoader />}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <PhaseLabel className={market.phase}>
                                                {t(`options.phases.${market.phase}`)}
                                            </PhaseLabel>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                        {optionsMarkets.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[]}
                                        count={optionsMarkets.length}
                                        rowsPerPage={10}
                                        page={memoizedPage}
                                        onChangePage={handleChangePage}
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

const StyledTableRow = withStyles(() => ({
    root: {
        background: '#04045a',
        '&:last-child': {
            borderBottomLeftRadius: '23px',
            borderBottomRightRadius: '23px',
        },
        '&:last-child td:first-child': {
            borderBottomLeftRadius: '23px',
        },
        '&:last-child td:last-child': {
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

const PaginationWrapper = styled(TablePagination)`
    border: none !important;
    display: flex;
    .MuiToolbar-root {
        padding: 0;
        margin-top: 16px;
        display: inline-block;
    }

    .MuiTablePagination-caption {
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

const sortByTime = (a: HistoricalOptionsMarketInfo, b: HistoricalOptionsMarketInfo, direction: OrderDirection) => {
    if (direction === OrderDirection.ASC && a.phaseNum === b.phaseNum) {
        return a.timeRemaining > b.timeRemaining ? -1 : 1;
    }
    if (direction === OrderDirection.DESC && a.phaseNum === b.phaseNum) {
        return a.timeRemaining > b.timeRemaining ? 1 : -1;
    }

    return 0;
};

const sortByField = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection,
    field: keyof HistoricalOptionsMarketInfo
) => {
    if (direction === OrderDirection.ASC) {
        if (a.phaseNum === b.phaseNum) {
            return a[field] > b[field] ? 1 : -1;
        }
    }
    if (direction === OrderDirection.DESC) {
        if (a.phaseNum === b.phaseNum) {
            return a[field] > b[field] ? -1 : 1;
        }
    }

    return 0;
};

const sortByAssetPrice = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection,
    exchangeRates: Rates | null
) => {
    const assetPriceA = exchangeRates?.[a.currencyKey] || 0;
    const assetPriceB = exchangeRates?.[b.currencyKey] || 0;
    if (direction === OrderDirection.ASC) {
        if (a.phaseNum === b.phaseNum) {
            return assetPriceA > assetPriceB ? 1 : -1;
        }
    }
    if (direction === OrderDirection.DESC) {
        if (a.phaseNum === b.phaseNum) {
            return assetPriceA > assetPriceB ? -1 : 1;
        }
    }

    return 0;
};

export default MarketsTable;
