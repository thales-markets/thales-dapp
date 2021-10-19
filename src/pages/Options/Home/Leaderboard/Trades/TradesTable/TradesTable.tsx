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
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { ExtendedTrade, ExtendedTrades } from 'types/options';
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
import { formatTxTimestamp } from 'utils/formatters/date';
import { COLORS } from 'constants/ui';
import { marketHeading } from '../Trades';
import SPAAnchor from '../../../../../../components/SPAAnchor';

interface HeadCell {
    id: keyof ExtendedTrade[];
    label: string;
    sortable: boolean;
}

const DEFAULT_ORDER_BY = 1;

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

    const sortedTrades = useMemo(() => {
        return trades.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [trades, orderBy, orderDirection, memoizedPage, rowsPerPage]);

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
            {!isLoading && (
                <TableContainer
                    style={{ background: 'transparent', boxShadow: 'none', borderRadius: '23px 23px 0 0' }}
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
                            {sortedTrades.map((trade: ExtendedTrade, index: any) => {
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
                                                        </CryptoName>
                                                    </StyledLink>
                                                </LightTooltip>
                                            </FlexDiv>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {trade.optionSide === 'long' ? (
                                                <SideImage src={longIcon} />
                                            ) : (
                                                <SideImage src={shortIcon} />
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Cell orderSide={trade.orderSide} style={{ textTransform: 'uppercase' }}>
                                                {trade.orderSide}
                                            </Cell>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Cell orderSide={trade.orderSide}>
                                                {formatCurrencyWithKey(
                                                    OPTIONS_CURRENCY_MAP[trade.optionSide],
                                                    trade.orderSide === 'buy' ? trade.makerAmount : trade.takerAmount
                                                )}
                                            </Cell>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Cell orderSide={trade.orderSide}>
                                                {formatCurrencyWithKey(
                                                    SYNTHS_MAP.sUSD,
                                                    trade.orderSide === 'buy'
                                                        ? trade.takerAmount / trade.makerAmount
                                                        : trade.makerAmount / trade.takerAmount
                                                )}
                                            </Cell>
                                        </StyledTableCell>
                                        <StyledTableCell
                                            style={
                                                index === sortedTrades.length - 1 ? { borderRadius: '0 0 23px 0' } : {}
                                            }
                                        >
                                            <ViewEtherscanLink hash={trade.transactionHash} />
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
                </TableContainer>
            )}
            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
            {sortedTrades.length === 0 && !isLoading && children}
        </>
    );
};

const CryptoName = styled.span``;

export const StyledLink = styled(SPAAnchor)`
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
    border-radius: 23px;
`;

const SideImage = styled.img`
    width: 38px;
`;

export const CustomIcon = styled(Image)`
    margin-bottom: -6px;
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;

const Cell = styled.span<{ orderSide: string }>`
    color: ${(props) => (props.orderSide === 'buy' ? COLORS.BUY : COLORS.SELL)};
`;

export default TradesTable;
