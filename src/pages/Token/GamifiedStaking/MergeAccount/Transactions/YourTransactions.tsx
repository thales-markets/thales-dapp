import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters';
import React from 'react';

import { TransactionFilterEnum } from 'enums/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.MERGE_ACCOUNT,
    TransactionFilterEnum.DELEGATE_VOLUME,
    TransactionFilterEnum.REMOVE_DELEGATION,
];

const YourTransactions: React.FC<{ gridColumns?: number; gridColumnStart?: number }> = ({
    gridColumns,
    gridColumnStart,
}) => {
    return <TransactionsWithFilters filters={filters} gridColumns={gridColumns} gridColumnStart={gridColumnStart} />;
};

export default YourTransactions;
