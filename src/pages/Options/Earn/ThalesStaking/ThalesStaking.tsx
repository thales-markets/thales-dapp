import React, { useEffect, useState } from 'react';
import Stake from './Stake';
import MyStake from './MyStake';
import Unstake from './Unstake';
import StakingRewards from './StakingRewards';
import YourTransactions from './Transactions';

const ThalesStaking: React.FC = () => {
    const [thalesStaked, setThalesStaked] = useState<string>('0');
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [thalesBalance, setThalesBalance] = useState('0');
    const [escrowedBalance, setEscrowedBalance] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Stake
                balance={thalesBalance}
                setBalance={setThalesBalance}
                isUnstaking={isUnstaking}
                thalesStaked={thalesStaked}
                setThalesStaked={setThalesStaked}
            />
            <MyStake
                thalesStaked={thalesStaked}
                setThalesStaked={setThalesStaked}
                escrowedBalance={escrowedBalance}
                setEscrowedBalance={setEscrowedBalance}
            />
            <StakingRewards escrowedBalance={escrowedBalance} setEscrowedBalance={setEscrowedBalance} />
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
