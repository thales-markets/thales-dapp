import { Positions } from 'enums/options';
import { BigNumber } from 'ethers';

export type CurrencyKeyOptionType = { value: string; label: string };

export type Phase = 'trading' | 'maturity' | 'expiry';

export type OptionSide = 'long' | 'short';

type OptionType = 'up' | 'down' | 'in' | 'out';

export type RangedMarketPositionType = 'in' | 'out';

type OptionsTransactionType = 'mint' | 'exercise' | 'buy' | 'sell';

export type Coins = 'sUSD' | 'DAI' | 'USDCe' | 'USDC' | 'USDT' | 'BUSD' | 'OP' | 'WETH' | 'ETH' | 'ARB';

export type OptionsTransaction = {
    hash: string;
    type: OptionsTransactionType;
    account?: string;
    currencyKey?: string;
    timestamp: number;
    side: OptionSide | RangedMarketPositionType;
    amount: number | string;
    market: string;
    status?: 'pending' | 'confirmed';
    price?: number;
    blockNumber: number;
};

type OptionValue = {
    long: number;
    short: number;
};

export type OptionsTransactions = OptionsTransaction[];

export type HistoricalOptionsMarketInfo = {
    address: string;
    timestamp: number;
    creator: string;
    currencyKey: string;
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
    discountedSide?: string;
    discount?: number;
    country?: string;
    eventName?: string;
    outcome?: string;
    finalPrice?: number;
    ammLiquidity?: number;
};

export type MarketInfo = {
    currencyKey: string;
    address: string;
    liquidity: number;
    price: number;
    roi: number;
    strikePrice: number;
    discount: number;
    positionType: Positions;
    url?: string;
};

export type RangedMarketPerPosition = {
    currencyKey: string;
    address: string;
    liquidity: number;
    price: number;
    roi: number;
    leftPrice: number;
    rightPrice: number;
    discount: number;
    positionType: Positions;
    url?: string;
};

export type RangedMarket = {
    address: string;
    timestamp: number;
    currencyKey: string;
    maturityDate: number;
    expiryDate: number;
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
    currencyKey: string;
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
    inAddress: string;
    outAddress: string;
    leftMarketAddress: string;
    rightMarketAddress: string;
};

export type OptionsMarketInfo = {
    isResolved: boolean;
    address: string;
    currencyKey: string;
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

    fees: {
        creator: number;
        pool: number;
    };
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
    market: string;
    orderSide: OrderSide;
    optionSide: OptionSide | RangedMarketPositionType;
};

export type Trades = Trade[];

export type UserLivePositions = {
    positionAddress: string;
    currencyKey: string;
    strikePrice: string;
    strikePriceNum?: number;
    amount: number;
    amountBigNumber: BigNumber;
    maturityDate: number;
    market: string;
    side: Positions;
    paid: number;
    value: number;
    isSpeedMarket: boolean;
    claimable?: boolean;
    finalPrice?: number;
    currentPrice?: number;
    user?: string;
};

export type UserClosedPositions = {
    currencyKey: string;
    strikePrice: string;
    strikePriceNum: number;
    amount: number;
    amountBigNumber: BigNumber;
    maturityDate: number;
    market: string;
    side: Positions;
    paid: number;
    value: number;
    finalPrice: number;
    isUserWinner: boolean;
};

export type RiskPerAsset = { currency: string; current: number; max: number };

export type AmmSpeedMarketsLimits = {
    maxBuyinAmount: number;
    minBuyinAmount: number;
    minimalTimeToMaturity: number;
    maximalTimeToMaturity: number;
    maxPriceDelaySec: number;
    risksPerAsset: RiskPerAsset[];
    lpFee: number;
    safeBoxImpact: number;
    whitelistedAddress: boolean;
};

export type SpeedMarket = {
    address: string;
    timestamp: number;
    currencyKey: string;
    strikePrice: number;
    maturityDate: number;
    isOpen: boolean;
    result: OptionSide | null;
    finalPrice?: number;
    isSpeedMarket: boolean;
};
