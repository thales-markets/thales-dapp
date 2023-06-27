import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters';
import React from 'react';

import { TransactionFilterEnum } from 'enums/token';

const filters = [TransactionFilterEnum.ALL, TransactionFilterEnum.ADD_TO_ESCROW, TransactionFilterEnum.VEST];

const YourTransactions: React.FC<{ gridColumns?: number }> = ({ gridColumns }) => {
    return <TransactionsWithFilters filters={filters} gridColumns={gridColumns} />;
};

export default YourTransactions;
