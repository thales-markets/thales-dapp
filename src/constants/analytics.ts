import Plausible from 'plausible-tracker';

export const PLAUSIBLE = Plausible({
    domain: 'thalesmarket.io',
    trackLocalhost: true,
    apiHost: 'https://analytics-v2.thalesmarket.io',
});

export const PLAUSIBLE_KEYS = {
    depositLp: 'deposit-lp',
    sellToAMM: 'amm-sell',
    buyFromAMM: 'amm-buy',
    speedMarketsBuy: 'speed-markets-buy',
    chainedSpeedMarketsBuy: 'chained-speed-markets-buy',
    buyFromRangeAMM: 'range-buy',
    sellToRangeAMM: 'range-sell',
    depositVaults: 'deposit-vaults',
};
