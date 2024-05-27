import SelectInput from 'components/SelectInput';
import { LiquidityPoolTransaction } from 'enums/liquidityPool';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { orderBy } from 'lodash';
import useLiquidityPoolUserTransactionsQuery from 'queries/liquidityPool/useLiquidityPoolUserTransactionsQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivRow } from 'styles/common';
import { LiquidityPoolUserTransaction, LiquidityPoolUserTransactions } from 'types/liquidityPool';
import { RootState } from 'types/ui';
import UserTransactionsTable from '../UserTransactionsTable';

type TransactionsProps = {
    currentRound: number;
};

const Transactions: React.FC<TransactionsProps> = ({ currentRound }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [liquidityPoolUserTransactions, setLiquidityPoolUserTransactions] = useState<LiquidityPoolUserTransactions>(
        []
    );
    const [liquidityPoolMyTransactions, setLiquidityPoolMyTransactions] = useState<LiquidityPoolUserTransactions>([]);
    const [round, setRound] = useState<number>(currentRound);
    const [selectedTab, setSelectedTab] = useState<LiquidityPoolTransaction>(
        LiquidityPoolTransaction.USER_TRANSACTIONS
    );

    const tabContent: Array<{
        id: LiquidityPoolTransaction;
        name: string;
    }> = useMemo(
        () => [
            {
                id: LiquidityPoolTransaction.USER_TRANSACTIONS,
                name: t(`liquidity-pool.user-transactions.title`),
            },
            {
                id: LiquidityPoolTransaction.YOUR_TRANSACTIONS,
                name: t(`liquidity-pool.user-transactions.your-transactions-title`),
            },
        ],
        [t]
    );

    const rounds: Array<{ value: number; label: string }> = [];
    for (let index = 0; index <= currentRound; index++) {
        rounds.push({
            value: index,
            label: `${t('liquidity-pool.user-transactions.round-label')} ${index}`,
        });
    }

    const liquidityPoolUserTransactionsQuery = useLiquidityPoolUserTransactionsQuery(networkId, round, {
        enabled: isAppReady,
    });

    useEffect(() => setRound(currentRound), [currentRound]);

    useEffect(() => {
        if (liquidityPoolUserTransactionsQuery.isSuccess && liquidityPoolUserTransactionsQuery.data) {
            setLiquidityPoolUserTransactions(
                orderBy(liquidityPoolUserTransactionsQuery.data, ['timestamp', 'blockNumber'], ['desc', 'desc'])
            );
            setLiquidityPoolMyTransactions(
                orderBy(
                    liquidityPoolUserTransactionsQuery.data.filter(
                        (trade: LiquidityPoolUserTransaction) => trade.account === walletAddress.toLowerCase()
                    ),
                    ['timestamp', 'blockNumber'],
                    ['desc', 'desc']
                )
            );
        } else {
            setLiquidityPoolUserTransactions([]);
        }
    }, [liquidityPoolUserTransactionsQuery.isSuccess, liquidityPoolUserTransactionsQuery.data, round, walletAddress]);

    const noLiquidityPoolUserTransactions = liquidityPoolUserTransactions.length === 0;
    const noLiquidityPoolMyTransactions = liquidityPoolMyTransactions.length === 0;

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
                {selectedTab === LiquidityPoolTransaction.USER_TRANSACTIONS && (
                    <RightHeader>
                        <SelectContainer>
                            <SelectInput
                                options={rounds}
                                handleChange={(value) => setRound(Number(value))}
                                defaultValue={round}
                                width={230}
                            />
                        </SelectContainer>
                    </RightHeader>
                )}
            </Header>
            <TableContainer>
                {selectedTab === LiquidityPoolTransaction.USER_TRANSACTIONS && (
                    <UserTransactionsTable
                        transactions={liquidityPoolUserTransactions}
                        isLoading={liquidityPoolUserTransactionsQuery.isLoading}
                        noResultsMessage={
                            noLiquidityPoolUserTransactions ? (
                                <span>{t(`liquidity-pool.user-transactions.no-transactions`)}</span>
                            ) : undefined
                        }
                    />
                )}
                {selectedTab === LiquidityPoolTransaction.YOUR_TRANSACTIONS && (
                    <UserTransactionsTable
                        transactions={liquidityPoolMyTransactions}
                        isLoading={liquidityPoolUserTransactionsQuery.isLoading}
                        noResultsMessage={
                            noLiquidityPoolMyTransactions ? (
                                <span>{t(`liquidity-pool.user-transactions.no-transactions`)}</span>
                            ) : undefined
                        }
                    />
                )}
            </TableContainer>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    position: relative;
    max-height: 370px;
    min-height: 370px;
    overflow-y: auto;
    width: 70%;
    margin-top: 20px;
    @media (max-width: 1440px) {
        width: 95%;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-height: 1100px;
        min-height: initial;
    }
`;

const Header = styled(FlexDivRow)`
    margin: 15px 18px;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

const RightHeader = styled(FlexDivRow)`
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

const TabContainer = styled(FlexDiv)`
    min-height: 38px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

const Tab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    user-select: none;
    margin-left: 0px;
    margin-right: 40px;
    color: ${(props) => props.theme.textColor.secondary};
    &.selected {
        transition: 0.2s;
        color: ${(props) => props.theme.textColor.quaternary};
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: ${(props) => props.theme.textColor.primary};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 10px;
        margin-left: 0px;
        margin-right: 0px;
    }
`;

const TableContainer = styled(FlexDivColumn)`
    overflow: auto;
`;

const SelectContainer = styled.div`
    width: 230px;
`;

export default Transactions;
