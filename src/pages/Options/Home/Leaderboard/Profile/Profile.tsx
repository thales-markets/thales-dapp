import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    withStyles,
} from '@material-ui/core';
import useLeaderboardQuery from 'queries/options/useLeaderboardQuery';
import useUsersDisplayNamesQuery from 'queries/user/useUsersDisplayNamesQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { TableHeaderLabel } from '../../MarketsTable/components';
import { PaginationWrapper } from '../../MarketsTable/MarketsTable';
import Pagination from '../../MarketsTable/Pagination';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import { StyledTableCell } from '../LeaderboardTable/LeaderboardTable';
import './media.scss';
import UsersExercises from './UsersExcercises';
import UsersMints from './UsersMints';
import UsersTrades from './UsersTrades';
import UsersUnclaimed from './UsersUnclaimed';

export enum Filters {
    Mints = 'mints',
    Trades = 'trades',
    Excercises = 'excercises',
    Unclaimed = 'unclaimed',
}

const Profile: React.FC<any> = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    // const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const walletAddress = '0x20f9ddfa193d0fe2f73d8b7d749b1355ef019887';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [userFilter, setUserFilter] = useState<string>('');
    const [filter, setFilter] = useState<string>(Filters.Mints);

    const leaderboardQuery = useLeaderboardQuery(networkId, {
        enabled: isAppReady,
    });

    const displayNamesQuery = useUsersDisplayNamesQuery({
        enabled: isAppReady,
    });

    const displayNamesMap = useMemo(() => (displayNamesQuery.isSuccess ? displayNamesQuery.data : new Map()), [
        displayNamesQuery,
    ]);

    const profiles = leaderboardQuery.data?.profiles;

    const profile = useMemo(() => {
        if (profiles && walletAddress) {
            if (userFilter) {
                let filteredAddressByDisplayName;

                for (const [key, value] of displayNamesMap.entries()) {
                    if (value.toLowerCase().includes(userFilter.toLowerCase()))
                        filteredAddressByDisplayName = key.trim().toLowerCase();
                }

                if (filteredAddressByDisplayName) {
                    return profiles.get(filteredAddressByDisplayName);
                }

                const filteredAdresses = Array.from(profiles.keys()).filter((key) =>
                    key.toLowerCase().includes(userFilter.toLowerCase())
                );
                const address = filteredAdresses.length === 1 ? filteredAdresses[0] : '';
                if (address) {
                    return profiles.get(address.trim().toLowerCase());
                }
            }
            return profiles.get(walletAddress.trim().toLowerCase());
        }
    }, [profiles, walletAddress, userFilter]);

    const extractMintsProfileData = useMemo(() => {
        const mintsMap = new Map();
        profile?.mints.map((mint: any) => {
            if (mintsMap.get(mint.market.address)) {
                const txsPerMarket = mintsMap.get(mint.market.address);
                txsPerMarket.push(mint.tx);
                mintsMap.set(mint.market.address, txsPerMarket);
            } else {
                mintsMap.set(mint.market.address, [mint.tx]);
            }
        });
        return mintsMap;
    }, [userFilter]);

    const extractTradesProfileData = useMemo(() => {
        const tradesMap = new Map();
        profile?.trades.map((trade: any) => {
            if (tradesMap.get(trade.market.address)) {
                const tradesPerMarket = tradesMap.get(trade.market.address);
                tradesPerMarket.push(trade.trade);
                tradesMap.set(trade.market.address, tradesPerMarket);
            } else {
                tradesMap.set(trade.market.address, [trade.trade]);
            }
        });
        return tradesMap;
    }, [userFilter]);

    const extractExercisesProfileData = useMemo(() => {
        const exercisesMap = new Map();
        profile?.excercises.map((exercise: any) => {
            if (exercisesMap.get(exercise.market.address)) {
                const txsPerMarket = exercisesMap.get(exercise.market.address);
                txsPerMarket.push(exercise.tx);
                exercisesMap.set(exercise.market.address, txsPerMarket);
            } else {
                exercisesMap.set(exercise.market.address, [exercise.tx]);
            }
        });

        return exercisesMap;
    }, [userFilter]);

    const extractUnclaimedProfileData = useMemo(() => {
        const unclaimedMap = new Map();
        profile?.unclaimed.map((unclaimed: any) => {
            if (unclaimedMap.get(unclaimed.market.address)) {
                const txsPerMarket = unclaimedMap.get(unclaimed.market.address);
                txsPerMarket.push(unclaimed);
                unclaimedMap.set(unclaimed.market.address, txsPerMarket);
            } else {
                unclaimedMap.set(unclaimed.market.address, [unclaimed]);
            }
        });

        return unclaimedMap;
    }, [userFilter]);

    const [page, setPage] = useState(0);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const numberOfPages = useMemo(() => {
        let pages;
        switch (filter) {
            case Filters.Mints:
                pages = Math.ceil(Array.from(extractMintsProfileData.keys()).length / rowsPerPage) || 1;
                break;
            case Filters.Trades:
                pages = Math.ceil(Array.from(extractTradesProfileData.keys()).length / rowsPerPage) || 1;
                break;
            case Filters.Excercises:
                pages = Math.ceil(Array.from(extractExercisesProfileData.keys()).length / rowsPerPage) || 1;
                break;
            case Filters.Unclaimed:
                pages = Math.ceil(Array.from(extractUnclaimedProfileData.keys()).length / rowsPerPage) || 1;
                break;
            default:
                pages = 0;
        }
        return pages;
    }, [filter, rowsPerPage]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            console.log(page);
            console.log(numberOfPages);
            return numberOfPages - 1;
        }
        console.log(page);
        return page;
    }, [page, numberOfPages, filter, userFilter]);

    const profileData = useMemo(() => {
        let data;
        switch (filter) {
            case Filters.Mints:
                data = Array.from(extractMintsProfileData.keys());
                break;
            case Filters.Trades:
                data = Array.from(extractTradesProfileData.keys());
                break;
            case Filters.Excercises:
                data = Array.from(extractExercisesProfileData.keys());
                break;
            case Filters.Unclaimed:
                data = Array.from(extractUnclaimedProfileData.keys());
                break;
            default:
                data = [];
        }
        return data.slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [rowsPerPage, memoizedPage, userFilter, filter, profiles]);

    const headCells: HeadCell[] = [{ id: 1, label: '', sortable: false }];

    return (
        <FlexDivColumnCentered className="leaderboard__wrapper">
            <FlexDivRow style={{ flexDirection: 'row-reverse' }}>
                <SearchWrapper style={{ alignSelf: 'flex-start', flex: 1, maxWidth: 400, margin: '22px 0' }}>
                    <SearchInput
                        style={{ width: '100%', paddingRight: 40 }}
                        className="leaderboard__search"
                        onChange={(e) => setUserFilter(e.target.value)}
                        value={userFilter}
                        placeholder="Display Name"
                    ></SearchInput>
                </SearchWrapper>
                <FilterWrapper>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.Mints ? 'selected' : ''}
                        onClick={() => setFilter(Filters.Mints)}
                    >
                        Mints
                    </FilterButton>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.Trades ? 'selected' : ''}
                        onClick={() => setFilter(Filters.Trades)}
                    >
                        Trades
                    </FilterButton>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.Excercises ? 'selected' : ''}
                        onClick={() => setFilter(Filters.Excercises)}
                    >
                        Exercises
                    </FilterButton>
                    <FilterButton
                        style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                        className={filter === Filters.Unclaimed ? 'selected' : ''}
                        onClick={() => setFilter(Filters.Unclaimed)}
                    >
                        Unclaimed
                    </FilterButton>
                </FilterWrapper>
            </FlexDivRow>
            <DataWrapper>
                <TableContainer
                    style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }}
                    component={Paper}
                >
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {headCells.map((cell: HeadCell, index) => {
                                    return (
                                        <StyledTableCell key={index}>
                                            <TableHeaderLabel>{cell.label}</TableHeaderLabel>
                                        </StyledTableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filter === Filters.Mints &&
                                profileData.map((key, index) => {
                                    return (
                                        <StyledTableRow key={index}>
                                            <UsersMints
                                                key={index}
                                                market={
                                                    profile?.mints
                                                        .filter((mint: any) => mint.market.address === key)
                                                        .map((mint: any) => mint.market)[0]
                                                }
                                                usersMints={extractMintsProfileData.get(key)}
                                            />
                                        </StyledTableRow>
                                    );
                                })}
                            {filter === Filters.Trades &&
                                profileData.map((key, index) => {
                                    return (
                                        <StyledTableRow key={index}>
                                            <UsersTrades
                                                key={index}
                                                market={
                                                    profile?.trades
                                                        .filter((trade: any) => trade.market.address === key)
                                                        .map((trade: any) => trade.market)[0]
                                                }
                                                usersTrades={extractTradesProfileData.get(key)}
                                            />
                                        </StyledTableRow>
                                    );
                                })}

                            {filter === Filters.Excercises &&
                                profileData.map((key, index) => {
                                    return (
                                        <StyledTableRow key={index}>
                                            <UsersExercises
                                                key={index}
                                                market={
                                                    profile?.excercises
                                                        .filter((excercise: any) => excercise.market.address === key)
                                                        .map((excercise: any) => excercise.market)[0]
                                                }
                                                usersExercises={extractExercisesProfileData.get(key)}
                                            />
                                        </StyledTableRow>
                                    );
                                })}

                            {filter === Filters.Unclaimed &&
                                profileData.map((key, index) => {
                                    return (
                                        <StyledTableRow key={index}>
                                            <UsersUnclaimed
                                                key={index}
                                                market={
                                                    profile?.unclaimed
                                                        .filter((unclaimed: any) => unclaimed.market.address === key)
                                                        .map((unclaimed: any) => unclaimed.market)[0]
                                                }
                                                usersUnclaimed={extractUnclaimedProfileData.get(key)}
                                            />
                                        </StyledTableRow>
                                    );
                                })}
                        </TableBody>
                        {profileData.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <PaginationWrapper
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        count={profileData.length}
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
            </DataWrapper>
        </FlexDivColumnCentered>
    );
};

interface HeadCell {
    id: number;
    label: string;
    sortable: boolean;
}

export const StyledTableRow = withStyles(() => ({
    root: {
        background: 'transparent',
        '&:last-child': {
            borderBottomLeftRadius: '23px',
            borderBottomRightRadius: '23px',
        },
        '&:last-child > td:first-child': {
            borderBottomLeftRadius: '23px',
            borderTopLeftRadius: '23px !important',
        },
        '&:last-child a:last-child td': {
            borderBottomRightRadius: '23px',
            borderTopRightRadius: '23px !important',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: '#0a0b52',
            },
        },
    },
}))(TableRow);

const FilterWrapper = styled(FlexDiv)`
    padding: 0 25px;
    position: relative;
    &:after {
        position: absolute;
        content: '';
        display: block;
        bottom: 1px;
        left: 0px;
        height: 1px;
        width: 100%;
    }
`;

export const FilterButton = styled.button`
    border: 1px solid #0a2e66;
    border-radius: 20px;
    max-height: 48px;
    background-color: transparent;
    cursor: pointer;
    margin-left: 10px;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.35px;
    color: #f6f6fe;
    margin: 0 9px;
    padding: 6px 16px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        border: 1px solid #0a2e66;
        color: #b8c6e5;
    }
    &.selected {
        background: #0a2e66;
        border: 1px solid #00f9ff;
        color: #00f9ff;
    }
    &.selected:hover {
        background: rgba(1, 38, 81, 0.8);
        border: 1px solid #00f9ff;
        color: #b8c6e5;
    }
`;

const DataWrapper = styled(FlexDivColumn)`
    padding-bottom: 20px;
    border-bottom-right-radius: 23px;
    border-bottom-left-radius: 23px;
`;

export default Profile;
