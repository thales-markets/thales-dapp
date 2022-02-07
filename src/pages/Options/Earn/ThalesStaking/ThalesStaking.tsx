import React from 'react';
import Stake from './Stake';
import MyStake from './MyStake';
import Unstake from './Unstake';
import StakingRewards from './StakingRewards';
import YourTransactions from './Transactions';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM } from 'utils/network';
import MigrationInfo from '../components/MigrationInfo';
import GlobalStake from './GlobalStake';

const ThalesStaking: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    return (
        <>
            {isL2 && (
                <>
                    <MyStake />
                    <GlobalStake />
                    <StakingRewards />
                    <Stake />
                    <Unstake />
                </>
            )}
            {!isL2 && <MigrationInfo messageKey="staking" />}
            <YourTransactions />
        </>
    );
};

export default ThalesStaking;
