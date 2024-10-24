import { Positions } from 'enums/options';
import { BigNumber } from 'ethers';
import { HistoricalOptionsMarketInfo, RangedMarket, Trade } from './options';

export type UserPosition = {
    positionAddress: string;
    currencyKey: string;
    strikePrice: number;
    leftPrice: number;
    rightPrice: number;
    finalPrice: number;
    amount: number;
    amountBigNumber: BigNumber;
    maturityDate: number;
    expiryDate: number;
    market: string;
    side: Positions;
    paid: number;
    value: number;
    claimable: boolean;
    claimed: boolean;
    isRanged: boolean;
    isDeprecatedCurrency: boolean;
};

export type UserProfileData = {
    profit: number;
    volume: number;
    numberOfTrades: number;
    gain: number;
    investment: number;
};

export type TradeWithMarket = Trade & {
    marketItem: HistoricalOptionsMarketInfo | RangedMarket;
};

export type VaultsAndLiquidityPoolUserTransaction = {
    name: string;
    hash: string;
    timestamp: number;
    blockNumber: number;
    type: string;
    account: string;
    amount: number;
    round: number;
};

export type VaultsAndLiquidityPoolUserTransactions = VaultsAndLiquidityPoolUserTransaction[];
