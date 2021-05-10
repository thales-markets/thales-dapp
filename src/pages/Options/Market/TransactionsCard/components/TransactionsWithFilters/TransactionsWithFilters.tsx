import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionsTransaction, OptionsTransactions } from 'types/options';
import { orderBy } from 'lodash';
import TransactionsTable from '../TransactionsTable';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import styled from 'styled-components';
import { Button, FlexDivColumn } from 'theme/common';

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
        <Container>
            {isTradingEnabled && (
                <FilterContainer>
                    {Object.values(TransactionFilterEnum).map((filterItem) => (
                        <FilterButton
                            className={filter === filterItem ? 'selected' : ''}
                            onClick={() => setFilter(filterItem)}
                            key={filterItem}
                        >
                            {t(`options.market.transactions-card.filter.${filterItem}`)}
                        </FilterButton>
                    ))}
                </FilterContainer>
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
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    background: #04045a;
    border-radius: 20px;
`;

const FilterContainer = styled.div`
    &:first-child {
        margin-left: 10px;
    }
`;

const FilterButton = styled(Button)`
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    background: #3936c7;
    border-radius: 20px;
    text-transform: capitalize !important;
    margin: 14px 9px;
    height: 32px;
    &.selected {
        background: #44e1e2;
    }
`;

export default TransactionsWithFilters;
