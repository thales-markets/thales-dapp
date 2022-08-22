import React from 'react';
import TransactionsWithFilters from '../../components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.CLAIM_STAKING_REWARDS,
    TransactionFilterEnum.STAKE,
    TransactionFilterEnum.UNSTAKE,
    TransactionFilterEnum.START_UNSTAKE,
    TransactionFilterEnum.CANCEL_UNSTAKE,
];

const YourTransactions: React.FC<{ gridColumns?: number }> = ({ gridColumns }) => {
    return <TransactionsWithFilters filters={filters} gridColumns={gridColumns} />;
};

export default YourTransactions;
