import React, { useState } from 'react';
import Stake from './Stake';
import MyStake from './MyStake';
import Unstake from './Unstake';
import StakingRewards from './StakingRewards';
import YourTransactions from './Transactions';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM } from 'utils/network';
import MigrationInfo from '../components/MigrationInfo';

const ThalesStaking: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const [thalesStaked, setThalesStaked] = useState<string>('0');
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [thalesBalance, setThalesBalance] = useState('0');
    const [escrowedBalance, setEscrowedBalance] = useState(0);

    return (
        <>
            {isL2 && (
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
                </>
            )}
            {!isL2 && <MigrationInfo messageKey="staking" />}
            <YourTransactions />
        </>
    );
};

export default ThalesStaking;
