import React, { useEffect } from 'react';
import RetroAirdrop from './RetroAirdrop';
import RetroRewards from './RetroRewards';
import YourTransactions from './Transactions';

const SnxStaking: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <RetroAirdrop />
            <RetroRewards />
            <YourTransactions />
        </>
    );
};

export default SnxStaking;
