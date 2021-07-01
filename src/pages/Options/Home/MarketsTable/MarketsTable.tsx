import React, { memo, useEffect, useMemo, useState } from 'react';
import { HistoricalOptionsMarketInfo, OptionsMarkets } from 'types/options';
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
import { useTranslation } from 'react-i18next';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { navigateToOptionsMarket } from 'utils/routes';
import { Arrow, ArrowsWrapper, PhaseLabel, StyledTableCell, TableHeaderLabel, Star } from './components';
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
import { USD_SIGN } from 'constants/currency';

dotenv.config();

type MarketsTableProps = {
    optionsMarkets: OptionsMarkets;
    watchlistedMarkets: string[];
    isLoading?: boolean;
    phase: PhaseFilterEnum;
    onChange: any;
};

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
    { id: 5, label: 'Time Remaining', sortable: true },
    { id: 6, label: 'Open Orders', sortable: true },
    { id: 7, label: 'Phase', sortable: false },
];

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const defaultOrderBy = 5; // time remaining

const MarketsTable: React.FC<MarketsTableProps> = memo(
    ({ optionsMarkets, watchlistedMarkets, children, phase, onChange }) => {
        const [page, setPage] = useState(0);
        const handleChangePage = (_event: unknown, newPage: number) => {
            setPage(newPage);
        };
        const [orderBy, setOrderBy] = useState(defaultOrderBy);
        const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
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
                        setOrderDirection(OrderDirection.DESC);
                        setOrderBy(defaultOrderBy);
                        break;
                }
            } else {
                setOrderBy(parseInt(cell.id.toString()));
                setOrderDirection(OrderDirection.DESC);
            }
        };

        useEffect(() => setPage(0), [phase]);

        const toggleWatchlist = async (marketAddress: string) => {
            try {
                await axios.post(process.env.REACT_APP_THALES_API_URL + '/watchlist', {
                    networkId,
                    walletAddress,
                    marketAddress,
                });
                onChange();
            } catch (e) {
                console.log(e);
            }
        };

        const sortedMArkets = useMemo(() => {
            return optionsMarkets
                .sort((a, b) => {
                    switch (orderBy) {
                        case 1:
                        case 2:
                            return sortByAssetName(a, b, orderDirection);
                        case 3:
                            return sortByStrikePrice(a, b, orderDirection);
                        case 4:
                            return sortByPoolSize(a, b, orderDirection);
                        case 5:
                            return sortByTime(a, b, orderDirection);
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
                                            style={{ paddingRight: 0 }}
                                        >
                                            <Star
                                                src={watchlistedMarkets?.includes(market.address) ? fullStar : star}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Currency.Name
                                                currencyKey={market.currencyKey}
                                                showIcon={true}
                                                iconProps={{ width: '32px', height: '32px', type: 'asset' }}
                                                synthIconStyle={{ width: 32, height: 32 }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>{USD_SIGN + market.strikePrice.toFixed(2)}</StyledTableCell>
                                        <StyledTableCell>{USD_SIGN + market.poolSize.toFixed(2)}</StyledTableCell>
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

const StyledTableRow = withStyles(() => ({
    root: {
        background: '#04045a',
        '&:last-child': {
            borderBottomLeftRadius: '23px',
            borderBottomRightRadius: '23px',
        },
        '&:last-child td:first-child': {
            borderBottomLeftRadius: '23px',
        },
        '&:last-child td:last-child': {
            borderBottomRightRadius: '23px',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: '#0a0b52',
            },
        },
    },
}))(TableRow);

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

const sortByTime = (a: HistoricalOptionsMarketInfo, b: HistoricalOptionsMarketInfo, direction: OrderDirection) => {
    if (direction === OrderDirection.ASC && a.phaseNum === b.phaseNum) {
        return a.timeRemaining > b.timeRemaining ? -1 : 1;
    }
    if (direction === OrderDirection.DESC && a.phaseNum === b.phaseNum) {
        return a.timeRemaining > b.timeRemaining ? 1 : -1;
    }

    return 0;
};

const sortByPoolSize = (a: HistoricalOptionsMarketInfo, b: HistoricalOptionsMarketInfo, direction: OrderDirection) => {
    if (direction === OrderDirection.ASC) {
        if (a.phaseNum === b.phaseNum) {
            return a.poolSize > b.poolSize ? 1 : -1;
        }
    }
    if (direction === OrderDirection.DESC) {
        if (a.phaseNum === b.phaseNum) {
            return a.poolSize > b.poolSize ? -1 : 1;
        }
    }

    return 0;
};

const sortByStrikePrice = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection
) => {
    if (direction === OrderDirection.ASC) {
        if (a.phaseNum === b.phaseNum) {
            return a.strikePrice > b.strikePrice ? 1 : -1;
        }
    }
    if (direction === OrderDirection.DESC) {
        if (a.phaseNum === b.phaseNum) {
            return a.strikePrice > b.strikePrice ? -1 : 1;
        }
    }

    return 0;
};

const sortByAssetName = (a: HistoricalOptionsMarketInfo, b: HistoricalOptionsMarketInfo, direction: OrderDirection) => {
    if (direction === OrderDirection.ASC) {
        if (a.phaseNum === b.phaseNum) {
            return a.asset > b.asset ? 1 : -1;
        }
    }
    if (direction === OrderDirection.DESC) {
        if (a.phaseNum === b.phaseNum) {
            return a.asset > b.asset ? -1 : 1;
        }
    }

    return 0;
};

export default MarketsTable;
