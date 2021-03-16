import React from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../components/TransactionsTable';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsTransactionsQuery from 'queries/options/useBinaryOptionsTransactionsQuery';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';

type RecentTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const transactionsQuery = useBinaryOptionsTransactionsQuery(marketAddress, networkId);

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
