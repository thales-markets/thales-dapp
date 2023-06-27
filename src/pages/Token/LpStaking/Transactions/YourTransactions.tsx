import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters';
import React from 'react';

import { TransactionFilterEnum } from 'enums/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.LP_STAKE,
    TransactionFilterEnum.LP_UNSTAKE,
    TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS,
    TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS_SECOND,
];

const YourTransactions: React.FC<{ gridColumns?: number }> = ({ gridColumns }) => {
    return <TransactionsWithFilters filters={filters} gridColumns={gridColumns} />;
};

export default YourTransactions;
