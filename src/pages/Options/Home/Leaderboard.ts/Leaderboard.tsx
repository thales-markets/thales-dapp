import { Paper } from '@material-ui/core';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import useLeaderboardQuery, { Leaderboard } from 'queries/options/useLeaderboardQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { StyledTableCell, TableHeaderLabel } from '../MarketsTable/components';
import { PaginationWrapper, StyledTableRow } from '../MarketsTable/MarketsTable';
import gold from 'assets/images/medals/gold.png';
import silver from 'assets/images/medals/silver.png';
import bronze from 'assets/images/medals/bronze.png';
import leaderboardIcon from 'assets/images/medals/leaderboard.svg';
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

const headCells: HeadCell[] = [
    { id: 1, label: '', sortable: false },
    { id: 2, label: '', sortable: false },
    { id: 3, label: 'Rank', sortable: false },
    { id: 4, label: 'Display Name', sortable: false },
    { id: 5, label: 'Trades', sortable: false },
    { id: 6, label: 'Volume', sortable: false },
];

const LeaderboardPage: React.FC<any> = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const leaderboardQuery = useLeaderboardQuery(networkId, {
        enabled: isAppReady,
    });
    const leaderboard: Leaderboard[] = leaderboardQuery.data
        ? leaderboardQuery.data.sort((a, b) => b.volume - a.volume)
        : [];

    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const numberOfPages = Math.ceil(leaderboard.length / rowsPerPage) || 1;

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

    const leaderboardData = useMemo(() => {
        const searchLeader = leaderboard.filter((leader) => {
            return searchString === '' ? true : leader.walletAddress.includes(searchString);
        });
        return searchLeader.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [rowsPerPage, memoizedPage, searchString, leaderboard]);

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <MainWrapper>
                <FlexDivColumnCentered>
                    <MarketHeader route={ROUTES.Options.Leaderboard} />
                    <FlexDivColumnCentered style={{ padding: '40px 140px' }}>
                        <FlexDivRow>
                            <SearchWrapper style={{ alignSelf: 'flex-start' }}>
                                <SearchInput
                                    onChange={(e) => setSearchString(e.target.value)}
                                    value={searchString}
                                    placeholder="Display Name"
                                ></SearchInput>
                            </SearchWrapper>
                            <Image style={{ width: 100, height: 100 }} src={leaderboardIcon}></Image>
                        </FlexDivRow>

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
                                                    key={index}
                                                    style={cell.sortable ? { cursor: 'pointer' } : {}}
                                                >
                                                    <TableHeaderLabel>{cell.label}</TableHeaderLabel>
                                                </StyledTableCell>
                                            );
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaderboardData.map((leader: Leaderboard, index: any) => {
                                        return (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell>
                                                    {page === 0 && index < 3 && (
                                                        <Image
                                                            src={getMedal(index)}
                                                            style={{ width: 40, height: 40 }}
                                                        ></Image>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>
                                                    <StyledLink
                                                        href={getEtherscanAddressLink(networkId, leader.walletAddress)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {leader.walletAddress}
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
