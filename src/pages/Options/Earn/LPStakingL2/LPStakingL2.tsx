import React from 'react';
import Stake from './Stake';
import Unstake from './Unstake';
// import MyStake from './MyStake';
// import GlobalStake from './GlobalStake';
// import StakingRewards from './StakingRewards';
import YourTransactions from './Transactions';

const LPStakingL2: React.FC = () => {
    return (
        <>
            {/* <MyStake />
            <GlobalStake />
            <StakingRewards /> */}
            <Stake />
            <Unstake />
            <YourTransactions />
        </>
    );
};

export default LPStakingL2;
