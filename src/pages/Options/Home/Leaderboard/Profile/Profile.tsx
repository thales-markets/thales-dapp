import useLeaderboardQuery from 'queries/options/useLeaderboardQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumnCentered, FlexDivRow, Image } from 'theme/common';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import leaderboardIcon from 'assets/images/medals/leaderboard.svg';
import './media.scss';

const Profile: React.FC<any> = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [searchString, setSearchString] = useState<string>('');

    const leaderboardQuery = useLeaderboardQuery(networkId, {
        enabled: isAppReady,
    });

    const profiles = leaderboardQuery.data?.profiles;

    const profile = useMemo(() => {
        if (profiles && walletAddress) {
            console.log(profiles, walletAddress);
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
        return tradesMap;
    }, [searchString]);

    const extractExcercisesProfileData = useMemo(() => {
        const excercisesMap = new Map();
        profile?.excercises.map((excercise: any) => {
            if (excercisesMap.get(excercise.market.address)) {
                const txsPerMarket = excercisesMap.get(excercise.market.address);
                txsPerMarket.push(excercise.tx);
                excercisesMap.set(excercise.market.address, txsPerMarket);
            } else {
                excercisesMap.set(excercise.market.address, [excercise.tx]);
            }
        });
        return excercisesMap;
    }, [searchString]);

    const extractUnclaimedProfileData = useMemo(() => {
        const unclaimedMap = new Map();
        profile?.excercises.map((unclaimed: any) => {
            if (unclaimedMap.get(unclaimed.market.address)) {
                const txsPerMarket = unclaimedMap.get(unclaimed.market.address);
                txsPerMarket.push(unclaimed.tx);
                unclaimedMap.set(unclaimed.market.address, txsPerMarket);
            } else {
                unclaimedMap.set(unclaimed.market.address, [unclaimed.tx]);
            }
        });
        return unclaimedMap;
    }, [searchString]);

    console.log(extractMintsProfileData);
    console.log(extractTradesProfileData);
    console.log(extractExcercisesProfileData);
    console.log(extractUnclaimedProfileData);

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
        </FlexDivColumnCentered>
    );
};

export default Profile;
