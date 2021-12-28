import { Paper, Table, TableBody, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderDirection } from '../Home/ExploreMarkets/ExploreMarketsDesktop';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from '../Home/MarketsTable/components';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import { PaginationWrapper, StyledTableRow } from '../Home/MarketsTable/MarketsTable';
import Pagination from '../Home/MarketsTable/Pagination';
import SearchMarket from '../Home/SearchMarket';
import { FlexDiv, LoaderContainer } from 'theme/common';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { StyledLink } from '../Market/components/MarketOverview/MarketOverview';
import SimpleLoader from 'components/SimpleLoader';
import styled from 'styled-components';
import { getMarketTitleWithDate } from '../../../utils/formatters/market';
import Currency from '../../../components/Currency';
import { formatCurrencyWithSign } from '../../../utils/formatters/number';
import { USD_SIGN } from '../../../constants/currency';

interface HeadCell {
    id: number;
    label: string;
    sortable: boolean;
}
type AmmTableInputData = {
    dataForUi: any[]; // TODO: update type
    orderBy: number;
    setOrderBy: (data: any) => void;
    orderDirection: OrderDirection;
    isLoading: boolean;
    setOrderDirection: (data: any) => void;
};

const DEFAULT_ORDER_BY = 2;

const AmmReportingTable: React.FC<AmmTableInputData> = ({
    dataForUi,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    isLoading,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [page, setPage] = useState(0);
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [assetSearch, setAssetSearch] = useState<string>('');

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const numberOfPages = Math.ceil(dataForUi.length / rowsPerPage) || 1;

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

    const slicedData = useMemo(() => {
        return dataForUi
            .filter(() => {
                if (assetSearch === '') return true;
                return false;
            })
            .sort((a, b) => (orderDirection === OrderDirection.ASC ? a[1] - b[1] : b[1] - a[1]))
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [dataForUi, orderBy, orderDirection, memoizedPage, rowsPerPage, assetSearch]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.amm-reporting.market'), sortable: true },
        { id: 2, label: t('options.amm-reporting.volume'), sortable: true },
        { id: 3, label: t('options.amm-reporting.long-price'), sortable: true },
        { id: 4, label: t('options.amm-reporting.short-price'), sortable: true },
        { id: 5, label: t('options.amm-reporting.longs-volume'), sortable: true },
        { id: 6, label: t('options.amm-reporting.shorts-volume'), sortable: true },
        { id: 7, label: t('options.amm-reporting.total-volume'), sortable: true },
        { id: 8, label: t('options.amm-reporting.sell-volume'), sortable: true },
        { id: 9, label: t('options.amm-reporting.spent-on-market'), sortable: true },
        { id: 10, label: t('options.amm-reporting.longs-held'), sortable: true },
        { id: 11, label: t('options.amm-reporting.shorts-held'), sortable: true },
        { id: 12, label: t('options.amm-reporting.available-to-buy-long'), sortable: true },
        { id: 13, label: t('options.amm-reporting.available-to-buy-short'), sortable: true },
        { id: 14, label: t('options.amm-reporting.available-to-sell-long'), sortable: true },
        { id: 15, label: t('options.amm-reporting.available-to-sell-short'), sortable: true },
    ];

    return (
        <>
            <FlexDiv
                className="table-filters"
                style={{
                    justifyContent: 'flex-end',
                    background: '#04045a',
                    alignItems: 'center',
                    borderTopLeftRadius: '23px',
                    borderTopRightRadius: '23px',
                    width: '100%',
                }}
            >
                <SearchMarket
                    assetSearch={assetSearch}
                    setAssetSearch={setAssetSearch}
                    placeholder={t(`options.filters-labels.search-placeholder-for-mining`)}
                />
            </FlexDiv>

            {!isLoading && (
                <TableContainer
                    style={{
                        background: 'transparent',
                        boxShadow: 'none',
                        borderRadius: '0',
                    }}
                    component={Paper}
                >
                    <Table>
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
                            {slicedData.map((market: any, index: any) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell style={{ maxWidth: 200 }}>
                                            <Currency.Icon
                                                synthIconStyle={{
                                                    width: 24,
                                                    height: 24,
                                                    marginRight: 6,
                                                    marginBottom: -6,
                                                }}
                                                currencyKey={market.currencyKey}
                                            />
                                            <StyledLink
                                                href={getEtherscanAddressLink(networkId, market.address)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {getMarketTitleWithDate(market)}
                                            </StyledLink>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, market.volume.total)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, market.longPrice)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, market.shortPrice)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, market.volume.longBuyTotal)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, market.volume.shortBuyTotal)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                market.volume.longBuyTotal + market.volume.shortBuyTotal
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                market.volume.longSellTotal + market.volume.shortSellTotal
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, market.spentOnMarket)}
                                        </StyledTableCell>
                                        <StyledTableCell>{market.longsHeld}</StyledTableCell>
                                        <StyledTableCell>{market.shortsHeld}</StyledTableCell>
                                        <StyledTableCell>{market.availableToBuyLong}</StyledTableCell>
                                        <StyledTableCell>{market.availableToBuyShort}</StyledTableCell>
                                        <StyledTableCell>{market.availableToSellLong}</StyledTableCell>
                                        <StyledTableCell>{market.availableToSellShort}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                        {slicedData.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                        count={slicedData.length}
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
                <NoTrades>
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                </NoTrades>
            )}
        </>
    );
};

const NoTrades = styled(FlexDiv)`
    width: 100%;
    position: relative;
    min-height: 400px;
    background: #04045a;
`;

export default AmmReportingTable;
