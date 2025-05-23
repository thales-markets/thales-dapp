import { Positions } from 'enums/options';
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

export const SLIPPAGE_PERCENTAGE = [0.5, 1, 2];

export const MINIMUM_AMM_LIQUIDITY = 2;
export const MIN_SCEW_IMPACT = 0.0;

export const AMM_MAX_BUFFER_PERCENTAGE = 0.98;

export const POSITION_BALANCE_THRESHOLD = 0.01;

export const MARKET_DURATION_IN_DAYS = 90;

export const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

const TODAY = new Date();
TODAY.setUTCHours(23, 59, 0, 0);

export const MIN_MATURITY = Math.round(
    new Date(
        new Date(new Date().setDate(TODAY.getDate() - MARKET_DURATION_IN_DAYS)).setUTCHours(0, 0, 0, 0)
    ).getTime() / 1000
); // show history for 90 days in the past
export const MAX_MATURITY = Math.round(Number(TODAY.getTime() / 1000)); // show history until today

export const DEPRECATED_CONTRACT_ADDRESSES = [
    // PositionalMarketManager
    '0x9227334352a890e51e980beb7a56bbdd01499b54',
    // ThalesAMM
    '0x278b5a44397c9d8e52743fedec263c4760dc1a1a',
    // RangedAMM
    '0x2d356b114cbca8deff2d8783eac2a5a5324fe1df',
];
