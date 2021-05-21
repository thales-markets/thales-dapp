import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { OptionsMarkets } from 'types/options';
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
import { formatCurrency } from 'utils/formatters/number';
import { useTranslation } from 'react-i18next';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { navigateToOptionsMarket } from 'utils/routes';
import { Arrow, ArrowsWrapper, PhaseLabel, Row, StyledTableCell, TableHeaderLabel, Star } from './components';
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

dotenv.config();

type MarketsTableProps = {
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets: string[];
    isLoading?: boolean;
    phase: PhaseFilterEnum;
    onChange: any;
};

const StyledTableRow = withStyles(() => ({
    root: {
        background: '#126',
        '&:nth-of-type(odd)': {
            background: '#116',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: '#04045A',
            },
        },
    },
}))(TableRow);

const Divider: React.FC = () => {
    return (
        <Row>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </Row>
    );
};

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

interface HeadCell {
    id: keyof OptionsMarkets;
    label: string;
    sortable: boolean;
}

const headCells: HeadCell[] = [
    { id: 1, label: '', sortable: false },
    { id: 2, label: 'Asset', sortable: true },
    { id: 3, label: 'Strike Price', sortable: true },
    { id: 4, label: 'Pool Size', sortable: true },
    { id: 5, label: 'Long/Short', sortable: true },
    { id: 6, label: 'Time Remaining', sortable: false },
    { id: 7, label: 'Open Orders', sortable: true },
    { id: 8, label: 'Phase', sortable: false },
];

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const defaultOrderBy = 5; // time remaining

const MarketsTable: FC<MarketsTableProps> = memo(
    ({ optionsMarkets, watchlistedMarkets, children, phase, onChange }) => {
        const [page, setPage] = useState(0);
        const handleChangePage = (_event: unknown, newPage: number) => {
            setPage(newPage);
        };
        const [orderBy, setOrderBy] = useState(defaultOrderBy);
        const [orderDirection, setOrderDirection] = useState(OrderDirection.NONE);
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
                        setOrderDirection(OrderDirection.NONE);
                        setOrderBy(defaultOrderBy);
                        break;
                }
            } else {
                setOrderBy(parseInt(cell.id.toString()));
                setOrderDirection(OrderDirection.DESC);
            }
        };

        useEffect(() => setPage(0), [phase]);

        const compareStrings = (a: string, b: string) => {
            if (a < b) {
                return orderDirection === OrderDirection.ASC ? -1 : 1;
            }
            if (a > b) {
                return orderDirection === OrderDirection.ASC ? 1 : -1;
            }

            return 0;
        };

        const toggleWatchlist = async (marketAddress: string) => {
            try {
                const result = await axios.post(process.env.REACT_APP_THALES_API_URL + '/watchlist', {
                    networkId,
                    walletAddress,
                    marketAddress,
                });
                onChange(result.data.data);
            } catch (e) {
                console.log(e);
            }
        };

        const sortedMArkets = useMemo(() => {
            return optionsMarkets
                .sort((a, b) => {
                    switch (orderBy) {
                        case 1:
                            return compareStrings(a.asset, b.asset);
                        case 2:
                            return orderDirection === OrderDirection.ASC
                                ? a.strikePrice - b.strikePrice
                                : b.strikePrice - a.strikePrice;
                        case 3:
                            return orderDirection === OrderDirection.ASC
                                ? a.poolSize - b.poolSize
                                : b.poolSize - a.poolSize;
                        case 4:
                            return orderDirection === OrderDirection.ASC
                                ? a.longPrice - b.longPrice
                                : b.longPrice - a.longPrice;
                        case 5:
                            const phaseDiff = a.phaseNum - b.phaseNum;
                            return phaseDiff === 0 ? a.timeRemaining - b.timeRemaining : phaseDiff;
                        case 6:
                            return orderDirection === OrderDirection.ASC
                                ? a.openOrders - b.openOrders
                                : b.openOrders - a.openOrders;
                        default:
                            return 0;
                    }
                })
                .slice(page * 10, 10 * (page + 1));
        }, [optionsMarkets, orderBy, orderDirection, page]);

        const { t } = useTranslation();
        return (
            <>
                <TableContainer style={{ background: 'transparent', boxShadow: 'none' }} component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
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
                                                        ></Arrow>
                                                    ) : (
                                                        <>
                                                            <Arrow src={up}></Arrow>
                                                            <Arrow src={down}></Arrow>
                                                        </>
                                                    )}
                                                </ArrowsWrapper>
                                            )}
                                        </StyledTableCell>
                                    );
                                })}
                            </TableRow>
                            <Divider />
                        </TableHead>

                        <TableBody>
                            {sortedMArkets.map((market, index) => {
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
                                        >
                                            <Star
                                                src={watchlistedMarkets?.includes(market.address) ? fullStar : star}
                                            ></Star>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Currency.Name
                                                currencyKey={market.currencyKey}
                                                showIcon={true}
                                                iconProps={{ width: '24px', height: '24px', type: 'asset' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>{market.strikePrice.toFixed(2)}</StyledTableCell>
                                        <StyledTableCell>{market.poolSize.toFixed(2)}</StyledTableCell>
                                        <StyledTableCell>
                                            <div>
                                                <span style={{ color: '#10BA97' }}>
                                                    {t('common.val-in-cents', {
                                                        val: formatCurrency(market.longPrice * 100),
                                                    })}
                                                </span>{' '}
                                                /{' '}
                                                <span style={{ color: '#D94454' }}>
                                                    {t('common.val-in-cents', {
                                                        val: formatCurrency(market.shortPrice * 100),
                                                    })}
                                                </span>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <TimeRemaining end={market.timeRemaining} />
                                        </StyledTableCell>
                                        <StyledTableCell>{market.openOrders}</StyledTableCell>
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
                                        page={page}
                                        onChangePage={handleChangePage}
                                        ActionsComponent={() => (
                                            <Pagination
                                                page={page}
                                                numberOfPages={Math.ceil(optionsMarkets.length / 10)}
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

export default MarketsTable;
