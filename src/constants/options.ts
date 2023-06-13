import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { NetworkId } from 'utils/network';
import { OptionSide, RangedMarketPositionType } from '../types/options';

export const POSITIONS_TO_SIDE_MAP: Record<Positions, number> = {
    UP: 0,
    DOWN: 1,
    IN: 0,
    OUT: 1,
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

export const OPTIONS_POSITIONS_MAP = {
    long: 'UP',
    short: 'DOWN',
    in: 'IN',
    out: 'OUT',
};

export const COLLATERALS = ['sUSD', 'DAI', 'USDC', 'USDT'];

export const STABLE_DECIMALS = {
    sUSD: 18,
    DAI: 18,
    USDC: 6,
    USDT: 6,
    BUSD: 18,
};

export const SLIPPAGE_PERCENTAGE = [0.5, 1, 2];

export const MINIMUM_AMM_LIQUIDITY = 2;
export const MIN_SCEW_IMPACT = 0.0;

const MAX_L2_GAS_LIMIT = 29000000;

export const getMaxGasLimitForNetwork = (networkId: NetworkId) => {
    if (networkId == Network['Mainnet-Ovm']) return MAX_L2_GAS_LIMIT;
    return null;
};

export const AMM_MAX_BUFFER_PERCENTAGE = 0.98;

export const POSITION_BALANCE_THRESHOLD = 0.01;
