import { Table, TableBody, TableFooter, TableHead, TableRow } from '@material-ui/core';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';
import Currency from 'components/Currency';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { COLORS } from 'constants/ui';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from 'pages/Options/Home/MarketsTable/components';
import {
    countryToCountryCode,
    eventToIcon,
    PaginationWrapper,
    StyledTableRow,
} from 'pages/Options/Home/MarketsTable/MarketsTable';
import Pagination from 'pages/Options/Home/MarketsTable/Pagination';
import { LightTooltip } from 'pages/Options/Market/components';
import { StyledLink } from 'pages/Options/QuickTrading/QuickTradingTable/QuickTradingTable';
import React, { useEffect, useMemo, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, Image, Text } from 'theme/common';
import { OptionSide } from 'types/options';
import { formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import { marketHeading } from '../../Trades/Trades';
import { HeadCell } from '../Profile';

type UserTradesTableProps = {
    usersTrades: any[];
    marketsData: any[];
};

const DEFAULT_ORDER_BY = 1;

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const UserTradesTable: React.FC<UserTradesTableProps> = ({ usersTrades, marketsData }) => {
    const { t } = useTranslation();
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    useEffect(() => setPage(0), [orderBy, orderDirection]);

    const [page, setPage] = useState(0);
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const numberOfPages = useMemo(() => {
        return Math.ceil(usersTrades.length / rowsPerPage) || 1;
    }, [rowsPerPage, usersTrades]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages, usersTrades]);

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

    const sortedTrades = useMemo(() => {
        return usersTrades
            .sort((a, b) => {
                if (orderBy === 1) {
                    return sortByField(a, b, orderDirection, 'timestamp');
                }
                if (orderBy === 2) {
                    const bMarket = marketsData.filter((market) => market.address === b.market)[0];
                    const aMarket = marketsData.filter((market) => market.address === a.market)[0];
                    return sortByMarketHeading(aMarket, bMarket, orderDirection);
                }
                if (orderBy === 3) {
                    return sortByField(a, b, orderDirection, 'side');
                }
                if (orderBy === 4) {
                    return sortByField(a, b, orderDirection, 'type');
                }
                if (orderBy === 5) {
                    return sortByField(a, b, orderDirection, 'amount');
                }
                if (orderBy === 6) {
                    return sortByField(a, b, orderDirection, 'price');
                }

                return 0;
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [orderBy, orderDirection, memoizedPage, rowsPerPage, usersTrades]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.date-time-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.asset-col'), sortable: true },
        { id: 4, label: t('options.leaderboard.trades.table.type-col'), sortable: true },
        { id: 5, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
        { id: 6, label: t('options.leaderboard.trades.table.price-col'), sortable: true },
        { id: 7, label: t('options.leaderboard.trades.table.tx-status-col'), sortable: false },
    ];

    return (
        <>
            {sortedTrades.length !== 0 && (
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
                        {sortedTrades.map((trade: any, index: any) => {
                            const market = marketsData.filter((market) => market.address === trade.market)[0];
                            const tradeSide: OptionSide = trade.side;
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{formatTxTimestamp(trade.timestamp)}</StyledTableCell>
                                    <StyledTableCell>
                                        <FlexDiv>
                                            <Currency.Icon
                                                synthIconStyle={{
                                                    width: 24,
                                                    height: 24,
                                                    marginRight: 6,
                                                    marginBottom: -6,
                                                }}
                                                currencyKey={market.currencyKey}
                                            />{' '}
                                            <LightTooltip title={t('options.quick-trading.view-market-tooltip')}>
                                                <StyledLink href={buildOptionsMarketLink(market.address, trade.side)}>
                                                    {countryToCountryCode(market.country as string) && (
                                                        <ReactCountryFlag
                                                            countryCode={countryToCountryCode(market.country as string)}
                                                            style={{
                                                                marginBottom: -6,
                                                                marginRight: 6,
                                                                width: 24,
                                                                height: 24,
                                                            }}
                                                            svg
                                                        />
                                                    )}
                                                    {market.customMarket &&
                                                        !countryToCountryCode(market.country as any) && (
                                                            <CustomIcon
                                                                src={eventToIcon(market.eventName as any)}
                                                            ></CustomIcon>
                                                        )}
                                                    <CryptoName>{marketHeading(market, trade.side)}</CryptoName>
                                                </StyledLink>
                                            </LightTooltip>
                                        </FlexDiv>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {trade.side === 'long' ? (
                                            <SideImage src={longIcon} />
                                        ) : (
                                            <SideImage src={shortIcon} />
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Cell orderSide={trade.type} style={{ textTransform: 'uppercase' }}>
                                            {trade.type}
                                        </Cell>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Cell orderSide={trade.type}>
                                            {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[tradeSide], trade.amount)}
                                        </Cell>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Cell orderSide={trade.type}>
                                            {formatCurrencyWithKey(SYNTHS_MAP.sUSD, trade.price)}
                                        </Cell>
                                    </StyledTableCell>
                                    <StyledTableCell
                                        style={index === sortedTrades.length - 1 ? { borderRadius: '0 0 23px 0' } : {}}
                                    >
                                        <ViewEtherscanLink hash={trade.hash} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {sortedTrades.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                    count={sortedTrades.length}
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
            )}
            {sortedTrades.length === 0 && (
                <LoaderContainer>
                    <Text
                        className="bold white"
                        style={{
                            alignSelf: 'center',
                            paddingLeft: 15,
                            fontSize: 31,
                        }}
                    >
                        {t('options.leaderboard.profile.no-transactions')}
                    </Text>
                </LoaderContainer>
            )}
        </>
    );
};

export const CryptoKey = styled.p`
    font-family: Inter !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: #808191;
`;

export const Row = styled(FlexDiv)`
    color: #f6f6fe;
    line-height: 16px;
    font-weight: 600;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
`;

export const RowScrollable = styled(FlexDiv)`
    flex-direction: column;
    overflow-x: hidden;
    max-height: 245px;
    max-width: 95%;
    ::-webkit-scrollbar {
        width: 5px;
    }
`;

export const CustomIcon = styled(Image)`
    margin-bottom: -6px;
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;

const LoaderContainer = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    position: relative;
    border-radius: 23px;
`;

const SideImage = styled.img`
    width: 38px;
`;

const CryptoName = styled.span``;

const Cell = styled.span<{ orderSide: string }>`
    color: ${(props) => (props.orderSide === 'buy' ? COLORS.BUY : COLORS.SELL)};
`;

const sortByMarketHeading = (a: any, b: any, direction: OrderDirection) => {
    const aMarket = marketHeading(a, a.optionSide);
    const bMarket = marketHeading(b, b.optionSide);
    if (direction === OrderDirection.ASC) {
        return aMarket < bMarket ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aMarket < bMarket ? 1 : -1;
    }

    return 0;
};

const sortByField = (a: any, b: any, direction: OrderDirection, field: any) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

export default UserTradesTable;
