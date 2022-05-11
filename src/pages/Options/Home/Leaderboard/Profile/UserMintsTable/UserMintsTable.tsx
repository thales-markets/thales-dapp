import { Table, TableBody, TableFooter, TableHead, TableRow } from '@material-ui/core';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';
import Currency from 'components/Currency';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { USD_SIGN } from 'constants/currency';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from 'components/OldVersion/styled-components';
import { PaginationWrapper, StyledTableRow } from 'components/OldVersion/styled-components';
import Pagination from 'pages/Governance/components/Pagination';
import { LightTooltip } from 'pages/Options/Market/components';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, Image, Text, FlexDivColumn } from 'theme/common';
import { HistoricalOptionsMarketInfo, OptionSide } from 'types/options';
import { getSynthName } from 'utils/currency';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import '../media.scss';
import { HeadCell, OrderDirection } from '../Profile';

type UserMintsTable = {
    usersMints: any[];
    marketsData: any[];
    sortByField: any;
};
const DEFAULT_ORDER_BY = 1;

const UserMintsTable: React.FC<UserMintsTable> = ({ usersMints, marketsData, sortByField }) => {
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
        return Math.ceil(usersMints.length / rowsPerPage) || 1;
    }, [rowsPerPage, usersMints]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages, usersMints]);

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

    const sortedMints = useMemo(() => {
        return usersMints
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
                    return sortByField(a, b, orderDirection, 'amount');
                }

                return 0;
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [orderBy, orderDirection, memoizedPage, rowsPerPage, usersMints]);

    const headCellsMints: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.date-time-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
        { id: 4, label: t('options.leaderboard.trades.table.tx-status-col'), sortable: false },
    ];

    return (
        <>
            {sortedMints.length !== 0 && (
                <Table aria-label="customized table">
                    <TableHead style={{ textTransform: 'uppercase', background: '#04045a' }}>
                        <TableRow>
                            {headCellsMints.map((cell: HeadCell, index) => {
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
                        {sortedMints.map((mint: any, index: any) => {
                            const market = marketsData.filter((market) => market.address === mint.market)[0];
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{formatTxTimestamp(mint.timestamp)}</StyledTableCell>
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
                                                {/* <StyledLink
                                                    href={buildOptionsMarketLink(market.address, mint.optionSide)}
                                                >
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
                                                    <CryptoName>
                                                        {marketHeadingMints(market, market.optionSide)}
                                                    </CryptoName>
                                                </StyledLink> */}
                                            </LightTooltip>
                                        </FlexDiv>
                                    </StyledTableCell>
                                    <StyledTableCell>{mint.amount}</StyledTableCell>
                                    <StyledTableCell
                                        style={index === usersMints.length - 1 ? { borderRadius: '0 0 23px 0' } : {}}
                                    >
                                        <ViewEtherscanLink hash={mint.hash} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {sortedMints.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                    count={sortedMints.length}
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
            {sortedMints.length === 0 && (
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

const sortByMarketHeading = (a: any, b: any, direction: OrderDirection) => {
    const aMarket = marketHeadingMints(a, a.optionSide);
    const bMarket = marketHeadingMints(b, b.optionSide);
    if (direction === OrderDirection.ASC) {
        return aMarket < bMarket ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aMarket < bMarket ? 1 : -1;
    }

    return 0;
};

const marketHeadingMints = (optionsMarket: HistoricalOptionsMarketInfo, optionSide: OptionSide) => {
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
        ? '='
        : '=';

    return optionsMarket.customMarket
        ? `${optionsMarket.country} ${orderbookSign} ${formatCurrency(
              optionsMarket.outcome || 0,
              optionsMarket.eventName === 'Flippening Markets' || optionsMarket.eventName === 'ETH/BTC market cap ratio'
                  ? 2
                  : 0
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`
        : `${getSynthName(optionsMarket.currencyKey)} ${orderbookSign} ${formatCurrencyWithSign(
              USD_SIGN,
              optionsMarket.strikePrice
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`;
};

export default UserMintsTable;
