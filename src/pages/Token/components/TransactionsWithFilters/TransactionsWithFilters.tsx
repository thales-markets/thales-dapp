import React, { useMemo, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../TransactionsTable';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, Text } from 'theme/common';
import { TokenTransaction, TransactionFilterEnum } from 'types/token';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import useUserTokenTransactionsQuery from 'queries/token/useUserTokenTransactionsQuery';
import { SectionHeader } from '../../components2';
import checkmark from 'assets/images/checkmark.svg';
import arrowDown from 'assets/images/filters/arrow-down.svg';
import { orderBy } from 'lodash';
import { isMobile } from 'utils/device';
import Button from '../Button';

type TransactionsWithFiltersProps = {
    filters: TransactionFilterEnum[];
    gridColumns?: number;
};

const TransactionsWithFilters: React.FC<TransactionsWithFiltersProps> = ({ filters, gridColumns }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
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
        <SectionContainer gridColumns={gridColumns}>
            <SectionHeader>{t('options.earn.table.title')}</SectionHeader>
            {!noUserTx ? (
                <>
                    {isMobile() ? (
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
                        <OutsideClickHandler onOutsideClick={() => setShowFilters(false)}>
                            <FilterContainer
                                onMouseOver={() => setShowFilters(true)}
                                onMouseLeave={() => setShowFilters(false)}
                            >
                                <Button
                                    height={'32px'}
                                    padding={'5px 40px'}
                                    margin={'0 20px 0 65px'}
                                    fontSize={'15px'}
                                    onClickHandler={() => setShowFilters(!showFilters)}
                                >
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
                        </OutsideClickHandler>
                    )}
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
                <NoResultsContainer gridColumns={gridColumns}>
                    <NoResultsText>{t(`options.earn.table.no-activity`)}</NoResultsText>
                </NoResultsContainer>
            )}
        </SectionContainer>
    );
};

const NoResultsContainer = styled.div<{ gridColumns?: number }>`
    box-sizing: border-box;
    border-radius: 15px;
    grid-column: span ${(_props) => (_props.gridColumns ? _props.gridColumns : '8')};
    grid-row: span 3;
    background: #64d9fe80;
    padding: 2px;
    margin-top: 40px;
`;

const NoResultsText = styled.div<{ background?: boolean }>`
    display: grid;
    background: ${(_props) => (_props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    align-items: center;
    padding: 30px 15px;
`;

const SectionContainer = styled.section<{ gridColumns?: number }>`
    grid-column: span ${(_props) => (_props.gridColumns ? _props.gridColumns : '8')};
    grid-row: span 1;
    height: 590px;
    margin-bottom: 0;
`;

const SectionContent = styled(FlexDivColumn)`
    margin-top: 40px;
    height: calc(100% - 30px);
`;

const FilterContainer = styled.div`
    position: absolute;
    right: 20px;
`;

const DropDownWrapper = styled.div`
    position: relative;
    top: 5px;
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    width: 220px;
    max-width: 100%;
    right: 0;
    padding: 2px;
    z-index: 100;
    border-radius: 15px;
`;
const DropDown = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 15px;
    padding: 10px;
    .selected {
        color: #00f9ff !important;
        &:before {
            content: url(${checkmark});
            position: absolute;
            right: 10px;
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
    cursor: pointer;
    font-weight: 700;
    font-size: 15px;
    text-transform: uppercase;
    padding: 7px 0;
`;

export default TransactionsWithFilters;
