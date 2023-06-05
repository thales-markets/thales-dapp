import checkmark from 'assets/images/checkmark.svg';
import Button from 'components/ButtonV2';
import { TransactionFilterEnum } from 'enums/token';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { orderBy } from 'lodash';
import useUserTokenTransactionsQuery from 'queries/token/useUserTokenTransactionsQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { TokenTransaction } from 'types/token';
import { ThemeInterface } from 'types/ui';
import { SectionHeader } from '../../styled-components';
import TransactionsTable from '../TransactionsTable';

type TransactionsWithFiltersProps = {
    filters: TransactionFilterEnum[];
    gridColumns?: number;
    gridColumnStart?: number;
};

const TransactionsWithFilters: React.FC<TransactionsWithFiltersProps> = ({ filters, gridColumns, gridColumnStart }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [filter, setFilter] = useState<string>(TransactionFilterEnum.ALL);
    const [showFilters, setShowFilters] = useState<boolean>(false);

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

    return (
        <SectionContainer
            txCount={filteredTransactions.length}
            gridColumns={gridColumns}
            gridColumnStart={gridColumnStart}
        >
            <SectionHeader>{t('options.earn.table.title')}</SectionHeader>
            <FilterWrapper>
                <FilterContainer
                    onMouseEnter={() => (isMobile ? '' : setShowFilters(true))}
                    onMouseLeave={() => setShowFilters(false)}
                >
                    <Button
                        height="30px"
                        padding="5px 40px"
                        fontSize="15px"
                        textColor={theme.button.textColor.secondary}
                        backgroundColor={theme.button.background.tertiary}
                        borderColor={theme.button.borderColor.tertiary}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {t(`options.earn.table.filter.button`)}
                    </Button>
                    <DropDownWrapper hidden={!showFilters}>
                        <DropDown>
                            {filters.map((filterItem) => {
                                if (filterItem === TransactionFilterEnum.LP_CLAIM_STAKING_REWARDS_SECOND) return null;
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
                    noResultsMessage={t(`options.earn.table.no-results.${filter}`)}
                />
            </SectionContent>
        </SectionContainer>
    );
};

const SectionContainer = styled.section<{
    txCount: number;
    gridColumns?: number;
    gridColumnStart?: number;
}>`
    grid-column: ${(props) => (props.gridColumnStart ? `${props.gridColumnStart} /` : '')} span
        ${(props) => (props.gridColumns ? props.gridColumns : '8')};
    grid-row: span 1;
    height: ${(props) => (props.txCount > 10 ? '390px' : '100%')};
    min-height: 200px;
    margin-bottom: 0;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        grid-column: span ${(props) => (props.gridColumns ? props.gridColumns : 12)};
        order: 12;
        height: 100%;
    }
`;

const SectionContent = styled(FlexDivColumn)`
    margin-top: 15px;
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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100px;
    }
`;

const DropDownWrapper = styled.div`
    position: relative;
    top: 5px;
    background: ${(props) => props.theme.background.secondary};
    width: 220px;
    right: 83px;
    padding: 2px;
    z-index: 100;
    border-radius: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        right: 100px;
    }
`;
const DropDown = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 8px;
    padding: 5px;
    .selected {
        color: ${(props) => props.theme.button.textColor.secondary} !important;
        &:before {
            content: url(${checkmark});
            position: absolute;
            right: 15px;
            transform: scale(0.9);
        }
    }
`;

const FilterText = styled.p`
    cursor: pointer;
    font-weight: 700;
    font-size: 15px;
    text-transform: uppercase;
    padding: 8px 10px;
    border-radius: 8px;
    color: ${(props) => props.theme.textColor.primary};
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
`;

export default TransactionsWithFilters;
