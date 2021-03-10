import React from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from './TransactionsTable';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsTransactions from 'queries/options/useBinaryOptionsTransactions';

type RecentTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ marketAddress }) => {
    const { t } = useTranslation();

    const transactionsQuery = useBinaryOptionsTransactions(marketAddress);

    const noResults = transactionsQuery.isSuccess && transactionsQuery.data && transactionsQuery.data.length === 0;

    return (
        <TransactionsTable
            optionsTransactions={transactionsQuery.data || []}
            isLoading={transactionsQuery.isLoading}
            noResultsMessage={
                transactionsQuery.isSuccess && noResults ? (
                    <span>{t('options.market.transactions-card.table.no-results-recent-activity')}</span>
                ) : undefined
            }
        />
    );
};

export default RecentTransactions;
