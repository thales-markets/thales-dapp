import React, { useState } from 'react';
import ClaimMigratedRewards from './ClaimMigratedRewards';
import YourTransactions from './Transactions';

const ThalesStaking: React.FC = () => {
    const [escrowedBalance, setEscrowedBalance] = useState(0);

    return (
        <>
            <ClaimMigratedRewards escrowedBalance={escrowedBalance} setEscrowedBalance={setEscrowedBalance} />
            <YourTransactions />
        </>
    );
};

export default ThalesStaking;
