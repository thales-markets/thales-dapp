import { Paper, TableContainer, TableRow, withStyles } from '@material-ui/core';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useProfilesQuery from 'queries/options/useProfilesQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRow, Text } from 'theme/common';
import { marketHeading } from '../Trades/Trades';
import './media.scss';
import UserAllTxTable from './UserAllTxTable';
import UserExercisesTable from './UserExercisesTable';
import UserMintsTable from './UserMintsTable';
import UserTradesTable from './UserTradesTable';
import UserUnclaimedTable from './UserUnclaimedTable';

export enum Filters {
    Mints = 'mints',
    Trades = 'trades',
    Excercises = 'excercises',
    Unclaimed = 'unclaimed',
    All = 'all',
}

export enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type ProfileProps = {
    displayNamesMap: Map<string, string>;
};

const Profile: React.FC<ProfileProps> = ({ displayNamesMap }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [userFilter, setUserFilter] = useState<string>('');
    console.log('setUserFilter ', setUserFilter.length);
    const [filter, setFilter] = useState<string>(Filters.All);
    const [displayAddress, setDisplayAddress] = useState<string>(walletAddress);

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, {
        enabled: isAppReady,
    });

    const marketsData = useMemo(() => (marketsQuery.data ? marketsQuery.data : []), [marketsQuery]);

    const profilesQuery = useProfilesQuery(networkId, {
        enabled: isAppReady,
    });

    const profiles = useMemo(() => (profilesQuery.data ? profilesQuery.data.profiles : new Map()), [profilesQuery]);

    const displayNamesAndAdressesOptions = useMemo(() => {
        const options: any[] = [];
        Array.from(displayNamesMap.values()).forEach((value: any) => options.push(value));
        profiles ? Array.from(profiles.keys()).forEach((key: any) => options.push(key)) : '';

        return options;
    }, [profiles, displayNamesMap]);

    console.log(displayNamesAndAdressesOptions.length);

    const invertedDisplayNamesMap = useMemo(() => {
        const invertedMap = new Map();
        for (const [key, value] of (displayNamesMap as any).entries()) {
            invertedMap.set(value, key);
        }
        return invertedMap;
    }, [displayNamesMap]);

    const profile = useMemo(() => {
        if (profiles) {
            if (userFilter) {
                const filteredDisplayNames = Array.from(invertedDisplayNamesMap.keys()).filter((key) =>
                    key.toLowerCase().includes(userFilter.toLowerCase())
                );

                const displayName = filteredDisplayNames.length === 1 ? filteredDisplayNames[0] : '';

                if (displayName) {
                    const address = invertedDisplayNamesMap.get(displayName).trim().toLowerCase();
                    setDisplayAddress(address);
                    return profiles.get(address);
                }

                const filteredAdresses = Array.from(profiles.keys()).filter((key) =>
                    key.toLowerCase().includes(userFilter.toLowerCase())
                );
                const address = filteredAdresses.length === 1 ? filteredAdresses[0] : '';
                if (address) {
                    setDisplayAddress(address);
                    return profiles.get(address.trim().toLowerCase());
                }
            }
            if (displayAddress && displayAddress !== walletAddress) {
                setDisplayAddress(walletAddress);
            }
            return profiles.get(walletAddress.trim().toLowerCase());
        }
    }, [profiles, walletAddress, userFilter]);

    const extractedMintsProfileData = useMemo(() => {
        if (profile) {
            return Array.from(new Set(profile.mints.map((mint: any) => mint.tx))).filter((value: any, index, self) => {
                return self.findIndex((mint: any) => mint.hash === value.hash) === index;
            });
        }

        return [];
    }, [userFilter, profilesQuery]);

    const extractedTradesProfileData = useMemo(() => {
        if (profile) {
            return Array.from(
                new Set(
                    profile.trades.map((trade: any) => {
                        return { market: trade.market.address, ...trade.trade };
                    })
                )
            ).filter((value: any, index, self) => {
                return self.findIndex((trade: any) => trade.hash === value.hash) === index;
            });
        }

        return [];
    }, [userFilter, profilesQuery]);

    const extractedExercisesProfileData = useMemo(() => {
        if (profile) {
            return Array.from(new Set(profile.excercises.map((ex: any) => ex.tx))).filter((value: any, index, self) => {
                return self.findIndex((ex: any) => ex.hash === value.hash) === index;
            });
        }
        return [];
    }, [userFilter, profilesQuery]);

    const filterUnclaimedData = (unclaimed: any) => {
        const result = unclaimed.market.result;
        switch (result) {
            case 'long':
                return parseFloat(unclaimed.long) !== 0;
            case 'short':
                return parseFloat(unclaimed.short) !== 0;
        }
    };

    const extractedUnclaimedProfileData = useMemo(() => {
        if (profile) {
            return profile.unclaimed.filter(filterUnclaimedData);
        }
        return [];
    }, [userFilter, profilesQuery]);

    return (
        <FlexDivColumnCentered className="leaderboard__profile">
            <FlexDivRow style={{ flexDirection: 'row' }}>
                <FlexDiv style={{ paddingLeft: 42 }}>
                    <Text className="bold white" style={{ alignSelf: 'center' }}>
                        {t('options.leaderboard.profile.transaction-details')}
                    </Text>
                    <Text className="bold white" style={{ alignSelf: 'center', paddingLeft: 15 }}>
                        {displayAddress}
                    </Text>
                </FlexDiv>
            </FlexDivRow>
            <FlexDivRow style={{ flexDirection: 'row' }}>
                <FilterWrapper>
                    <FilterButton
                        className={'leaderboard__profile__filter ' + (filter === Filters.All ? 'selected' : '')}
                        onClick={() => setFilter(Filters.All)}
                    >
                        {t('options.leaderboard.profile.filters.all')}
                    </FilterButton>
                    <FilterButton
                        className={'leaderboard__profile__filter ' + (filter === Filters.Mints ? 'selected' : '')}
                        onClick={() => setFilter(Filters.Mints)}
                    >
                        {t('options.leaderboard.profile.filters.mints')}
                    </FilterButton>
                    <FilterButton
                        className={'leaderboard__profile__filter ' + (filter === Filters.Trades ? 'selected' : '')}
                        onClick={() => setFilter(Filters.Trades)}
                    >
                        {t('options.leaderboard.profile.filters.trades')}
                    </FilterButton>
                    <FilterButton
                        className={'leaderboard__profile__filter ' + (filter === Filters.Excercises ? 'selected' : '')}
                        onClick={() => setFilter(Filters.Excercises)}
                    >
                        {t('options.leaderboard.profile.filters.exercises')}
                    </FilterButton>
                    <FilterButton
                        className={'leaderboard__profile__filter ' + (filter === Filters.Unclaimed ? 'selected' : '')}
                        onClick={() => setFilter(Filters.Unclaimed)}
                    >
                        {t('options.leaderboard.profile.filters.redeemable')}
                    </FilterButton>
                </FilterWrapper>
            </FlexDivRow>
            <DataWrapper>
                <TableContainer
                    style={{ background: 'transparent', boxShadow: 'none', borderRadius: '23px 23px 0 0' }}
                    component={Paper}
                >
                    {filter === Filters.All && (
                        <UserAllTxTable
                            profile={profile}
                            marketsData={marketsData}
                            usersMints={extractedMintsProfileData}
                            usersTrades={extractedTradesProfileData}
                            usersExercises={extractedExercisesProfileData}
                            usersUnclaimed={extractedUnclaimedProfileData}
                            userDisplay={walletAddress.toLowerCase() === displayAddress}
                            isLoading={marketsQuery.isLoading}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                        />
                    )}
                    {filter === Filters.Mints && (
                        <UserMintsTable
                            marketsData={marketsData}
                            usersMints={extractedMintsProfileData}
                            sortByField={sortByField}
                        />
                    )}

                    {filter === Filters.Trades && (
                        <UserTradesTable
                            marketsData={marketsData}
                            usersTrades={extractedTradesProfileData}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                        />
                    )}

                    {filter === Filters.Excercises && (
                        <UserExercisesTable
                            marketsData={marketsData}
                            usersExercises={extractedExercisesProfileData}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                        />
                    )}
                    {filter === Filters.Unclaimed && (
                        <UserUnclaimedTable
                            marketsData={marketsData}
                            usersUnclaimed={extractedUnclaimedProfileData}
                            userDisplay={walletAddress.toLowerCase() === displayAddress}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                        />
                    )}
                </TableContainer>
            </DataWrapper>
        </FlexDivColumnCentered>
    );
};

export interface HeadCell {
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
    border-bottom-right-radius: 23px;
    border-bottom-left-radius: 23px;
`;

const sortByMarketHeading = (a: any, b: any, direction: OrderDirection) => {
    const aMarket = marketHeading(a, a.optionSide);
    const bMarket = marketHeading(b, b.optionSide);
    if (direction === OrderDirection.ASC) {
        return aMarket < bMarket ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aMarket < bMarket ? 1 : -1;
    }

    return 0;
};

const sortByField = (a: any, b: any, direction: OrderDirection, field: any) => {
    const aField = a[field] ? (a[field] as any) : '';
    const bField = b[field] ? (b[field] as any) : '';

    if (direction === OrderDirection.ASC) {
        return aField > bField ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return aField > bField ? -1 : 1;
    }

    return 0;
};

export default Profile;
