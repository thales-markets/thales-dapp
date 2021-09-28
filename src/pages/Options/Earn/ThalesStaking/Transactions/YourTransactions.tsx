import React from 'react';
import TransactionsWithFilters from '../../components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const tokenStakingDisabled = process.env.REACT_APP_TOKEN_STAKING_DISABLED === 'true';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.CLAIM_STAKING_REWARDS,
    TransactionFilterEnum.STAKE,
    TransactionFilterEnum.START_UNSTAKE,
    TransactionFilterEnum.CANCEL_UNSTAKE,
    TransactionFilterEnum.UNSTAKE,
];

const reducedFilters = [TransactionFilterEnum.ALL, TransactionFilterEnum.CLAIM_STAKING_REWARDS];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFilters filters={tokenStakingDisabled ? reducedFilters : filters} />;
};

export default YourTransactions;
