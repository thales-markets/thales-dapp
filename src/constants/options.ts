import { Phase, OptionSide } from '../types/options';

export const PHASE: Record<Phase, number> = {
    bidding: 0,
    trading: 1,
    maturity: 2,
    expiry: 3,
};

export const SIDE: Record<OptionSide | number, number | OptionSide> = {
    long: 0,
    short: 1,
    0: 'long',
    1: 'short',
};

export const PHASES = ['bidding', 'trading', 'maturity', 'expiry'] as Phase[];
export const PHASES_CARDS = ['bidding', 'trading', 'maturity'] as Phase[];

export const SLIPPAGE_THRESHOLD = 0.1;
