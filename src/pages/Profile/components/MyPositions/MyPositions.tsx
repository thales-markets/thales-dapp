import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useUserAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

const MyPositions: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });

    const markets = marketsQuery.isSuccess ? marketsQuery.data : undefined;

    const userPositionsQuery = useUserAssetsBalanceQuery(networkId, markets as any, walletAddress as any, {
        enabled: markets !== undefined && walletAddress !== null,
    });

    const positions = userPositionsQuery.isSuccess ? userPositionsQuery.data : [];
    console.log(positions);

    return <></>;
};

export default MyPositions;
