import React from 'react';
import Schedule from './Schedule';
import YourTransactions from './Transactions';
import Vest from './Vest';
import Info from './Info';
import { getIsOVM } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import MigrationInfo from '../components/MigrationInfo';

const Vesting: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    return (
        <>
            {isL2 && (
                <>
                    <Vest />
                    <Info />
                    <Schedule />
                </>
            )}
            {!isL2 && <MigrationInfo messageKey="vesting" />}
            <YourTransactions />
        </>
    );
};

export default Vesting;
