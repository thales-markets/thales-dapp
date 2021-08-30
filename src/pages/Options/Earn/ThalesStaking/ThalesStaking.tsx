import React, { useState } from 'react';
import Stake from './Stake';
import MyStake from './MyStake';
import Unstake from './Unstake';
import StakingRewards from './StakingRewards';
import YourTransactions from './Transactions';

const ThalesStaking: React.FC = () => {
    const [thalesStaked, setThalesStaked] = useState<number>(0);

    return (
        <>
            <Stake thalesStaked={thalesStaked} setThalesStaked={setThalesStaked} />
            <StakingRewards />
            <Unstake />
            <MyStake thalesStaked={thalesStaked} setThalesStaked={setThalesStaked} />
            <YourTransactions />
        </>
    );
};

export default ThalesStaking;
