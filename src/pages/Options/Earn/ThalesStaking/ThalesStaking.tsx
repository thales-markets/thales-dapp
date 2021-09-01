import React, { useState } from 'react';
import Stake from './Stake';
import MyStake from './MyStake';
import Unstake from './Unstake';
import StakingRewards from './StakingRewards';
import YourTransactions from './Transactions';

const ThalesStaking: React.FC = () => {
    const [thalesStaked, setThalesStaked] = useState<number>(0);
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [thalesBalance, setThalesBalance] = useState(0);

    return (
        <>
            <Stake
                balance={thalesBalance}
                setBalance={setThalesBalance}
                isUnstaking={isUnstaking}
                thalesStaked={thalesStaked}
                setThalesStaked={setThalesStaked}
            />
            <MyStake thalesStaked={thalesStaked} setThalesStaked={setThalesStaked} />
            <StakingRewards />
            <Unstake
                isUnstakingInContract={isUnstaking}
                setIsUnstakingInContract={setIsUnstaking}
                thalesStaked={thalesStaked}
                setThalesStaked={setThalesStaked}
                thalesBalance={thalesBalance}
                setThalesBalance={setThalesBalance}
            />
            <YourTransactions />
        </>
    );
};

export default ThalesStaking;
