import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionsTransaction, OptionsTransactions } from 'types/options';
import { orderBy } from 'lodash';
import TransactionsTable from '../TransactionsTable';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { FilterButton } from 'pages/Options/Market/components';

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
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);

    const transactions = useMemo(() => orderBy([...marketTransactions, ...tradesTransactions], 'timestamp', 'desc'), [
        marketTransactions,
        tradesTransactions,
    ]);

    const filteredTransactions = useMemo(() => {
        switch (filter) {
            case TransactionFilterEnum.MARKET:
                return transactions.filter((tx: OptionsTransaction) => tx.type === 'mint' || tx.type === 'exercise');
            case TransactionFilterEnum.TRADE:
                return transactions.filter((tx: OptionsTransaction) => tx.type === 'buy' || tx.type === 'sell');
            default:
                return transactions;
        }
    }, [transactions, filter]);

    const noResults = filteredTransactions.length === 0;

    return (
        <Container>
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
    height: 100%;
`;

const FilterContainer = styled.div`
    &:first-child {
        margin-left: 10px;
    }
    margin: 14px 0px;
`;

export default TransactionsWithFilters;
