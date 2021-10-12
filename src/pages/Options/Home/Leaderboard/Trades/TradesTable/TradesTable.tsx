import { Paper } from '@material-ui/core';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from 'pages/Options/Home/MarketsTable/components';
import {
    countryToCountryCode,
    eventToIcon,
    PaginationWrapper,
    StyledTableRow,
} from 'pages/Options/Home/MarketsTable/MarketsTable';
import { TableFooter } from '@material-ui/core';
import Pagination from 'pages/Options/Home/MarketsTable/Pagination';
import { formatCurrency, formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { ExtendedTrade, ExtendedTrades, HistoricalOptionsMarketInfo, OptionSide } from 'types/options';
import { getSynthName } from 'utils/snxJSConnector';
import { LightTooltip } from 'pages/Options/Market/components';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import Currency from 'components/Currency';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { buildOptionsMarketLink } from 'utils/routes';
import { FlexDiv, FlexDivColumn, Image } from 'theme/common';
import SimpleLoader from 'components/SimpleLoader';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import ViewEtherscanLink from 'components/ViewEtherscanLink';

interface HeadCell {
    id: keyof ExtendedTrade[];
    label: string;
    sortable: boolean;
}

const DEFAULT_ORDER_BY = 3; // market expiration time

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type TradesTableProps = {
    trades: ExtendedTrades;
    isLoading?: boolean;
    orderBy: number;
    setOrderBy: (data: any) => void;
    orderDirection: OrderDirection;
    setOrderDirection: (data: any) => void;
};

const TradesTable: React.FC<TradesTableProps> = ({
    trades,
    isLoading,
    orderBy,
    orderDirection,
    setOrderBy,
    setOrderDirection,
    children,
}) => {
    const { t } = useTranslation();

    const [page, setPage] = useState(0);
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const numberOfPages = Math.ceil(trades.length / rowsPerPage) || 1;

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages]);

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
                    setOrderBy(DEFAULT_ORDER_BY);
                    break;
            }
        } else {
            setOrderBy(parseInt(cell.id.toString()));
            setOrderDirection(OrderDirection.DESC);
        }
    };

    useEffect(() => setPage(0), [orderBy, orderDirection]);

    const sortedMarkets = useMemo(() => {
        return trades.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [trades, orderBy, orderDirection, memoizedPage, rowsPerPage]);

    const marketHeading = (optionsMarket: HistoricalOptionsMarketInfo, optionSide: OptionSide) => {
        const orderbookSign = optionsMarket.customMarket
            ? optionSide === 'long'
                ? optionsMarket.eventName === 'XYZ airdrop claims' ||
                  optionsMarket.eventName === 'ETH burned count' ||
                  optionsMarket.eventName === 'Flippening Markets' ||
                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                    ? '>='
                    : '=='
                : optionsMarket.eventName === 'XYZ airdrop claims' ||
                  optionsMarket.eventName === 'ETH burned count' ||
                  optionsMarket.eventName === 'Flippening Markets' ||
                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                ? '<'
                : '!='
            : optionSide === 'long'
            ? '>'
            : '<';

        return optionsMarket.customMarket
            ? `${optionsMarket.country} ${orderbookSign} ${formatCurrency(
                  optionsMarket.outcome || 0,
                  optionsMarket.eventName === 'Flippening Markets' ||
                      optionsMarket.eventName === 'ETH/BTC market cap ratio'
                      ? 2
                      : 0
              )}`
            : `${getSynthName(optionsMarket.currencyKey)} ${orderbookSign} ${formatCurrencyWithSign(
                  USD_SIGN,
                  optionsMarket.strikePrice
              )}`;
    };

    const headCells: HeadCell[] = [
        { id: 1, label: '', sortable: false },
        { id: 2, label: t('options.quick-trading.table.condition-col'), sortable: true },
        { id: 3, label: t('options.quick-trading.table.when-col'), sortable: true },
        { id: 4, label: t('options.quick-trading.table.deposit-amount-col'), sortable: true },
        { id: 5, label: t('options.quick-trading.table.return-col'), sortable: true },
        { id: 6, label: t('options.quick-trading.table.actions-col'), sortable: false },
    ];

    return (
        <>
            {!isLoading && (
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
                            {sortedMarkets.map((trade: ExtendedTrade, index: any) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>test</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: 'left', paddingRight: 0, paddingLeft: 0 }}>
                                            <FlexDiv>
                                                <Currency.Icon
                                                    synthIconStyle={{
                                                        width: 24,
                                                        height: 24,
                                                        marginRight: 6,
                                                        marginBottom: -6,
                                                    }}
                                                    currencyKey={trade.marketItem.currencyKey}
                                                />{' '}
                                                <LightTooltip title={t('options.quick-trading.view-market-tooltip')}>
                                                    <StyledLink
                                                        href={buildOptionsMarketLink(
                                                            trade.marketItem.address,
                                                            trade.optionSide
                                                        )}
                                                    >
                                                        {trade.marketItem.customMarket &&
                                                            !countryToCountryCode(trade.marketItem.country as any) && (
                                                                <CustomIcon
                                                                    src={eventToIcon(trade.marketItem.eventName as any)}
                                                                ></CustomIcon>
                                                            )}
                                                        <CryptoName>
                                                            {marketHeading(trade.marketItem, trade.optionSide)}
                                                            {trade.optionSide === 'long' ? (
                                                                <SideImage src={longIcon} />
                                                            ) : (
                                                                <SideImage src={shortIcon} />
                                                            )}
                                                        </CryptoName>{' '}
                                                    </StyledLink>
                                                </LightTooltip>
                                            </FlexDiv>
                                        </StyledTableCell>
                                        <StyledTableCell>{trade.orderSide}</StyledTableCell>
                                        <StyledTableCell style={{ width: '120px' }}>{trade.optionSide}</StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithKey(
                                                OPTIONS_CURRENCY_MAP[trade.optionSide],
                                                trade.orderSide === 'buy' ? trade.makerAmount : trade.takerAmount
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell style={{ width: '120px' }}>
                                            {formatCurrencyWithKey(
                                                SYNTHS_MAP.sUSD,
                                                trade.orderSide === 'buy'
                                                    ? trade.takerAmount / trade.makerAmount
                                                    : trade.makerAmount / trade.takerAmount
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            style={
                                                index === sortedMarkets.length - 1 ? { borderRadius: '0 0 23px 0' } : {}
                                            }
                                        >
                                            <ViewEtherscanLink hash={trade.transactionHash} />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                        {sortedMarkets.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                        count={sortedMarkets.length}
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
            )}
            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
            {sortedMarkets.length === 0 && !isLoading && children}
        </>
    );
};

const CryptoName = styled.span``;

export const StyledLink = styled.a`
    color: #f6f6fe;
    &:hover {
        color: #00f9ff;
    }
    cursor: pointer;
`;

const LoaderContainer = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    position: relative;
    border-radius: 0 0 23px 23px;
`;

const SideImage = styled.img`
    width: 32px;
    margin-left: 4px;
`;

export const CustomIcon = styled(Image)`
    margin-bottom: -6px;
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;
export default TradesTable;
