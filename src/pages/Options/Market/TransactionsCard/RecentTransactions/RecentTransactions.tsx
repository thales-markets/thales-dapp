import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../components/TransactionsTable';
import { OptionsMarketInfo, OptionsTransaction } from 'types/options';
import useBinaryOptionsTransactionsQuery from 'queries/options/useBinaryOptionsTransactionsQuery';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { useMarketContext } from '../../contexts/MarketContext';
import { orderBy } from 'lodash';
import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
import { Button } from 'semantic-ui-react';

type RecentTransactionsProps = {
    marketAddress: OptionsMarketInfo['address'];
};

export enum TransactionFilterEnum {
    ALL = 'all',
    MARKET = 'market',
    TRADE = 'trade',
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);
    const isTradingEnabled = optionsMarket.phase === 'trading' || optionsMarket.phase === 'maturity';

    const transactionsQuery = useBinaryOptionsTransactionsQuery(marketAddress, networkId);
    const tradesQuery = useBinaryOptionsTradesQuery(
        marketAddress,
        optionsMarket.longAddress,
        optionsMarket.shortAddress,
        networkId,
        { enabled: isTradingEnabled }
    );

    const transactions = useMemo(() => {
        const marketTransactions = transactionsQuery.data || [];
        const tradesTransactions = tradesQuery.data || [];
        const transactions = [...marketTransactions, ...tradesTransactions];
        return orderBy(transactions, 'timestamp', 'desc');
    }, [transactionsQuery.data, tradesQuery.data]);

    const filteredTransactions = useMemo(() => {
        switch (filter) {
            case TransactionFilterEnum.MARKET:
                return transactions.filter(
                    (tx: OptionsTransaction) =>
                        tx.type === 'refund' || tx.type === 'bid' || tx.type === 'exercise' || tx.type === 'claim'
                );
            case TransactionFilterEnum.TRADE:
                return transactions.filter((tx: OptionsTransaction) => tx.type === 'buy' || tx.type === 'sell');
            default:
                return transactions;
        }
    }, [transactions, filter]);

    const noResults = transactionsQuery.isSuccess && tradesQuery.isSuccess && filteredTransactions.length === 0;

    return (
        <>
            {isTradingEnabled && (
                <div>
                    {Object.values(TransactionFilterEnum).map((filterItem) => (
                        <Button
                            toggle
                            basic
                            active={filter === filterItem}
                            onClick={() => setFilter(filterItem)}
                            key={filterItem}
                        >
                            {t(`options.market.transactions-card.filter.${filterItem}`)}
                        </Button>
                    ))}
                </div>
            )}
            <TransactionsTable
                optionsTransactions={filteredTransactions}
                isLoading={transactionsQuery.isLoading}
                noResultsMessage={
                    noResults ? (
                        <span>{t('options.market.transactions-card.table.no-results-recent-activity')}</span>
                    ) : undefined
                }
            />
        </>
    );
};

export default RecentTransactions;
