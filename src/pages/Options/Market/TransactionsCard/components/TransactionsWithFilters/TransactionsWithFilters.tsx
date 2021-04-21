import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionsTransaction, OptionsTransactions } from 'types/options';
import { orderBy } from 'lodash';
import { Button } from 'semantic-ui-react';
import TransactionsTable from '../TransactionsTable';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';

type TransactionsWithFiltersProps = {
    marketTransactions: OptionsTransactions;
    tradesTransactions: OptionsTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
    type: 'recent-activity' | 'your-activity';
};

enum TransactionFilterEnum {
    ALL = 'all',
    MARKET = 'market',
    TRADE = 'trade',
}

const TransactionsWithFilters: React.FC<TransactionsWithFiltersProps> = ({
    marketTransactions,
    tradesTransactions,
    isLoading,
    type,
}) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);
    const isTradingEnabled = optionsMarket.phase === 'trading' || optionsMarket.phase === 'maturity';

    const transactions = useMemo(() => orderBy([...marketTransactions, ...tradesTransactions], 'timestamp', 'desc'), [
        marketTransactions,
        tradesTransactions,
    ]);

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

    const noResults = filteredTransactions.length === 0;

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
                isLoading={isLoading}
                noResultsMessage={
                    noResults ? (
                        <span>{t(`options.market.transactions-card.table.no-results.${type}.${filter}`)}</span>
                    ) : undefined
                }
            />
        </>
    );
};

export default TransactionsWithFilters;
