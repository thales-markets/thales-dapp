import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionsTransaction, OptionsTransactions } from 'types/options';
import { orderBy } from 'lodash';
import TransactionsTable from '../TransactionsTable';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, Text } from 'theme/common';
import { FilterButton } from 'pages/Options/Market/components';
import checkmark from '../../../../../../assets/images/checkmark.svg';
import arrowDown from '../../../../../../assets/images/filters/arrow-down.svg';

type TransactionsWithFiltersProps = {
    marketTransactions: OptionsTransactions;
    tradesTransactions: OptionsTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
    type: 'recent-activity' | 'your-activity';
    isTrading: boolean;
};

enum TransactionFilterEnum {
    ALL = 'all',
    MINT = 'mint',
    TRADE = 'trade',
    EXERCISE = 'exercise',
}

const TransactionsWithFilters: React.FC<TransactionsWithFiltersProps> = ({
    marketTransactions,
    tradesTransactions,
    isLoading,
    type,
    isTrading,
}) => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);
    const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

    const transactions = useMemo(() => orderBy([...marketTransactions, ...tradesTransactions], 'timestamp', 'desc'), [
        marketTransactions,
        tradesTransactions,
    ]);

    const filteredTransactions = useMemo(() => {
        switch (filter) {
            case TransactionFilterEnum.MINT:
                return transactions.filter((tx: OptionsTransaction) => tx.type === 'mint');
            case TransactionFilterEnum.TRADE:
                return transactions.filter((tx: OptionsTransaction) => tx.type === 'buy' || tx.type === 'sell');
            case TransactionFilterEnum.EXERCISE:
                return transactions.filter((tx: OptionsTransaction) => tx.type === 'exercise');
            default:
                return transactions;
        }
    }, [transactions, filter]);

    const noResults = filteredTransactions.length === 0;
    const isMobile = window.innerWidth < 768;

    return (
        <Container>
            {isMobile ? (
                <FiltersWrapper onClick={() => setShowFiltersMobile(!showFiltersMobile)}>
                    {`${t(`options.market.transactions-card.filter.filter`)}: ${t(
                        `options.market.transactions-card.filter.${filter}`
                    )}`}
                    <DropDownWrapper hidden={!showFiltersMobile}>
                        <DropDown>
                            {Object.values(TransactionFilterEnum).map((filterItem) => {
                                return (
                                    <FilterText
                                        onClick={() => setFilter(filterItem)}
                                        className={filter === filterItem ? 'selected' : ''}
                                        key={filterItem}
                                    >
                                        {t(`options.market.transactions-card.filter.${filterItem}`)}
                                    </FilterText>
                                );
                            })}
                        </DropDown>
                    </DropDownWrapper>
                </FiltersWrapper>
            ) : (
                <FilterContainer>
                    {Object.values(TransactionFilterEnum).map((filterItem) => {
                        return isTrading && filterItem === TransactionFilterEnum.EXERCISE ? null : (
                            <FilterButton
                                className={filter === filterItem ? 'selected' : ''}
                                onClick={() => setFilter(filterItem)}
                                key={filterItem}
                            >
                                {t(`options.market.transactions-card.filter.${filterItem}`)}
                            </FilterButton>
                        );
                    })}
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
    height: 100%;
    min-height: 200px;
`;

const FilterContainer = styled.div`
    &:first-child {
        margin-left: 10px;
    }
    margin: 14px 0px;
`;

const DropDownWrapper = styled.div`
    position: absolute;
    top: 25px;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    width: 250px;
    max-width: 100%;
    right: 0;
    padding: 2px;
    z-index: 100;
    border-radius: 15px;
`;
const DropDown = styled.div`
    background: #04045a;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    padding: 10px;
    .selected {
        color: #00f9ff !important;
        &:before {
            content: url(${checkmark});
            position: absolute;
            right: 40px;
            transform: scale(0.9);
        }
    }
`;

const FiltersWrapper = styled(FlexDiv)`
    width: 100%;
    align-items: center;
    position: relative;
    border-radius: 23px;
    justify-content: flex-end;
    padding-right: 60px;
    margin-bottom: 10px;
    color: #f6f6fe;
    &:before {
        content: url(${arrowDown});
        position: absolute;
        right: 16px;
        transform: scale(0.9);
    }
`;

const FilterText = styled(Text)`
    padding: 10px 0;
`;

export default TransactionsWithFilters;
