import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import TransactionsTable from '../components/TransactionsTable';
import { RootState } from 'redux/rootReducer';
import { getOptionsPendingTransactions } from 'redux/modules/options';

const mapStateToProps = (state: RootState) => ({
    pendingTransactions: getOptionsPendingTransactions(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type PendingTransactionsProps = PropsFromRedux & {
    marketAddress: string;
    walletAddress: string;
};

const PendingTransactions: React.FC<PendingTransactionsProps> = ({
    pendingTransactions,
    marketAddress,
    walletAddress,
}) => {
    const { t } = useTranslation();

    const filteredPendingTransactions = useMemo(
        () =>
            pendingTransactions.filter(({ market, account }) => market === marketAddress && walletAddress === account),
        [pendingTransactions, marketAddress, walletAddress]
    );

    const noResults = filteredPendingTransactions.length === 0;

    return (
        <TransactionsTable
            optionsTransactions={filteredPendingTransactions}
            isLoading={false}
            noResultsMessage={
                noResults ? (
                    <span>{t('options.market.transactions-card.table.no-results-pending-transactions')}</span>
                ) : undefined
            }
        />
    );
};

export default connector(PendingTransactions);
