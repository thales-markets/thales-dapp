import React from 'react';
import Stake from './Stake';
import Unstake from './Unstake';
import YourTransactions from './Transactions';
import MyStake from './MyStake';
import Rewards from './Rewards';
import Info from './Info';
import ProvideLiquidity from './ProvideLiquidity';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import useLPStakingQuery from 'queries/token/useLPStakingQuery';

const LPStakingL2: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const lpStakingQuery = useLPStakingQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const staked = lpStakingQuery.isSuccess && lpStakingQuery.data ? Number(lpStakingQuery.data.staked) : 0;
    const paused = lpStakingQuery.isSuccess && lpStakingQuery.data ? lpStakingQuery.data.paused : false;
    const rewards = lpStakingQuery.isSuccess && lpStakingQuery.data ? Number(lpStakingQuery.data.rewards) : 0;

    return (
        <>
            <Info />
            <ProvideLiquidity />
            <MyStake staked={staked} />
            <Rewards rewards={rewards} />
            <Stake isStakingPaused={paused} />
            <Unstake staked={staked} />
            <YourTransactions />
        </>
    );
};

export default LPStakingL2;
