import { Paper } from '@material-ui/core';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from 'pages/Options/Home/MarketsTable/components';
import { PaginationWrapper, StyledTableRow } from 'pages/Options/Home/MarketsTable/MarketsTable';
import { TableFooter } from '@material-ui/core';
import Pagination from 'pages/Options/Home/MarketsTable/Pagination';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import SimpleLoader from 'components/SimpleLoader';
import { Staker, Stakers } from 'types/governance';
import { ArrowIconMedium, Blockie, LoaderContainer, StyledLink } from 'pages/Governance/components';
import makeBlockie from 'ethereum-blockies-base64';
import { truncateAddress } from 'utils/formatters/string';
import { FlexDiv } from 'theme/common';
import { NetworkId } from '@synthetixio/contracts-interface';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { LightMediumTooltip } from 'pages/Options/Market/components';
import snxJSConnector from 'utils/snxJSConnector';

interface HeadCell {
    id: keyof Staker[];
    label: string;
    sortable: boolean;
}

const DEFAULT_ORDER_BY = 2;

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type ThalesStakersTableProps = {
    stakers: Stakers;
    isLoading?: boolean;
    orderBy: number;
    setOrderBy: (data: any) => void;
    orderDirection: OrderDirection;
    setOrderDirection: (data: any) => void;
};

const ThalesStakersTable: React.FC<ThalesStakersTableProps> = ({
    stakers,
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
    const numberOfPages = Math.ceil(stakers.length / rowsPerPage) || 1;

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

    const sortedStakers = useMemo(() => {
        return stakers.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [stakers, orderBy, orderDirection, memoizedPage, rowsPerPage]);

    const headCells: HeadCell[] = [
        { id: 1, label: t('governance.stakers.staker-col'), sortable: true },
        { id: 2, label: t('governance.stakers.total-staked-col'), sortable: true },
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
                                            style={
                                                cell.sortable
                                                    ? cell.id === 1
                                                        ? { cursor: 'pointer', textAlign: 'left', paddingLeft: '70px' }
                                                        : { cursor: 'pointer' }
                                                    : cell.id === 1
                                                    ? { textAlign: 'left', paddingLeft: '80px' }
                                                    : {}
                                            }
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
                            {sortedStakers.map((staker: Staker, index: any) => {
                                const amountTooltip = `${formatCurrencyWithKey(
                                    THALES_CURRENCY,
                                    staker.stakedAmount
                                )} (${t('governance.stakers.tooltip-staked-directly')}) + ${formatCurrencyWithKey(
                                    THALES_CURRENCY,
                                    staker.escrowedAmount
                                )} (${t('governance.stakers.tooltip-escrowed-amount')})`;
                                return (
                                    <StakerRow key={index}>
                                        <StyledTableCell style={{ padding: '10px 10px 10px 30px' }}>
                                            <StyledLink
                                                href={getEtherscanAddressLink(NetworkId.Mainnet, staker.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <FlexDiv style={{ textAlign: 'left' }}>
                                                    <Blockie src={makeBlockie(staker.id)} style={{ marginBottom: 2 }} />
                                                    <StakerCell staker={staker} />
                                                    <ArrowIconMedium />
                                                </FlexDiv>
                                            </StyledLink>
                                        </StyledTableCell>
                                        <StyledTableCell style={{ padding: 10 }}>
                                            <LightMediumTooltip title={amountTooltip}>
                                                <Amount>
                                                    {formatCurrencyWithKey(THALES_CURRENCY, staker.totalStakedAmount)}
                                                </Amount>
                                            </LightMediumTooltip>
                                        </StyledTableCell>
                                    </StakerRow>
                                );
                            })}
                        </TableBody>
                        {sortedStakers.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                        count={sortedStakers.length}
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
                                        style={{ padding: '0 20px 0 30px' }}
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
            {sortedStakers.length === 0 && !isLoading && children}
        </>
    );
};

type StakerCellProps = {
    staker: Staker;
};

const StakerCell: React.FC<StakerCellProps> = ({ staker }) => {
    const [stakerEns, setStakerEns] = useState<string | null>(null);

    useEffect(() => {
        const fetchStakerEns = async () => {
            const stakerEns = await (snxJSConnector as any).provider.lookupAddress(staker.id);
            setStakerEns(stakerEns);
        };
        fetchStakerEns();
    }, [staker]);

    return <Address>{stakerEns != null ? stakerEns : truncateAddress(staker.id)}</Address>;
};

const Address = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
`;

const Amount = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
`;

const StakerRow = styled(StyledTableRow)`
    border-bottom: 1px solid #2d3079;
`;

export default ThalesStakersTable;
