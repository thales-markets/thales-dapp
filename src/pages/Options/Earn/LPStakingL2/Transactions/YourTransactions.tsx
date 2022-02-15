import React from 'react';
import TransactionsWithFilters from '../../components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.LP_STAKE,
    TransactionFilterEnum.LP_UNSTAKE,
    TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS,
];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFilters filters={filters} />;
};

export default YourTransactions;
