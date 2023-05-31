import { Network, NetworkId } from 'utils/network';
import { Phase, OptionSide, RangedMarketPositionType, MarketType } from '../types/options';

export const PHASE: Record<Phase, number> = {
    trading: 0,
    maturity: 1,
    expiry: 2,
};

export enum Positions {
    UP = 'UP',
    DOWN = 'DOWN',
    IN = 'IN',
    OUT = 'OUT',
}

export const POSITIONS_TO_SIDE_MAP: Record<Positions, number> = {
    UP: 0,
    DOWN: 1,
    IN: 0,
    OUT: 1,
};

export const MARKET_TYPE: Record<MarketType | number, number | MarketType> = {
    ranged: 1,
    0: 'positional',
    1: 'ranged',
    positional: 0,
};

export const SIDE: Record<OptionSide | number, number | OptionSide> = {
    long: 0,
    short: 1,
    0: 'long',
    1: 'short',
};

export const RANGE_SIDE: Record<RangedMarketPositionType | number, number | RangedMarketPositionType> = {
    in: 0,
    out: 1,
    0: 'in',
    1: 'out',
};

export enum COLLATERALS_INDEX {
    'sUSD' = 0,
    'DAI' = 1,
    'USDC' = 2,
    'USDT' = 3,
    'BUSD' = 4,
}

export const COLLATERALS = ['sUSD', 'DAI', 'USDC', 'USDT'];

export const STABLE_DECIMALS = {
    sUSD: 18,
    DAI: 18,
    USDC: 6,
    USDT: 6,
    BUSD: 18,
};

export const SLIPPAGE_PERCENTAGE = [0.5, 1, 2];

export enum OrderPeriod {
    TEN_MINUTES = 'TEN_MINUTES',
    ONE_HOUR = 'ONE_HOUR',
    ONE_DAY = 'ONE_DAY',
    ONE_WEEK = 'ONE_WEEK',
    TRADING_END = 'TRADING_END',
    CUSTOM = 'CUSTOM',
}

export const MINIMUM_AMM_LIQUIDITY = 2;
const MAX_L2_GAS_LIMIT = 15000000;
export const L2_EXERCISE_GAS_LIMIT = 1000000;
export const MIN_SCEW_IMPACT = 0.0;

export const getMaxGasLimitForNetwork = (networkId: NetworkId) => {
    if (networkId == Network.Arbitrum) return null;
    return MAX_L2_GAS_LIMIT;
};

export const AMM_MAX_BUFFER_PERCENTAGE = 0.98;
