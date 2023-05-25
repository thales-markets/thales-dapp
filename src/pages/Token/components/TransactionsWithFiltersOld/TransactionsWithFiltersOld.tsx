import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../TransactionsTable';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivRowCentered, Text } from 'theme/common';
import { FilterButton } from '../components';
import { TokenTransaction, TransactionFilterEnum } from 'types/token';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import useUserTokenTransactionsQuery from 'queries/token/useUserTokenTransactionsQuery';
import checkmark from 'assets/images/checkmark.svg';
import arrowDown from 'assets/images/filters/arrow-down.svg';
import { orderBy } from 'lodash';

type TransactionsWithFiltersProps = {
    filters: TransactionFilterEnum[];
};

const TransactionsWithFiltersOld: React.FC<TransactionsWithFiltersProps> = ({ filters }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);
    const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
    const userTokenTransactionsQuery = useUserTokenTransactionsQuery(walletAddress, networkId, undefined, {
        enabled: isAppReady && isWalletConnected,
    });

    const userTokenTransactions = useMemo(
        () =>
            userTokenTransactionsQuery.isSuccess && userTokenTransactionsQuery.data
                ? orderBy(
                      userTokenTransactionsQuery.data.filter((tx: TokenTransaction) =>
                          filters.includes(tx.type as TransactionFilterEnum)
                      ),
                      ['timestamp', 'blockNumber'],
                      ['desc', 'desc']
                  )
                : [],
        [userTokenTransactionsQuery.data, walletAddress]
    );

    const filteredTransactions = useMemo(
        () =>
            filter === TransactionFilterEnum.ALL
                ? userTokenTransactions
                : userTokenTransactions.filter((tx: TokenTransaction) => tx.type.startsWith(filter)),
        [userTokenTransactions, filter]
    );

    const noResults = filteredTransactions.length === 0;

    const isMobile = window.innerWidth < 768;

    return (
        <SectionContainer>
            <SectionHeader>{t('options.earn.table.title')}</SectionHeader>
            <SectionContent>
                {isMobile ? (
                    <FiltersWrapper onClick={() => setShowFiltersMobile(!showFiltersMobile)}>
                        {`${t(`options.market.transactions-card.filter.filter`)}: ${t(
                            `options.earn.table.filter.${filter}`
                        )}`}
                        <DropDownWrapper hidden={!showFiltersMobile}>
                            <DropDown>
                                {filters.map((filterItem) => {
                                    if (filterItem === TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS_SECOND)
                                        return null;
                                    return (
                                        <FilterText
                                            onClick={() => setFilter(filterItem)}
                                            className={filter === filterItem ? 'selected' : ''}
                                            key={filterItem}
                                        >
                                            {t(`options.earn.table.filter.${filterItem}`)}
                                        </FilterText>
                                    );
                                })}
                            </DropDown>
                        </DropDownWrapper>
                    </FiltersWrapper>
                ) : (
                    <FilterContainer>
                        {filters.map((filterItem) => {
                            if (filterItem === TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS_SECOND) return null;
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
                )}
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

const SectionContainer = styled.section<{
    orderOnMobile?: number;
    orderOnTablet?: number;
    paddingOnMobile?: number;
    spanOnTablet?: number;
}>`
    height: 400px;
    display: flex;
    flex-direction: column;
    position: relative;
    background: ${(props) => props.theme.background.primary};
    border-radius: 15px;
    color: white;
    grid-column: span 10;
    grid-row: span 3;
    border: 1px solid rgba(100, 217, 254, 0.6);
    padding: 10px;
    margin-bottom: 0;
    max-width: 100%;
    @media screen and (max-width: 1024px) {
        grid-column: span ${(props) => props.spanOnTablet ?? 10} !important;
        order: ${(props) => props.orderOnTablet ?? 10};
    }
    @media (max-width: 767px) {
        grid-column: span 10 !important;
        order: ${(props) => props.orderOnMobile ?? 10};
        padding: ${(props) => props.paddingOnMobile ?? 15}px;
    }
`;

const SectionHeader = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    min-height: 50px;
    padding: 0px 20px 0 20px;
    @media (max-width: 767px) {
        font-size: 16px;
        padding: 0px 5px;
        min-height: 25px;
        margin-bottom: 10px;
        flex-direction: column;
        align-items: start;
    }
`;

const SectionContent = styled(FlexDivColumn)`
    height: calc(100% - 50px);
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
    background: ${(props) => props.theme.background.primary};
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
    margin: 0 0 10px 14px;
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

export default TransactionsWithFiltersOld;
