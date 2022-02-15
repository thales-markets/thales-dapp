import { Table, TableBody, TableFooter, TableHead, TableRow } from '@material-ui/core';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import longIcon from 'assets/images/long_small.svg';
import shortIcon from 'assets/images/short_small.svg';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';
import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
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
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import { marketHeading } from '../../Trades/Trades';
import { HeadCell, OrderDirection } from '../Profile';

type UserUnclaimedTableProps = {
    usersUnclaimed: any[];
    marketsData: any[];
    userDisplay: boolean;
    sortByField: any;
    sortByMarketHeading: any;
};

const DEFAULT_ORDER_BY = 1;

const UserUnclaimedTable: React.FC<UserUnclaimedTableProps> = ({
    usersUnclaimed,
    marketsData,
    userDisplay,
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
        return Math.ceil(usersUnclaimed.length / rowsPerPage) || 1;
    }, [rowsPerPage, usersUnclaimed]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages, usersUnclaimed]);

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

    const sortedUnclaimed = useMemo(() => {
        return usersUnclaimed
            .sort((a, b) => {
                if (orderBy === 1) {
                    const bMarket = marketsData.filter((market) => market.address === b.market.address)[0];
                    const aMarket = marketsData.filter((market) => market.address === a.market.address)[0];
                    return sortByMarketHeading(aMarket, bMarket, orderDirection);
                }
                if (orderBy === 2) {
                    return sortByField(a.market, b.market, orderDirection, 'result');
                }
                if (orderBy === 3) {
                    const claimAmountA = a.market.result === 'long' ? a.long : a.short;
                    const claimAmountB = b.market.result === 'long' ? b.long : b.short;

                    if (orderDirection === OrderDirection.ASC) {
                        return claimAmountA > claimAmountB ? 1 : -1;
                    }
                    if (orderDirection === OrderDirection.DESC) {
                        return claimAmountA > claimAmountB ? -1 : 1;
                    }

                    return 0;
                }

                return 0;
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [orderBy, orderDirection, memoizedPage, rowsPerPage, usersUnclaimed]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.profile.markets.result'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
    ];

    return (
        <>
            {sortedUnclaimed.length !== 0 && (
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
                        {sortedUnclaimed.map((unclaimed: any, index: any) => {
                            const market = marketsData.filter(
                                (market) => market.address === unclaimed.market.address
                            )[0];
                            return (
                                <StyledTableRow key={index}>
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
                                                <StyledLink
                                                    href={buildOptionsMarketLink(market.address, unclaimed.side)}
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
                                                    <CryptoName>{marketHeading(market, unclaimed.side)}</CryptoName>
                                                </StyledLink>
                                            </LightTooltip>
                                        </FlexDiv>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {unclaimed.market.result === 'long' ? (
                                            <SideImage src={longIcon} />
                                        ) : (
                                            <SideImage src={shortIcon} />
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        style={
                                            index === sortedUnclaimed.length - 1 ? { borderRadius: '0 0 23px 0' } : {}
                                        }
                                    >
                                        {unclaimed.market.result === 'long'
                                            ? formatCurrencyWithSign(USD_SIGN, unclaimed.long)
                                            : formatCurrencyWithSign(USD_SIGN, unclaimed.short)}
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {sortedUnclaimed.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                    count={sortedUnclaimed.length}
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
            {sortedUnclaimed.length === 0 && (
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

const LoaderContainer = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    position: relative;
    border-radius: 23px;
`;

const CryptoName = styled.span``;

const SideImage = styled.img`
    width: 38px;
`;

export const CustomIcon = styled(Image)`
    margin-bottom: -6px;
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;

export default UserUnclaimedTable;
