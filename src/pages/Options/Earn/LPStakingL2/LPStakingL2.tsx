import React from 'react';
import Stake from './Stake';
import Unstake from './Unstake';
import YourTransactions from './Transactions';
import MyStake from './MyStake';
import Rewards from './Rewards';
import Info from './Info';
import ProvideLiquidity from './ProvideLiquidity';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../redux/modules/app';
import { getNetworkId, getWalletAddress } from '../../../../redux/modules/wallet';
import useLPStakingQuery from '../../../../queries/token/useLPStakingQuery';

const LPStakingL2: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useLPStakingQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const staked = stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.staked) : 0;
    const rewards =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.rewards) : 0;

    return (
        <>
            <Info />
            <ProvideLiquidity />
            <MyStake staked={staked} />
            <Rewards rewards={rewards} />
            <Stake />
            <Unstake />
            <YourTransactions />
        </>
    );
};

export default LPStakingL2;
