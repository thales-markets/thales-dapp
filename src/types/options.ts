import { CurrencyKey } from '../constants/currency';
import { BigNumberish } from 'ethers/utils';
import { SignedOrder } from '@0x/types';

export type Phase = 'bidding' | 'trading' | 'maturity' | 'expiry';

export type OptionSide = 'long' | 'short';

export type OptionsTransactionType = 'refund' | 'bid' | 'exercise' | 'claim';

export type OptionsTransaction = {
    hash: string;
    type: OptionsTransactionType;
    account: string;
    currencyKey: CurrencyKey;
    timestamp: number;
    side: OptionSide;
    amount: number | string;
    market: string;
    status?: 'pending' | 'confirmed';
};

export type OptionValue = {
    long: number;
    short: number;
};

export type BNOptionValue = {
    totalLongBN: BigNumberish;
    totalShortBN: BigNumberish;
    depositedBN: BigNumberish;
    feeBN: BigNumberish;
    refundFeeBN: BigNumberish;
};

export type OptionsTransactions = OptionsTransaction[];

export type OptionsTransactionsMap = Record<string, OptionsTransactions>;

export type HistoricalOptionsMarketInfo = {
    address: string;
    timestamp: number;
    creator: string;
    currencyKey: CurrencyKey;
    strikePrice: number;
    biddingEndDate: number;
    maturityDate: number;
    expiryDate: number;
    isOpen: boolean;
    longPrice: number;
    shortPrice: number;
    poolSize: number;
    asset: string;
    phase: Phase;
    phaseNum: number;
    timeRemaining: number;
    openOrders: number;
    orders: Array<any>;
    longAddress: string;
    shortAddress: string;
};

export type OptionsMarketInfo = {
    isResolved: boolean;
    address: string;
    currencyKey: CurrencyKey;
    priceUpdatedAt: number;
    currentPrice: number;
    finalPrice: number;
    strikePrice: number;
    biddingEndDate: number;
    maturityDate: number;
    expiryDate: number;
    longPrice: number;
    shortPrice: number;
    asset: string;
    phase: Phase;
    timeRemaining: number;
    result: OptionSide;
    totalBids: OptionValue;
    totalClaimableSupplies: OptionValue;
    totalSupplies: OptionValue;
    deposits: {
        deposited: number;
        exercisableDeposits: number;
    };
    creator: string;
    options: OptionValue;
    fees: {
        creatorFee: number;
        poolFee: number;
        refundFee: number;
    };
    creatorLimits: {
        capitalRequirement: number;
        skewLimit: number;
    };
    BN: BNOptionValue;
    withdrawalsEnabled: boolean;
    longAddress: string;
    shortAddress: string;
};

export type AccountMarketInfo = {
    claimable: OptionValue;
    balances: OptionValue;
    bids: OptionValue;
};

export type OptionsMarkets = HistoricalOptionsMarketInfo[];
export type OptionsMarketsMap = Record<string, HistoricalOptionsMarketInfo>;

export type TradeCardPhaseProps = {
    optionsMarket: OptionsMarketInfo;
    accountMarketInfo: AccountMarketInfo;
};

export type CurrentPosition = {
    bid: number;
    payout: number;
};

export type OrderbookInfo = {
    buyOrders: Orders;
    sellOrders: Orders;
};

export type Orders = OrderItem[];

export type OrderItem = {
    rawSignedOrder: SignedOrder;
    displayOrder: DisplayOrder;
};

export type DisplayOrder = {
    price: number;
    amount: number;
    fillableAmount: number;
    total: number;
    timeRemaining: number;
};

export type OrderSide = 'buy' | 'sell';
