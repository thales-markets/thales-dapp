import React from 'react';
import TransactionsWithFilters from '../../components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.CLAIM_STAKING_REWARDS,
    TransactionFilterEnum.STAKE,
    TransactionFilterEnum.START_UNSTAKE,
    TransactionFilterEnum.CANCEL_UNSTAKE,
    TransactionFilterEnum.UNSTAKE,
    TransactionFilterEnum.MERGE_ACCOUNT,
];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFilters filters={filters} />;
};

export default YourTransactions;
