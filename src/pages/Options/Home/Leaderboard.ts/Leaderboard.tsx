import { Paper } from '@material-ui/core';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import useLeaderboardQuery, { Leaderboard } from 'queries/options/useLeaderboardQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from '../MarketsTable/components';
import { PaginationWrapper, StyledTableRow } from '../MarketsTable/MarketsTable';
import gold from 'assets/images/medals/gold.png';
import silver from 'assets/images/medals/silver.png';
import bronze from 'assets/images/medals/bronze.png';
import leaderboardIcon from 'assets/images/medals/leaderboard.svg';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';
import downSelected from 'assets/images/down-selected.svg';
import upSelected from 'assets/images/up-selected.svg';
import { Background, FlexDivColumnCentered, FlexDivRow, Image, MainWrapper } from 'theme/common';
import { TableFooter } from '@material-ui/core';
import Pagination from '../MarketsTable/Pagination';
import { SearchInput, SearchWrapper } from '../SearchMarket/SearchMarket';
import MarketHeader from '../MarketHeader';
import ROUTES from 'constants/routes';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { StyledLink } from 'pages/Options/Market/components/MarketOverview/MarketOverview';
import { getEtherscanAddressLink } from 'utils/etherscan';
import useUsersDisplayNamesQuery from 'queries/user/useUsersDisplayNamesQuery';
import './media.css';

const headCells: HeadCell[] = [
    { id: 1, label: '', sortable: false },
    { id: 2, label: '', sortable: false },
    { id: 3, label: 'Rank', sortable: false },
    { id: 4, label: 'Display Name', sortable: false },
    { id: 5, label: 'Trades', sortable: true },
    { id: 6, label: 'Volume', sortable: true },
];

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const defaultOrderBy = 6; // Volume

const LeaderboardPage: React.FC<any> = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const leaderboardQuery = useLeaderboardQuery(networkId, {
        enabled: isAppReady,
    });
    const leaderboard: Leaderboard[] = leaderboardQuery.data
        ? leaderboardQuery.data.sort((a, b) => b.volume - a.volume)
        : [];

    const displayNamesQuery = useUsersDisplayNamesQuery({
        enabled: isAppReady,
    });

    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const numberOfPages = Math.ceil(leaderboard.length / rowsPerPage) || 1;

    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages]);

    const displayNamesMap = useMemo(() => (displayNamesQuery.isSuccess ? displayNamesQuery.data : new Map()), [
        displayNamesQuery,
    ]);

    const leaderboardData = useMemo(() => {
        const searchLeader = leaderboard.filter((leader) => {
            if (searchString === '') return true;
            if (leader.walletAddress.toLowerCase().includes(searchString.toLowerCase())) {
                return true;
            }

            const disp = displayNamesMap.get(leader.walletAddress);

            if (disp) {
                return disp.toLowerCase().includes(searchString.toLowerCase());
            }

            return false;
        });
        return searchLeader.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1)).sort((a, b) => {
            if (orderBy === 5) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.trades - a.trades;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.trades - b.trades;
                }
            }
            if (orderBy === 6) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.volume - a.volume;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.volume - b.volume;
                }
            }
            return 0;
        });
    }, [rowsPerPage, memoizedPage, searchString, leaderboard, orderBy, orderDirection]);

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <MainWrapper>
                <FlexDivColumnCentered className="leaderboard">
                    <MarketHeader route={ROUTES.Options.Leaderboard} />
                    <FlexDivColumnCentered className="leaderboard__wrapper" style={{ padding: '40px 140px' }}>
                        <FlexDivRow>
                            <SearchWrapper style={{ alignSelf: 'flex-start', flex: 1, maxWidth: 600 }}>
                                <SearchInput
                                    style={{ width: '100%' }}
                                    className="leaderboard__search"
                                    onChange={(e) => setSearchString(e.target.value)}
                                    value={searchString}
                                    placeholder="Display Name"
                                ></SearchInput>
                            </SearchWrapper>
                            <Image
                                className="leaderboard__icon"
                                style={{ width: 100, height: 100 }}
                                src={leaderboardIcon}
                            ></Image>
                        </FlexDivRow>

                        <TableContainer
                            style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }}
                            component={Paper}
                        >
                            <Table className="leaderboard__table" aria-label="customized table">
                                <TableHead
                                    className="leaderboard__columns"
                                    style={{ textTransform: 'uppercase', background: '#04045a' }}
                                >
                                    <TableRow>
                                        {headCells.map((cell: HeadCell, index) => {
                                            return (
                                                <StyledTableCell
                                                    onClick={cell.sortable ? calcDirection.bind(this, cell) : () => {}}
                                                    key={index}
                                                    style={cell.sortable ? { cursor: 'pointer' } : {}}
                                                >
                                                    <TableHeaderLabel
                                                        className={
                                                            cell.sortable && orderBy === cell.id ? 'selected' : ''
                                                        }
                                                    >
                                                        {cell.label}
                                                    </TableHeaderLabel>
                                                    {cell.sortable && (
                                                        <ArrowsWrapper>
                                                            {orderBy === cell.id &&
                                                            orderDirection !== OrderDirection.NONE ? (
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
                                <TableBody className="leaderboard__tableBody">
                                    {leaderboardData.map((leader: Leaderboard, index: any) => {
                                        return (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell>
                                                    {page === 0 &&
                                                        index < 3 &&
                                                        orderDirection === OrderDirection.DESC &&
                                                        orderBy === 6 && (
                                                            <Image
                                                                src={getMedal(index)}
                                                                style={{ width: 40, height: 40 }}
                                                            ></Image>
                                                        )}
                                                </StyledTableCell>
                                                <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                                                <StyledTableCell>
                                                    <StyledLink
                                                        href={getEtherscanAddressLink(networkId, leader.walletAddress)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {displayNamesMap.get(leader.walletAddress)
                                                            ? displayNamesMap.get(leader.walletAddress)
                                                            : leader.walletAddress}
                                                    </StyledLink>
                                                </StyledTableCell>
                                                <StyledTableCell>{leader.trades}</StyledTableCell>
                                                <StyledTableCell>
                                                    {formatCurrencyWithSign(USD_SIGN, leader.volume)}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        );
                                    })}
                                </TableBody>
                                {leaderboard.length !== 0 && (
                                    <TableFooter>
                                        <TableRow>
                                            <PaginationWrapper
                                                rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                count={leaderboard.length}
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
                    </FlexDivColumnCentered>
                </FlexDivColumnCentered>
            </MainWrapper>
        </Background>
    );
};

interface HeadCell {
    id: keyof Leaderboard[];
    label: string;
    sortable: boolean;
}

export default LeaderboardPage;

const getMedal = (index: number) => {
    switch (index) {
        case 0:
            return gold;
        case 1:
            return silver;
        case 2:
            return bronze;
        default:
            return '';
    }
};
