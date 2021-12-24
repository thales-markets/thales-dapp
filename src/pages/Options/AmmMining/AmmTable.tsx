import { Paper, Table, TableBody, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderDirection } from '../Home/ExploreMarkets/ExploreMarketsDesktop';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from '../Home/MarketsTable/components';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import { PaginationWrapper, StyledTableRow } from '../Home/MarketsTable/MarketsTable';
import Pagination from '../Home/MarketsTable/Pagination';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import SearchMarket from '../Home/SearchMarket';
import { FlexDiv, LoaderContainer } from 'theme/common';
import { truncateAddress } from 'utils/formatters/string';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { StyledLink } from '../Market/components/MarketOverview/MarketOverview';
import SimpleLoader from 'components/SimpleLoader';
import styled from 'styled-components';

interface HeadCell {
    id: number;
    label: string;
    sortable: boolean;
}
type AmmTableInputData = {
    dataForUi: [string, number][];
    volume: number;
    orderBy: number;
    setOrderBy: (data: any) => void;
    orderDirection: OrderDirection;
    isLoading: boolean;
    setOrderDirection: (data: any) => void;
    deps: any;
};

const DEFAULT_ORDER_BY = 2;

const AmmTable: React.FC<AmmTableInputData> = ({
    dataForUi,
    volume,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    isLoading,
    deps,
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

    useEffect(() => setPage(0), deps);

    const slicedData = useMemo(() => {
        return dataForUi
            .filter((trade) => {
                if (assetSearch === '') return true;
                return trade[0].toLowerCase().includes(assetSearch.toLowerCase());
            })
            .sort((a, b) => (orderDirection === OrderDirection.ASC ? a[1] - b[1] : b[1] - a[1]))
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [dataForUi, orderBy, orderDirection, memoizedPage, rowsPerPage, assetSearch]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('options.amm-mining.address'), sortable: false },
        { id: 2, label: t('options.amm-mining.volume'), sortable: true },
        { id: 3, label: t('options.amm-mining.share'), sortable: false },
        { id: 4, label: t('options.amm-mining.rewards'), sortable: false },
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
                <SearchMarket assetSearch={assetSearch} setAssetSearch={setAssetSearch} />
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
                            {slicedData.map((trade: any, index: any) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>
                                            <StyledLink
                                                href={getEtherscanAddressLink(networkId, trade[0])}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {window.innerWidth < 768 ? truncateAddress(trade[0], 5, 3) : trade[0]}
                                            </StyledLink>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, trade[1], 1)}
                                        </StyledTableCell>
                                        <StyledTableCell>{((trade[1] / volume) * 100).toFixed(2)} %</StyledTableCell>
                                        <StyledTableCell>{((trade[1] / volume) * 20000).toFixed(2)}</StyledTableCell>
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

export default AmmTable;
