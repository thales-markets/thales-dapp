import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters';
import React from 'react';

import { TransactionFilterEnum } from 'types/token';

const filters = [TransactionFilterEnum.ALL, TransactionFilterEnum.MERGE_ACCOUNT];

const YourTransactions: React.FC<{ gridColumns?: number; gridColumnStart?: number }> = ({
    gridColumns,
    gridColumnStart,
}) => {
    return <TransactionsWithFilters filters={filters} gridColumns={gridColumns} gridColumnStart={gridColumnStart} />;
};

export default YourTransactions;
