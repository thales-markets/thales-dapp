import React from 'react';
import TransactionsWithFilters from '../../components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.ADD_TO_ESCROW,
    TransactionFilterEnum.VEST,
    TransactionFilterEnum.MERGE_ACCOUNT,
];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFilters filters={filters} />;
};

export default YourTransactions;
