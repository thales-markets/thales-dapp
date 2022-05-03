import { CurrencyKey } from '../constants/currency';
import { BigNumberish } from 'ethers';
import { OrderPeriod } from 'constants/options';

export type Phase = 'trading' | 'maturity' | 'expiry';

export type OptionSide = 'long' | 'short';

export type OptionType = 'up' | 'down' | 'in' | 'out';

export type RangedMarketPositionType = 'in' | 'out';

export type OptionsTransactionType = 'mint' | 'exercise' | 'buy' | 'sell';

export type OrderSideOptionType = { value: OrderSide; label?: string; i18nLabel?: string };

export type TooltipType = 'error' | 'success' | 'info';

export type TradingType = 'AMM' | 'Orderbook';

export type MarketType = 'positional' | 'ranged';

export type OptionsTransaction = {
    hash: string;
    type: OptionsTransactionType;
    account?: string;
    currencyKey?: CurrencyKey;
    timestamp: number;
    side: OptionSide | RangedMarketPositionType;
    amount: number | string;
    market: string;
    status?: 'pending' | 'confirmed';
    price?: number;
    blockNumber: number;
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
    availableLongs: number;
    availableShorts: number;
    country?: string;
    eventName?: string;
    outcome?: string;
    finalPrice?: number;
    ammLiquidity?: number;
};

export type RangedMarket = {
    address: string;
    timestamp: number;
    currencyKey: CurrencyKey;
    maturityDate: number;
    leftPrice: number;
    rightPrice: number;
    inAddress: string;
    outAddress: string;
    leftMarket: {
        id: string;
        creator: string;
        longAddress: string;
        shortAddress: string;
    };
    rightMarket: {
        id: string;
        creator: string;
        longAddress: string;
        shortAddress: string;
    };
    isOpen: boolean;
    result: OptionType;
    finalPrice: number;
};

export type RangedMarketData = {
    isResolved: boolean;
    address: string;
    currencyKey: CurrencyKey;
    asset: string;
    currentPrice: number;
    finalPrice: number;
    leftPrice: number;
    rightPrice: number;
    maturityDate: number;
    expiryDate: number;
    phase: Phase;
    timeRemaining: number;
    result: RangedMarketPositionType;
    availablePositions: {
        toBuyIn: number;
        toBuyOut: number;
        toSellIn: number;
        toSellOut: number;
    };
    inAddress: string;
    outAddress: string;
    leftMarketAddress: string;
    rightMarketAddress: string;
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
        creator: number;
        pool: number;
    };
    // creatorLimits: {
    //     capitalRequirement: number;
    //     skewLimit: number;
    // };
    // BN: BNOptionValue;
    availableLongs: number;
    availableShorts: number;
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

export type RangedMarketBalanceInfo = {
    in: number;
    out: number;
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
    rawOrder: any;
    signature: any;
    displayOrder: DisplayOrder;
    orderData: any;
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
    blockNumber: number;
};
export type ExtendedTrade = Trade & {
    market: string;
    optionSide: OptionSide;
    orderSide: OrderSide;
    marketItem: HistoricalOptionsMarketInfo;
};

export type Trades = Trade[];
export type ExtendedTrades = ExtendedTrade[];

export type UsersAssets = {
    market: HistoricalOptionsMarketInfo;
    balances: {
        long: number;
        short: number;
        longValue?: number;
        shortValue?: number;
    };
};

export type OrderData = {
    makerAsset: string;
    takerAsset: string;
    predicate: string;
};

export type UserOrder = {
    makerAmount: number;
    takerAmount: number;
    orderMaker: number;
    remainingMakerAmount: number;
    data: OrderData;
};

export type UserOrders = UserOrder[];

export type OneInchErrorResponse = {
    statusCode: number;
    description: string;
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

export type GridFilters = {
    searchQuery: string;
    sort?:
        | Array<
              | {
                    column: string;
                    type: 'asc' | 'desc';
                }
              | undefined
          >
        | [];
    assetFilters: string[];
    showOnlyLiquid?: boolean;
};

export type PrimaryOptionsFilter = 'allMarkets' | 'watchlist' | 'recentlyAdded';

export type GridSortOption = 'byName' | 'byTimeRemaining';

export type SortOption = {
    property: string;
    displayName: string;
    desc: boolean;
    asc: boolean;
};
