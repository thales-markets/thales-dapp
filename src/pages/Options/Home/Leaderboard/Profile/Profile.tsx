import { Paper, TableContainer, TableRow, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import { OptionSide, OrderSide } from 'types/options';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
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

type ProfileProps = {
    displayNamesMap: Map<string, string>;
};

const Profile: React.FC<ProfileProps> = ({ displayNamesMap }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [userFilter, setUserFilter] = useState<string>('');
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
            const usersTrades = new Array<UserTrade>();

            profile.trades.map((trade: any) => {
                const userTrade: UserTrade = {
                    market: trade.market.address,
                    ...trade.trade,
                };
                usersTrades.push(userTrade);
                return userTrade;
            });

            return usersTrades.filter((value: any, index, self) => {
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
                <SearchWrapper style={{ alignSelf: 'flex-start', flex: 1, maxWidth: 450, margin: '22px 0' }}>
                    <SearchAutoCompleteInput
                        style={{ width: '100%' }}
                        className="leaderboard__search"
                        freeSolo
                        options={displayNamesAndAdressesOptions}
                        inputValue={userFilter}
                        onInputChange={(_event, newFilter) => {
                            setUserFilter(newFilter);
                        }}
                        renderInput={(params) => (
                            <div ref={params.InputProps.ref}>
                                <SearchInput
                                    placeholder={t('options.leaderboard.profile.search-placeholder')}
                                    className="leaderboard__search"
                                    style={{
                                        width: '100%',
                                        paddingRight: 40,
                                        paddingLeft: 0,
                                        background: 'transparent',
                                        margin: 0,
                                    }}
                                    {...params.inputProps}
                                />
                            </div>
                        )}
                    ></SearchAutoCompleteInput>
                </SearchWrapper>
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
                        />
                    )}
                    {filter === Filters.Mints && (
                        <UserMintsTable marketsData={marketsData} usersMints={extractedMintsProfileData} />
                    )}

                    {filter === Filters.Trades && (
                        <UserTradesTable marketsData={marketsData} usersTrades={extractedTradesProfileData} />
                    )}

                    {filter === Filters.Excercises && (
                        <UserExercisesTable marketsData={marketsData} usersExercises={extractedExercisesProfileData} />
                    )}
                    {filter === Filters.Unclaimed && (
                        <UserUnclaimedTable
                            marketsData={marketsData}
                            usersUnclaimed={extractedUnclaimedProfileData}
                            userDisplay={walletAddress.toLowerCase() === displayAddress}
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

const SearchAutoCompleteInput = styled(Autocomplete)`
    height: 40px;
    width: 204px;
    border-radius: 23px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    padding: 0 10px;
    letter-spacing: 0.15px;
    background: #04045a;
    color: #f6f6fe;
    padding-left: 20px;
    margin: 2px;
    &::placeholder {
        font-size: 16px;
        color: #f6f6f6;
        opacity: 0.7;
    }
`;

type UserTrade = {
    amount: number;
    hash: string;
    price: number;
    side: OptionSide;
    timestamp: string;
    type: OrderSide;
    market: string;
};

export default Profile;
