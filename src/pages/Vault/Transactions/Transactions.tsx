import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivRow } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import { getIsAppReady } from 'redux/modules/app';
import TradesTable from '../TradesTable';
import useVaultTradesQuery from 'queries/vault/useVaultTradesQuery';
import { VaultTrades, VaultTrade, VaultUserTransaction, VaultUserTransactions } from 'types/vault';
import SelectInput from 'components/SelectInput';
import { VaultTransaction } from 'constants/vault';
import UserTransactionsTable from '../UserTransactionsTable';
import useVaultUserTransactionsQuery from 'queries/vault/useVaultUserTransactionsQuery';

type TransactionsProps = {
    vaultAddress: string;
    currentRound: number;
};

const Transactions: React.FC<TransactionsProps> = ({ vaultAddress, currentRound }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [vaultTrades, setVaultTrades] = useState<VaultTrades>([]);
    const [vaultUserTransactions, setVaultUserTransactions] = useState<VaultUserTransactions>([]);
    const [round, setRound] = useState<number>(currentRound > 0 ? currentRound - 1 : 0);
    const [selectedTab, setSelectedTab] = useState<VaultTransaction>(VaultTransaction.TRADES_HISTORY);

    const rounds: Array<{ value: number; label: string }> = [];
    for (let index = 0; index < currentRound; index++) {
        rounds.push({
            value: index,
            label: `${t('vault.trades-history.round-label')} ${index + 1}`,
        });
    }

    const tabContent: Array<{
        id: VaultTransaction;
        name: string;
    }> = useMemo(
        () => [
            {
                id: VaultTransaction.TRADES_HISTORY,
                name: t(`vault.trades-history.title`),
            },
            {
                id: VaultTransaction.USER_TRANSACTIONS,
                name: t(`vault.user-transactions.title`),
            },
        ],
        [t]
    );

    const vaultTradesQuery = useVaultTradesQuery(vaultAddress, networkId, {
        enabled: isAppReady && !!vaultAddress,
    });

    useEffect(() => {
        if (vaultTradesQuery.isSuccess && vaultTradesQuery.data) {
            setVaultTrades(
                orderBy(
                    vaultTradesQuery.data.filter((trade: VaultTrade) => trade.round === round + 1),
                    ['timestamp', 'blockNumber'],
                    ['desc', 'desc']
                )
            );
        } else {
            setVaultTrades([]);
        }
    }, [vaultTradesQuery.isSuccess, vaultTradesQuery.data, round]);

    const noVaultTrades = vaultTrades.length === 0;

    const vaultUserTransactionsQuery = useVaultUserTransactionsQuery(vaultAddress, networkId, {
        enabled: isAppReady && !!vaultAddress,
    });

    useEffect(() => {
        if (vaultUserTransactionsQuery.isSuccess && vaultUserTransactionsQuery.data) {
            setVaultUserTransactions(
                orderBy(
                    vaultUserTransactionsQuery.data.filter((trade: VaultUserTransaction) => trade.round === round + 1),
                    ['timestamp', 'blockNumber'],
                    ['desc', 'desc']
                )
            );
        } else {
            setVaultUserTransactions([]);
        }
    }, [vaultUserTransactionsQuery.isSuccess, vaultUserTransactionsQuery.data, round]);

    const noVaultUserTransactions = vaultUserTransactions.length === 0;

    return (
        <Container>
            <Header>
                <TabContainer>
                    {tabContent.map((tab, index) => (
                        <Tab
                            isActive={tab.id === selectedTab}
                            key={index}
                            index={index}
                            onClick={() => {
                                setSelectedTab(tab.id);
                            }}
                            className={`${tab.id === selectedTab ? 'selected' : ''}`}
                        >
                            {tab.name}
                        </Tab>
                    ))}
                </TabContainer>

                {currentRound !== 0 && (
                    <SelectContainer>
                        <SelectInput
                            options={rounds}
                            handleChange={(value) => setRound(Number(value))}
                            defaultValue={round}
                            width={230}
                        />
                    </SelectContainer>
                )}
            </Header>
            <TableContainer>
                {selectedTab === VaultTransaction.TRADES_HISTORY && (
                    <TradesTable
                        transactions={vaultTrades}
                        isLoading={vaultTradesQuery.isLoading}
                        noResultsMessage={
                            noVaultTrades ? <span>{t(`vault.trades-history.no-trades`)}</span> : undefined
                        }
                    />
                )}
                {selectedTab === VaultTransaction.USER_TRANSACTIONS && (
                    <UserTransactionsTable
                        transactions={vaultUserTransactions}
                        isLoading={vaultUserTransactionsQuery.isLoading}
                        noResultsMessage={
                            noVaultUserTransactions ? (
                                <span>{t(`vault.user-transactions.no-transactions`)}</span>
                            ) : undefined
                        }
                    />
                )}
            </TableContainer>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    border-radius: 10px;
    position: relative;
    max-height: 362px;
    min-height: 362px;
    overflow-y: auto;
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    @media (max-width: 767px) {
        width: 95%;
    }
    border: 2px solid rgba(100, 217, 254, 0.5);
`;

const Header = styled(FlexDivRow)`
    margin: 10px 18px;
    align-items: center;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const TableContainer = styled(FlexDivColumn)`
    overflow: auto;
    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-track {
        background: #04045a;
        border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 15px;
        background: #355dff;
    }
    ::-webkit-scrollbar-thumb:active {
        background: #44e1e2;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(67, 116, 255);
    }
    @media (max-width: 767px) {
        width: 700px;
    }
`;

export const SelectContainer = styled.div`
    width: 230px;
`;

const TabContainer = styled(FlexDiv)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const Tab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    user-select: none;
    margin-left: 20px;
    margin-right: 20px;
    color: #748bc6;
    &.selected {
        transition: 0.2s;
        color: #f6f6fe;
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: #00f9ff;
    }
    @media (max-width: 767px) {
        margin-bottom: 10px;
        margin-left: 0px;
        margin-right: 0px;
    }
`;

export default Transactions;