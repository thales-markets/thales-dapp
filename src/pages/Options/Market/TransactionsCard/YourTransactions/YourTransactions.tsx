import React from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../components/TransactionsTable';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsUserTransactions from 'queries/options/useBinaryOptionsUserTransactions';

type RecentTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
    walletAddress: string;
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ marketAddress, walletAddress }) => {
    const { t } = useTranslation();

    const transactionsQuery = useBinaryOptionsUserTransactions(marketAddress, walletAddress);

    const noResults = transactionsQuery.isSuccess && transactionsQuery.data && transactionsQuery.data.length === 0;

    return (
        <TransactionsTable
            optionsTransactions={transactionsQuery.data || []}
            isLoading={transactionsQuery.isLoading}
            noResultsMessage={
                transactionsQuery.isSuccess && noResults ? (
                    <span>{t('options.market.transactions-card.table.no-results-your-activity')}</span>
                ) : undefined
            }
        />
    );
};

export default RecentTransactions;
