import React from 'react';
import TransactionsWithFilters from '../../components/TransactionsWithFilters';
import { TransactionFilterEnum } from 'types/token';

const filters = [
    TransactionFilterEnum.ALL,
    TransactionFilterEnum.CLAIM_RETRO_AIRDROP,
    TransactionFilterEnum.CLAIM_RETRO_UNLOCKED,
];

const YourTransactions: React.FC = () => {
    return <TransactionsWithFilters filters={filters} />;
};

export default YourTransactions;
