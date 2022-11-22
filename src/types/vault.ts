import { CurrencyKey } from 'constants/currency';
import { VaultTradeStatus } from 'constants/vault';
import { HistoricalOptionsMarketInfo } from './options';

export type VaultData = {
    round: number;
    roundEndTime: number;
    vaultStarted: boolean;
    maxAllowedDeposit: number;
    allocationCurrentRound: number;
    allocationNextRound: number;
    availableAllocationNextRound: number;
    allocationNextRoundPercentage: number;
    isRoundEnded: boolean;
    minDepositAmount: number;
    maxAllowedUsers: number;
    usersCurrentlyInVault: number;
    canCloseCurrentRound: boolean;
    paused: boolean;
    lifetimePnl: number;
    utilizationRate: number;
    priceLowerLimit: number;
    priceUpperLimit: number;
    skewImpactLimit: number;
    allocationLimitsPerMarketPerRound: number;
    minTradeAmount: number;
    allocationSpentInARound: number;
    availableAllocationInARound: number;
    roundLength: number;
};

export type UserVaultData = {
    balanceCurrentRound: number;
    balanceNextRound: number;
    balanceTotal: number;
    isWithdrawalRequested: boolean;
    hasDepositForCurrentRound: boolean;
    hasDepositForNextRound: boolean;
};

export type VaultTrade = {
    hash: string;
    timestamp: number;
    amount: number;
    paid: number;
    blockNumber: number;
    currencyKey: CurrencyKey;
    strikePrice: number;
    maturityDate: number;
    market: string;
    result: number;
    position: number;
    wholeMarket: HistoricalOptionsMarketInfo;
    status: VaultTradeStatus;
};

export type VaultTrades = VaultTrade[];

export type VaultPnlPerRound = {
    round: number | string;
    pnl: number;
};

export type VaultPnls = VaultPnlPerRound[];

export type VaultUserTransaction = {
    hash: string;
    timestamp: number;
    blockNumber: number;
    type: string;
    account: string;
    amount: number;
    round: number;
};

export type VaultUserTransactions = VaultUserTransaction[];
