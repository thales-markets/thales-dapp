import React from 'react';
import ClaimMigratedRewards from './ClaimMigratedRewards';
import RetroRewards from './RetroRewards';
import YourTransactions from './Transactions';

const SnxStaking: React.FC = () => {
    return (
        <>
            <ClaimMigratedRewards />
            <RetroRewards />
            <YourTransactions />
        </>
    );
};

export default SnxStaking;
