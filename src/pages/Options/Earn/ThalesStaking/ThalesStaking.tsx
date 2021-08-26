import React, { useState } from 'react';
import Stake from './Stake/Stake';
import MyStake from './MyStake';
import Unstake from './Unstake';
import MyRewards from './MyRewards';

const ThalesStaking: React.FC = () => {
    const [thalesStaked, setThalesStaked] = useState<number>(0);

    return (
        <>
            <Stake thalesStaked={thalesStaked} setThalesStaked={setThalesStaked} />
            <MyStake thalesStaked={thalesStaked} setThalesStaked={setThalesStaked} />
            <Unstake />
            <MyRewards />
        </>
    );
};

export default ThalesStaking;
