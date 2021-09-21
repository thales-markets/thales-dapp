import React from 'react';
import Schedule from './Schedule';
import YourTransactions from './Transactions';
import Vest from './Vest';
import Info from './Info';

const Vesting: React.FC = () => {
    return (
        <>
            <Vest />
            <Info />
            <Schedule />
            <YourTransactions />
        </>
    );
};

export default Vesting;
