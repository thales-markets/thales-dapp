import React from 'react';
import TransactionsWithFilters from 'pages/Options/Earn/components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const filters = [TransactionFilterEnum.ALL, TransactionFilterEnum.ADD_TO_ESCROW, TransactionFilterEnum.VEST];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFilters filters={filters} />;
};

export default YourTransactions;
