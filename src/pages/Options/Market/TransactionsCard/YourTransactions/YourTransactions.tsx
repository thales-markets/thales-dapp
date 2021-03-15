import React from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../components/TransactionsTable';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsUserTransactionsQuery from 'queries/options/useBinaryOptionsUserTransactionsQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

type RecentTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
    walletAddress: string;
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ marketAddress, walletAddress }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const transactionsQuery = useBinaryOptionsUserTransactionsQuery(marketAddress, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

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
