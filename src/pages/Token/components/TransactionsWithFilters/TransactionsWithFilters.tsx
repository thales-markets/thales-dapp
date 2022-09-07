import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../TransactionsTable';
import styled from 'styled-components';
import { FlexDivColumn, Text } from 'theme/common';
import { TokenTransaction, TransactionFilterEnum } from 'types/token';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import useUserTokenTransactionsQuery from 'queries/token/useUserTokenTransactionsQuery';
import { SectionHeader } from '../../components';
import checkmark from 'assets/images/checkmark.svg';
import { orderBy } from 'lodash';
import Button from '../Button';
import { ButtonType } from '../Button/Button';
import { isMobile } from 'utils/device';

type TransactionsWithFiltersProps = {
    filters: TransactionFilterEnum[];
    gridColumns?: number;
    gridColumnStart?: number;
};

const TransactionsWithFilters: React.FC<TransactionsWithFiltersProps> = ({ filters, gridColumns, gridColumnStart }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const userTokenTransactionsQuery = useUserTokenTransactionsQuery(walletAddress, networkId, {
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
    const noUserTx = filteredTransactions.length === 0;

    return (
        <SectionContainer gridColumns={gridColumns} gridColumnStart={gridColumnStart}>
            <SectionHeader>{t('options.earn.table.title')}</SectionHeader>
            {!noUserTx ? (
                <>
                    <FilterWrapper>
                        <FilterContainer
                            onMouseEnter={() => (isMobile() ? '' : setShowFilters(true))}
                            onMouseLeave={() => setShowFilters(false)}
                        >
                            <Button type={ButtonType.default} onClickHandler={() => setShowFilters(!showFilters)}>
                                {t(`options.earn.table.filter.button`)}
                            </Button>
                            <DropDownWrapper hidden={!showFilters}>
                                <DropDown>
                                    {filters.map((filterItem) => {
                                        if (filterItem === TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS_SECOND)
                                            return null;
                                        return (
                                            <FilterText
                                                onClick={() => {
                                                    setFilter(filterItem);
                                                    setShowFilters(false);
                                                }}
                                                className={filter === filterItem ? 'selected' : ''}
                                                key={filterItem}
                                            >
                                                {t(`options.earn.table.filter.${filterItem}`)}
                                            </FilterText>
                                        );
                                    })}
                                </DropDown>
                            </DropDownWrapper>
                        </FilterContainer>
                    </FilterWrapper>

                    <SectionContent>
                        <TransactionsTable
                            transactions={filteredTransactions}
                            isLoading={userTokenTransactionsQuery.isLoading}
                            noResultsMessage={
                                noResults ? <span>{t(`options.earn.table.no-results.${filter}`)}</span> : undefined
                            }
                        />
                    </SectionContent>
                </>
            ) : (
                <NoResultsContainer gridColumns={gridColumns} gridColumnStart={gridColumnStart}>
                    <NoResultsText>{t(`options.earn.table.no-activity`)}</NoResultsText>
                </NoResultsContainer>
            )}
        </SectionContainer>
    );
};

const NoResultsContainer = styled.div<{ gridColumns?: number; gridColumnStart?: number }>`
    box-sizing: border-box;
    border-radius: 15px;
    grid-column: ${(props) => (props.gridColumnStart ? `${props.gridColumnStart} /` : '')} span
        ${(props) => (props.gridColumns ? props.gridColumns : '8')};
    grid-row: span 3;
    background: #64d9fe80;
    padding: 2px;
    margin-top: 20px;
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;

const NoResultsText = styled.div<{ background?: boolean }>`
    display: grid;
    background: ${(props) => (props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    align-items: center;
    padding: 30px 15px;
`;

const SectionContainer = styled.section<{ gridColumns?: number; gridColumnStart?: number }>`
    grid-column: ${(props) => (props.gridColumnStart ? `${props.gridColumnStart} /` : '')} span
        ${(props) => (props.gridColumns ? props.gridColumns : '8')};
    grid-row: span 1;
    height: 390px;
    margin-bottom: 0;
    @media (max-width: 768px) {
        grid-column: span ${(props) => (props.gridColumns ? props.gridColumns : 12)};
        order: 12;
        height: 550px;
    }
`;

const SectionContent = styled(FlexDivColumn)`
    margin-top: 20px;
    height: 100%;
`;

const FilterWrapper = styled.div`
    position: relative;
`;

const FilterContainer = styled.div`
    position: absolute;
    top: -30px;
    right: 40px;
    width: 136px;
    @media (max-width: 768px) {
        width: 100px;
    }
`;

const DropDownWrapper = styled.div`
    position: relative;
    top: 5px;
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    width: 220px;
    right: 64px;
    padding: 2px;
    z-index: 100;
    border-radius: 15px;
    @media (max-width: 768px) {
        right: 100px;
    }
`;
const DropDown = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 15px;
    padding: 15px;
    .selected {
        color: #00f9ff !important;
        &:before {
            content: url(${checkmark});
            position: absolute;
            right: 15px;
            transform: scale(0.9);
        }
    }
`;

const FilterText = styled(Text)`
    cursor: pointer;
    font-weight: 700;
    font-size: 15px;
    text-transform: uppercase;
    &:not(:first-child) {
        padding-top: 15px;
    }
`;

export default TransactionsWithFilters;
