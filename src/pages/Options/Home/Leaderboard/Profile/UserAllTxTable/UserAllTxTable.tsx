import { Table, TableBody, TableFooter, TableHead, TableRow } from '@material-ui/core';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';
import Currency from 'components/Currency';
import SimpleLoader from 'components/SimpleLoader';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { COLORS } from 'constants/ui';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from 'components/OldVersion/styled-components';
import { PaginationWrapper, StyledTableRow } from 'components/OldVersion/styled-components';
import Pagination from 'pages/Governance/components/Pagination';
import { LightTooltip } from 'pages/Options/Market/components';
// import { StyledLink } from 'pages/Options/QuickTrading/QuickTradingTable/QuickTradingTable';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, Image, Text } from 'theme/common';
import { OptionSide } from 'types/options';
import { formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { HeadCell, OrderDirection } from '../Profile';
type UserAllTxTableProps = {
    profile: any;
    usersMints: any[];
    usersTrades: any[];
    usersExercises: any[];
    usersUnclaimed: any[];
    marketsData: any[];
    userDisplay: boolean;
    isLoading: boolean;
    sortByField: any;
    sortByMarketHeading: any;
};

const DEFAULT_ORDER_BY = 1;

const UserAllTxTable: React.FC<UserAllTxTableProps> = ({
    profile,
    usersMints,
    usersTrades,
    usersExercises,
    usersUnclaimed,
    marketsData,
    userDisplay,
    isLoading,
    sortByField,
    sortByMarketHeading,
}) => {
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
        return (
            Math.ceil(
                (usersMints.length + usersTrades.length + usersExercises.length + usersUnclaimed.length) / rowsPerPage
            ) || 1
        );
    }, [rowsPerPage, profile]);

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

    const transactionsByType = useMemo(() => {
        const data = usersMints
            .map((mint: any) => {
                return { txType: 'mint', ...mint };
            })
            .concat(
                usersTrades.map((trade: any) => {
                    return { txType: 'trade', ...trade };
                }),
                usersExercises.map((exercise: any) => {
                    return { txType: 'exercise', ...exercise };
                }),
                usersUnclaimed.map((unclaimed: any) => {
                    return { txType: 'redeemable', ...unclaimed };
                })
            );
        return data;
    }, [profile]);

    const sortedTransactions = useMemo(() => {
        return transactionsByType
            .sort((a, b) => {
                if (orderBy === 1) {
                    if (a.timestamp === undefined) return 1;
                    if (b.timestamp === undefined) return -1;
                    return sortByField(a, b, orderDirection, 'timestamp');
                }
                if (orderBy === 2) {
                    const bMarket =
                        b.txType === 'redeemable'
                            ? marketsData.filter((market) => market.address === b.market.address)[0]
                            : marketsData.filter((market) => market.address === b.market)[0];

                    const aMarket =
                        a.txType === 'redeemable'
                            ? marketsData.filter((market) => market.address === a.market.address)[0]
                            : marketsData.filter((market) => market.address === a.market)[0];

                    return sortByMarketHeading(aMarket, bMarket, orderDirection);
                }
                if (orderBy === 3) {
                    return sortByField(a, b, orderDirection, 'txType');
                }
                if (orderBy === 4) {
                    if (a.side !== 'long' && a.side !== 'short') return 1;
                    if (b.side !== 'long' && b.side !== 'short') return -1;
                    return sortByField(a, b, orderDirection, 'side');
                }
                if (orderBy === 5) {
                    const bExtendedTransaction = b.txType === 'redeemable' ? { type: 'redeemable', ...b } : b;

                    const aExtendedTransaction = a.txType === 'redeemable' ? { type: 'redeemable', ...a } : a;

                    if (aExtendedTransaction.type !== 'buy' && aExtendedTransaction.type !== 'sell') return 1;
                    if (bExtendedTransaction.type !== 'buy' && bExtendedTransaction.type !== 'sell') return -1;
                    return sortByField(aExtendedTransaction, bExtendedTransaction, orderDirection, 'type');
                }
                if (orderBy === 6) {
                    const bExtendedTransaction =
                        b.txType === 'redeemable' ? { amount: b.market.result === 'long' ? b.long : b.short, ...b } : b;

                    const aExtendedTransaction =
                        a.txType === 'redeemable' ? { amount: a.market.result === 'long' ? a.long : a.short, ...a } : a;
                    return sortByField(aExtendedTransaction, bExtendedTransaction, orderDirection, 'amount');
                }
                if (orderBy === 7) {
                    if (a.price === undefined) return 1;
                    if (b.price === undefined) return -1;
                    return sortByField(a, b, orderDirection, 'price');
                }
                if (orderBy === 8) {
                    const bMarket =
                        b.txType === 'redeemable'
                            ? marketsData.filter((market) => market.address === b.market.address)[0]
                            : marketsData.filter((market) => market.address === b.market)[0];

                    const aMarket =
                        a.txType === 'redeemable'
                            ? marketsData.filter((market) => market.address === a.market.address)[0]
                            : marketsData.filter((market) => market.address === a.market)[0];

                    if (aMarket.result === null) return 1;
                    if (bMarket.result === null) return -1;
                    return sortByField(aMarket, bMarket, orderDirection, 'result');
                }

                return 0;
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [orderBy, orderDirection, memoizedPage, rowsPerPage, transactionsByType]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.date-time-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.tx-type-col'), sortable: true },
        { id: 4, label: t('options.leaderboard.trades.table.asset-col'), sortable: true },
        { id: 5, label: t('options.leaderboard.trades.table.type-col'), sortable: true },
        { id: 6, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
        { id: 7, label: t('options.leaderboard.trades.table.price-col'), sortable: true },
        { id: 8, label: t('options.leaderboard.profile.markets.result'), sortable: true },
        { id: 9, label: t('options.leaderboard.trades.table.tx-status-col'), sortable: false },
    ];

    return (
        <>
            {!isLoading && sortedTransactions.length > 0 && (
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
                        {sortedTransactions.map((tx: any, index: any) => {
                            const market =
                                tx.txType === 'redeemable'
                                    ? marketsData.filter((market) => market.address === tx.market.address)[0]
                                    : marketsData.filter((market) => market.address === tx.market)[0];
                            const tradeSide: OptionSide = tx.side;
                            const marketResult: OptionSide = tx.txType === 'redeemable' ? tx.market.result : '';
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>
                                        {tx.txType !== 'redeemable' ? formatTxTimestamp(tx.timestamp) : EMPTY_VALUE}
                                    </StyledTableCell>
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
                                            <LightTooltip
                                                title={
                                                    userDisplay
                                                        ? t('options.leaderboard.profile.click-to-redeem')
                                                        : t('options.quick-trading.view-market-tooltip')
                                                }
                                            >
                                                {/* <StyledLink href={buildOptionsMarketLink(market.address, tx.side)}>
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
                                                    <CryptoName>{marketHeading(market, tx.side)}</CryptoName>
                                                </StyledLink> */}
                                            </LightTooltip>
                                        </FlexDiv>
                                    </StyledTableCell>
                                    <StyledTableCell style={{ textTransform: 'uppercase' }}>
                                        {t(`options.leaderboard.profile.table.types.${tx.txType}`)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {tx.txType === 'trade' || tx.txType == 'exercise' ? (
                                            tx.side === 'long' ? (
                                                <SideImage src={longIcon} />
                                            ) : (
                                                <SideImage src={shortIcon} />
                                            )
                                        ) : (
                                            EMPTY_VALUE
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Cell orderSide={tx.type} style={{ textTransform: 'uppercase' }}>
                                            {tx.txType === 'trade'
                                                ? t(`options.leaderboard.profile.table.types.${tx.type}`)
                                                : EMPTY_VALUE}
                                        </Cell>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <CellCurrency
                                            currencySide={
                                                tx.txType === 'redeemable'
                                                    ? tx.market.result
                                                    : tx.txType === 'exercise'
                                                    ? tx.side
                                                    : tx.txType === 'trade'
                                                    ? tx.type
                                                    : ''
                                            }
                                        >
                                            {tx.txType === 'redeemable'
                                                ? formatCurrencyWithKey(
                                                      OPTIONS_CURRENCY_MAP[marketResult],
                                                      tx.market.result === 'long' ? tx.long : tx.short
                                                  )
                                                : tx.txType === 'mint'
                                                ? tx.amount
                                                : formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[tradeSide], tx.amount)}
                                        </CellCurrency>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Cell orderSide={tx.type}>
                                            {tx.txType === 'trade'
                                                ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, tx.price)
                                                : EMPTY_VALUE}
                                        </Cell>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {market.result ? (
                                            market.result === 'long' ? (
                                                <SideImage src={longIcon} />
                                            ) : (
                                                <SideImage src={shortIcon} />
                                            )
                                        ) : (
                                            EMPTY_VALUE
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        style={
                                            index === sortedTransactions.length - 1
                                                ? { borderRadius: '0 0 23px 0' }
                                                : {}
                                        }
                                    >
                                        <ViewEtherscanLink hash={tx.hash} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {sortedTransactions.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                    count={sortedTransactions.length}
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

            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
            {!isLoading && sortedTransactions.length === 0 && (
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
const LoaderContainer = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    position: relative;
    border-radius: 23px;
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

const SideImage = styled.img`
    width: 38px;
`;

const Cell = styled.span<{ orderSide: string }>`
    color: ${(props) =>
        props.orderSide !== 'buy' && props.orderSide !== 'sell'
            ? ''
            : props.orderSide === 'buy'
            ? COLORS.BUY
            : COLORS.SELL};
`;

const CellCurrency = styled.span<{ currencySide: string }>`
    color: ${(props) =>
        props.currencySide === 'buy'
            ? COLORS.BUY
            : props.currencySide === 'sell'
            ? COLORS.SELL
            : props.currencySide !== 'long' && props.currencySide !== 'short'
            ? ''
            : props.currencySide === 'long'
            ? COLORS.BUY
            : COLORS.SELL};
`;

export default UserAllTxTable;
