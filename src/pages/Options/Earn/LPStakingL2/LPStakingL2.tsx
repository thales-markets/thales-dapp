import React from 'react';
import Stake from './Stake';
import Unstake from './Unstake';
// import MyStake from './MyStake';
// import GlobalStake from './GlobalStake';
// import StakingRewards from './StakingRewards';
import YourTransactions from './Transactions';
import ComingSoon from 'components/ComingSoon';

const LP_STAKING_L2_DISABLED = true;

const LPStakingL2: React.FC = () => {
    return (
        <>
            {LP_STAKING_L2_DISABLED && <ComingSoon />}
            {!LP_STAKING_L2_DISABLED && (
                <>
                    {/* <MyStake />
                    <GlobalStake />
                    <StakingRewards /> */}
                    <Stake />
                    <Unstake />
                    <YourTransactions />
                </>
            )}
        </>
    );
};

export default LPStakingL2;
