import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../components/TransactionsTable';
import { OptionsMarketInfo } from 'types/options';
import useBinaryOptionsUserTransactionsQuery from 'queries/options/useBinaryOptionsUserTransactionsQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { getOptionsPendingTransactions } from 'redux/modules/options';
import { uniqBy } from 'lodash';

type YourTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
    walletAddress: string;
};

const YourTransactions: React.FC<YourTransactionsProps> = ({ marketAddress, walletAddress }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const pendingTransactions = useSelector((state: RootState) => getOptionsPendingTransactions(state));

    const transactionsQuery = useBinaryOptionsUserTransactionsQuery(marketAddress, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const transactions = useMemo(() => {
        const filteredPendingTransactions = pendingTransactions.filter(
            ({ market, account }) => market === marketAddress && walletAddress === account
        );
        const myTransactions = transactionsQuery.data || [];

        const transactions = uniqBy(
            [...filteredPendingTransactions, ...myTransactions],
            (transaction) => transaction.hash
        );

        return transactions;
    }, [transactionsQuery.data, pendingTransactions, marketAddress, walletAddress]);

    const noResults = transactionsQuery.isSuccess && transactions.length === 0;

    return (
        <TransactionsTable
            optionsTransactions={transactions}
            isLoading={transactionsQuery.isLoading}
            noResultsMessage={
                noResults ? (
                    <span>{t('options.market.transactions-card.table.no-results-your-activity')}</span>
                ) : undefined
            }
        />
    );
};

export default YourTransactions;
