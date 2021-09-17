import leaderboardIcon from 'assets/images/medals/leaderboard.svg';
import { FilterButton } from 'pages/Options/Market/components';
import useLeaderboardQuery from 'queries/options/useLeaderboardQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRow, Image } from 'theme/common';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import './media.scss';
import UsersMints from './UsersMints';
import UsersTrades from './UsersTrades/UsersMints';

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
    const [searchString, setSearchString] = useState<string>('');
    const [filter, setFilter] = useState<string>('');

    const leaderboardQuery = useLeaderboardQuery(networkId, {
        enabled: isAppReady,
    });

    const profiles = leaderboardQuery.data?.profiles;

    const profile = useMemo(() => {
        if (profiles && walletAddress) {
            return profiles.get(walletAddress.trim().toLowerCase());
        }
    }, [profiles, walletAddress]);

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
    }, [searchString]);

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
        console.log(tradesMap);
        return tradesMap;
    }, [searchString]);

    // const extractExcercisesProfileData = useMemo(() => {
    //     const excercisesMap = new Map();
    //     profile?.excercises.map((excercise: any) => {
    //         if (excercisesMap.get(excercise.market.address)) {
    //             const txsPerMarket = excercisesMap.get(excercise.market.address);
    //             txsPerMarket.push(excercise.tx);
    //             excercisesMap.set(excercise.market.address, txsPerMarket);
    //         } else {
    //             excercisesMap.set(excercise.market.address, [excercise.tx]);
    //         }
    //     });
    //     return excercisesMap;
    // }, [searchString]);

    // const extractUnclaimedProfileData = useMemo(() => {
    //     const unclaimedMap = new Map();
    //     profile?.excercises.map((unclaimed: any) => {
    //         if (unclaimedMap.get(unclaimed.market.address)) {
    //             const txsPerMarket = unclaimedMap.get(unclaimed.market.address);
    //             txsPerMarket.push(unclaimed.tx);
    //             unclaimedMap.set(unclaimed.market.address, txsPerMarket);
    //         } else {
    //             unclaimedMap.set(unclaimed.market.address, [unclaimed.tx]);
    //         }
    //     });
    //     return unclaimedMap;
    // }, [searchString]);

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
                    Excercises
                </FilterButton>
                <FilterButton
                    style={{ width: 'auto', margin: '24px 10px 10px 0px' }}
                    className={filter === Filters.Unclaimed ? 'selected' : ''}
                    onClick={() => setFilter(Filters.Unclaimed)}
                >
                    Unclaimed
                </FilterButton>
            </FilterWrapper>
            <DataWrapper>
                {filter === Filters.Mints &&
                    Array.from(extractMintsProfileData.keys()).map((key, index) => {
                        return (
                            <UsersMints
                                key={index}
                                market={
                                    profile?.mints
                                        .filter((mint: any) => mint.market.address === key)
                                        .map((mint: any) => mint.market)[0]
                                }
                                usersMints={extractMintsProfileData.get(key)}
                            />
                        );
                    })}

                {filter === Filters.Trades &&
                    Array.from(extractTradesProfileData.keys()).map((key, index) => {
                        return (
                            <UsersTrades
                                key={index}
                                market={
                                    profile?.trades
                                        .filter((mint: any) => mint.market.address === key)
                                        .map((mint: any) => mint.market)[0]
                                }
                                usersTrades={extractTradesProfileData.get(key)}
                            />
                        );
                    })}

                {/* {filter === Filters.TRADES && (
                        Object.keys(extractTradesProfileData).map((key) => {
                            return <UsersTrades market={key} usersMarkets={extractTradesProfileData.get(key)} />
                        })
                    )}
                    {filter === Filters.EXCERCISES && (
                        Object.keys(extractExcercisesProfileData).map((key) => {
                            return <UsersExcercises market={key} usersMarkets={extractExcercisesProfileData.get(key)}  />
                        })
                    )}
                    {filter === Filters.UNCLAIMED && (
                        Object.keys(extractUnclaimedProfileData).map((key) => {
                            return <UsersUnclaimed market={key} usersMarkets={extractUnclaimedProfileData.get(key)}  />
                        })
                    )} */}
            </DataWrapper>
        </FlexDivColumnCentered>
    );
};

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
        background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    }
`;

const DataWrapper = styled(FlexDivColumn)`
    background: #04045a;
    padding-bottom: 20px;
    border-bottom-right-radius: 23px;
    border-bottom-left-radius: 23px;
`;

export default Profile;
