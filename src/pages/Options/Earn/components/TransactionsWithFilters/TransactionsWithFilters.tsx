import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../TransactionsTable';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { FilterButton } from 'pages/Options/Market/components';
import { TokenTransaction, TransactionFilterEnum } from 'types/token';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import useUserTokenTransactionsQuery from 'queries/token/useUserTokenTransactionsQuery';
import { EarnSection, SectionHeader } from '../../components';

type TransactionsWithFiltersProps = {
    filters: TransactionFilterEnum[];
};

const TransactionsWithFilters: React.FC<TransactionsWithFiltersProps> = ({ filters }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);

    const userTokenTransactionsQuery = useUserTokenTransactionsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const userTokenTransactions = useMemo(
        () =>
            userTokenTransactionsQuery.isSuccess && userTokenTransactionsQuery.data
                ? userTokenTransactionsQuery.data.filter((tx: TokenTransaction) =>
                      filters.includes(tx.type as TransactionFilterEnum)
                  )
                : [],
        [userTokenTransactionsQuery.data, walletAddress]
    );

    const filteredTransactions = useMemo(
        () =>
            filter === TransactionFilterEnum.ALL
                ? userTokenTransactions
                : userTokenTransactions.filter((tx: TokenTransaction) => tx.type === filter),
        [userTokenTransactions, filter]
    );

    const noResults = filteredTransactions.length === 0;

    return (
        <SectionContainer>
            <SectionHeader>{t('options.earn.table.title')}</SectionHeader>
            <SectionContent>
                <FilterContainer>
                    {filters.map((filterItem) => {
                        return (
                            <FilterButton
                                className={filter === filterItem ? 'selected' : ''}
                                onClick={() => setFilter(filterItem)}
                                key={filterItem}
                            >
                                {t(`options.earn.table.filter.${filterItem}`)}
                            </FilterButton>
                        );
                    })}
                </FilterContainer>
                <TransactionsTable
                    transactions={filteredTransactions}
                    isLoading={userTokenTransactionsQuery.isLoading}
                    noResultsMessage={
                        noResults ? <span>{t(`options.earn.table.no-results.${filter}`)}</span> : undefined
                    }
                />
            </SectionContent>
        </SectionContainer>
    );
};

const SectionContainer = styled(EarnSection)`
    grid-column: span 10;
    height: 400px;
    margin-bottom: 0;
`;

const SectionContent = styled(FlexDivColumn)`
    height: 100%;
`;

const FilterContainer = styled.div`
    &:first-child {
        margin-left: 10px;
    }
    margin: 14px 0px;
`;

export default TransactionsWithFilters;
