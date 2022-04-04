import React from 'react';
import TransactionsWithFilters from '../../components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const filters = [TransactionFilterEnum.CLAIM_MIGRATED_REWARDS];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFilters filters={filters} />;
};

export default YourTransactions;
