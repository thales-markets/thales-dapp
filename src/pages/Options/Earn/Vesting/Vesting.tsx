import React, { useEffect } from 'react';
import Schedule from './Schedule';
import YourTransactions from './Transactions';
import Vest from './Vest';
import Info from './Info';

const Vesting: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
