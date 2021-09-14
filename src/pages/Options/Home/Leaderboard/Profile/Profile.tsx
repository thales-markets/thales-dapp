import useLeaderboardQuery from 'queries/options/useLeaderboardQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumnCentered } from 'theme/common';
import './media.scss';

const Profile: React.FC<any> = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

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

    console.log(profile);

    // const extractMintsProfileData = () => {
    //     const mintsMap = new Map();
    //     profile?.mints.map((mint: any) => {
    //         if (mintsMap.get(JSON.stringify(mint.market))) {
    //             const txsPerMarket = mintsMap.get(JSON.stringify(mint.market));
    //             txsPerMarket.push(mint.tx);
    //             mintsMap.set(JSON.stringify(mint.market), txsPerMarket);
    //         } else {
    //             mintsMap.set(JSON.stringify(mint.market), [mint.tx]);
    //         }
    //     });
    //     return mintsMap;
    // };

    // const extractTradesProfileData = () => {
    //     const tradesMap = new Map();
    //     profile?.trades.map((trade: any) => {
    //         if (tradesMap.get(JSON.stringify(trade.market))) {
    //             const tradesPerMarket = tradesMap.get(JSON.stringify(trade.market));
    //             tradesPerMarket.push(trade.trade);
    //             tradesMap.set(JSON.stringify(trade.market), tradesPerMarket);
    //         } else {
    //             tradesMap.set(JSON.stringify(trade.market), [trade.trade]);
    //         }
    //     });
    //     return tradesMap;
    // };

    // const extractExcercisesProfileData = () => {
    //     const excercisesMap = new Map();
    //     profile?.excercises.map((excercise: any) => {
    //         if (excercisesMap.get(JSON.stringify(excercise.market))) {
    //             const txsPerMarket = excercisesMap.get(JSON.stringify(excercise.market));
    //             txsPerMarket.push(excercise.tx);
    //             excercisesMap.set(JSON.stringify(excercise.market), txsPerMarket);
    //         } else {
    //             excercisesMap.set(JSON.stringify(excercise.market), [excercise.tx]);
    //         }
    //     });
    //     return excercisesMap;
    // };

    return <FlexDivColumnCentered className="leaderboard__wrapper"></FlexDivColumnCentered>;
};

export default Profile;
