import React from 'react';
import Schedule from './Schedule';
import YourTransactions from './Transactions';

const Vesting: React.FC = () => {
    return (
        <>
            <Schedule />
            <YourTransactions />
        </>
    );
};

export default Vesting;
