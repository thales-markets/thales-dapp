import TransactionsWithFiltersOld from 'pages/Token/components/TransactionsWithFiltersOld';
import React from 'react';

import { TransactionFilterEnum } from 'types/token';

const filters = [TransactionFilterEnum.ALL, TransactionFilterEnum.CLAIM_RETRO_UNLOCKED];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFiltersOld filters={filters} />;
};

export default YourTransactions;
