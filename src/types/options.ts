import { CurrencyKey } from '../constants/currency';
import { BigNumberish } from 'ethers';
import { LimitOrder, Signature } from '@0x/protocol-utils';
import { OrderPeriod } from 'constants/options';

export type Phase = 'trading' | 'maturity' | 'expiry';

export type OptionSide = 'long' | 'short';

export type OptionsTransactionType = 'mint' | 'exercise' | 'buy' | 'sell';

export type OptionsTransaction = {
    hash: string;
    type: OptionsTransactionType;
    account?: string;
    currencyKey?: CurrencyKey;
    timestamp: number;
    side: OptionSide;
    amount: number | string;
    market: string;
    status?: 'pending' | 'confirmed';
    price?: number;
};

export type OptionValue = {
    long: number;
    short: number;
};

export type BNOptionValue = {
    depositedBN: BigNumberish;
    feeBN: BigNumberish;
};

export type OptionsTransactions = OptionsTransaction[];

export type OptionsTransactionsMap = Record<string, OptionsTransactions>;

export type HistoricalOptionsMarketInfo = {
    address: string;
    timestamp: number;
    creator: string;
    currencyKey: CurrencyKey;
    strikePrice: number;
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
    customMarket: boolean;
    customOracle: string;
    result: OptionSide;
    country?: string;
    eventName?: string;
    outcome?: string;
};

export type OptionsMarketInfo = {
    isResolved: boolean;
    address: string;
    currencyKey: CurrencyKey;
    priceUpdatedAt: number;
    currentPrice: number;
    finalPrice: number;
    strikePrice: number;
    maturityDate: number;
    expiryDate: number;
    asset: string;
    phase: Phase;
    timeRemaining: number;
    result: OptionSide;
    totalSupplies: OptionValue;
    deposited: number;
    creator: string;
    // options: OptionValue;
    fees: {
        creatorFee: number;
        poolFee: number;
    };
    // creatorLimits: {
    //     capitalRequirement: number;
    //     skewLimit: number;
    // };
    // BN: BNOptionValue;
    longAddress: string;
    shortAddress: string;
    customMarket: boolean;
    oracleAdress: string;
    country?: string;
    eventName?: string;
    outcome?: string;
};

export type AccountMarketInfo = {
    long: number;
    short: number;
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
    rawOrder: LimitOrder;
    signature: Signature;
    displayOrder: DisplayOrder;
};

export type ExtendedOrderItem = OrderItem & {
    market: HistoricalOptionsMarketInfo;
    optionSide: OptionSide;
    walletBalance?: number;
};

export type ExtendedOrders = ExtendedOrderItem[];

export type DisplayOrder = {
    price: number;
    amount: number;
    fillableAmount: number;
    filled: number;
    total: number;
    fillableTotal: number;
    timeRemaining: number;
    orderHash: string;
    percentageOfMaximum?: number;
    potentialReturn: number;
    potentialReturnAmount: number;
};

export type OrderSide = 'buy' | 'sell';

export type Trade = {
    id: string;
    transactionHash: string;
    timestamp: number;
    orderHash: string;
    maker: string;
    taker: string;
    makerToken: string;
    takerToken: string;
    makerAmount: number;
    takerAmount: number;
};

export type Trades = Trade[];

export type UsersAssets = {
    market: HistoricalOptionsMarketInfo;
    balances: {
        long: number;
        short: number;
    };
};

export type UserOrderMetaData = {
    createdAt: string;
    orderHash: string;
    remainingFillableTakerAmount: string;
};

export type UserOrder = {
    metaData: UserOrderMetaData;
    order: Trade;
};

export type ZeroExErrorResponse = {
    code: number;
    reason: string;
    validationErrors?: ZeroExValidationError[];
};

export type ZeroExValidationError = {
    field: string;
    code: number;
    reason: string;
};

export type ExpirationOption = {
    value: OrderPeriod;
    label: string;
};

export type Flippening = {
    ethPrice: number;
    btcPrice: number;
    ethMarketCap: number;
    btcMarketCap: number;
    ratio: number;
};

export type ETHBTCRatio = {
    timestamp: number;
    ratio: number;
};

export type ETHBTCRatios = ETHBTCRatio[];

export type ETHBurned = {
    total: number;
    totalUsd: number;
    yesterday: number;
    yesterdayUsd: number;
};

export type ExpirationOptions = ExpirationOption[];
