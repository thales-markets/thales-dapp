import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters';
import React from 'react';

import { TransactionFilterEnum } from 'types/token';

const filters = [TransactionFilterEnum.ALL, TransactionFilterEnum.CLAIM_STAKING_REWARDS];

const YourTransactions: React.FC<{ gridColumns?: number }> = ({ gridColumns }) => {
    return <TransactionsWithFilters filters={filters} gridColumns={gridColumns} />;
};

export default YourTransactions;
