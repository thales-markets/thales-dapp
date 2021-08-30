import React from 'react';
import RetroAirdrop from './RetroAirdrop';
import RetroRewards from './RetroRewards';
import YourTransactions from './Transactions';

const SnxStaking: React.FC = () => {
    return (
        <>
            <RetroAirdrop />
            <RetroRewards />
            <YourTransactions />
        </>
    );
};

export default SnxStaking;
