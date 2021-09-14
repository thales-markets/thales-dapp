import { Paper, Table, TableBody, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import bronze from 'assets/images/medals/bronze.png';
import gold from 'assets/images/medals/gold.png';
import leaderboardIcon from 'assets/images/medals/leaderboard.svg';
import silver from 'assets/images/medals/silver.png';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';
import { USD_SIGN } from 'constants/currency';
import { TooltipIcon } from 'pages/Options/CreateMarket/components';
import { StyledLink } from 'pages/Options/Market/components/MarketOverview/MarketOverview';
import useLeaderboardQuery, { Leaderboard } from 'queries/options/useLeaderboardQuery';
import useUsersDisplayNamesQuery from 'queries/user/useUsersDisplayNamesQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumnCentered, FlexDivRow, Image } from 'theme/common';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { Arrow, ArrowsWrapper, StyledTableCell, TableHeaderLabel } from '../../MarketsTable/components';
import { PaginationWrapper, StyledTableRow } from '../../MarketsTable/MarketsTable';
import Pagination from '../../MarketsTable/Pagination';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import './media.scss';

const headCells: HeadCell[] = [
    { id: 1, label: '', sortable: false },
    { id: 2, label: '', sortable: false },
    { id: 3, label: 'Rank', sortable: false },
    { id: 4, label: 'Display Name', sortable: false },
    { id: 5, label: 'Trades', sortable: true },
    { id: 6, label: 'Volume', sortable: true },
    { id: 7, label: 'NetProfit', sortable: true },
    { id: 8, label: 'Investment', sortable: true },
    { id: 9, label: 'Gain', sortable: true },
];

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const defaultOrderBy = 6; // Volume

const TradingCompetition: React.FC<any> = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const leaderboardQuery = useLeaderboardQuery(networkId, {
        enabled: isAppReady,
    });
    const competition = leaderboardQuery.data?.competition
        ? leaderboardQuery.data.competition.sort((a, b) => b.volume - a.volume)
        : [];

    const profiles = leaderboardQuery.data?.profiles;

    const displayNamesQuery = useUsersDisplayNamesQuery({
        enabled: isAppReady,
    });

    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const numberOfPages = Math.ceil(competition.length / rowsPerPage) || 1;

    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const profile = useMemo(() => {
        if (profiles && walletAddress) {
            console.log(profiles, walletAddress);
            return profiles.get(walletAddress.trim().toLowerCase());
        }
    }, [profiles, walletAddress]);

    console.log(profile);

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
            setPage(0);
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
        const sortedData = competition.sort((a, b) => {
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

            if (orderBy === 7) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.netProfit - a.netProfit;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.netProfit - b.netProfit;
                }
            }

            if (orderBy === 8) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.investment - a.investment;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.investment - b.investment;
                }
            }

            if (orderBy === 9) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.gain - a.gain;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.gain - b.gain;
                }
            }
            return 0;
        });
        const data = sortedData.map((leader: any, index: number) => {
            if (orderDirection === OrderDirection.DESC) return { rank: index + 1, ...leader };
            else {
            }
            return { rank: sortedData.length - index, ...leader };
        });
        return data
            .filter((leader) => {
                if (searchString === '') return true;
                if (leader.walletAddress.toLowerCase().includes(searchString.toLowerCase())) {
                    return true;
                }

                const disp = displayNamesMap.get(leader.walletAddress);

                if (disp) {
                    return disp.toLowerCase().includes(searchString.toLowerCase());
                }

                return false;
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [rowsPerPage, memoizedPage, searchString, orderBy, orderDirection, competition]);

    return (
        <FlexDivColumnCentered className="leaderboard__wrapper">
            <FlexDivRow style={{ marginTop: 50 }}>
                <SearchWrapper style={{ alignSelf: 'flex-start', flex: 1, maxWidth: 600, margin: '22px 0' }}>
                    <SearchInput
                        style={{ width: '100%', paddingRight: 40 }}
                        className="leaderboard__search"
                        onChange={(e) => setSearchString(e.target.value)}
                        value={searchString}
                        placeholder="Display Name"
                    ></SearchInput>
                </SearchWrapper>
                <Image className="leaderboard__icon" style={{ width: 100, height: 100 }} src={leaderboardIcon}></Image>
            </FlexDivRow>

            <TableContainer style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }} component={Paper}>
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
                                            className={`
                                                            ${
                                                                cell.sortable && orderBy === cell.id ? 'selected' : ''
                                                            }  ${
                                                cell.id === 7 ? 'leaderboard__columns__net-profit' : ''
                                            }`}
                                        >
                                            {cell.id === 7 && (
                                                <TooltipIcon title="Profit is only calculated on the matured markets"></TooltipIcon>
                                            )}
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
                    <TableBody className="leaderboard__tableBody">
                        {leaderboardData.map((leader: any, index: any) => {
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell>
                                        {(leader as any).rank <= 3 && (
                                            <Image src={getMedal(leader)} style={{ width: 40, height: 40 }}></Image>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>{(leader as any).rank}</StyledTableCell>
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
                                        {formatCurrencyWithSign(USD_SIGN, leader.volume, 2)}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            leader.netProfit < 0 ? Math.abs(leader.netProfit) : leader.netProfit,
                                            2
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(USD_SIGN, leader.investment)}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {Math.abs(leader.gain).toFixed(1)}%
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {competition.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    count={competition.length}
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
    );
};

interface HeadCell {
    id: keyof Leaderboard[];
    label: string;
    sortable: boolean;
}

export default TradingCompetition;

const getMedal = (leader: any) => {
    switch (leader.rank) {
        case 1:
            return gold;
        case 2:
            return silver;
        case 3:
            return bronze;
        default:
            return '';
    }
};
