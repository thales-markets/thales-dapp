import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../TransactionsTable';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { FilterButton } from 'pages/Options/Market/components';
import { ClaimTransaction, ClaimTransactions } from 'types/token';

type TransactionsWithFiltersProps = {
    transactions: ClaimTransactions;
    isLoading: boolean;
};

enum TransactionFilterEnum {
    ALL = 'all',
    RETRO_AIRDROP = 'retroAirdrop',
    RETRO_REWARDS = 'retroRewards',
}

const TransactionsWithFilters: React.FC<TransactionsWithFiltersProps> = ({ transactions, isLoading }) => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);

    const filteredTransactions = useMemo(() => {
        switch (filter) {
            case TransactionFilterEnum.RETRO_AIRDROP:
            case TransactionFilterEnum.RETRO_REWARDS:
                return transactions.filter((tx: ClaimTransaction) => tx.type === filter);
            default:
                return transactions;
        }
    }, [transactions, filter]);

    const noResults = filteredTransactions.length === 0;

    return (
        <Container>
            <FilterContainer>
                {Object.values(TransactionFilterEnum).map((filterItem) => {
                    return (
                        <FilterButton
                            className={filter === filterItem ? 'selected' : ''}
                            onClick={() => setFilter(filterItem)}
                            key={filterItem}
                        >
                            {t(`options.earn.snx-stakers.table.filter.${filterItem}`)}
                        </FilterButton>
                    );
                })}
            </FilterContainer>
            <TransactionsTable
                transactions={filteredTransactions}
                isLoading={isLoading}
                noResultsMessage={
                    noResults ? <span>{t(`options.earn.snx-stakers.table.no-results.${filter}`)}</span> : undefined
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
