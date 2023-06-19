import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters';
import React from 'react';

import { TransactionFilterEnum } from 'enums/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.STAKE,
    TransactionFilterEnum.UNSTAKE,
    TransactionFilterEnum.START_UNSTAKE,
    TransactionFilterEnum.CANCEL_UNSTAKE,
];

const YourTransactions: React.FC<{ gridColumns?: number }> = ({ gridColumns }) => {
    return <TransactionsWithFilters filters={filters} gridColumns={gridColumns} />;
};

export default YourTransactions;
