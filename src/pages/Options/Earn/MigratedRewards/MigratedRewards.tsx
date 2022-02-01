import React from 'react';
import ClaimMigratedRewards from './ClaimMigratedRewards';
import YourTransactions from './Transactions';

const ThalesStaking: React.FC = () => {
    return (
        <>
            <ClaimMigratedRewards />
            <YourTransactions />
        </>
    );
};

export default ThalesStaking;
