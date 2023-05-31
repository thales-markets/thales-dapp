import {
    currencyKeyToAssetIconMap,
    CRYPTO_CURRENCY_MAP,
    FIAT_CURRENCY_MAP,
    SYNTHS_MAP,
    currencyKeyToNameMap,
} from 'constants/currency';
import { COLLATERALS_INDEX } from 'constants/options';
import { StableCoins } from 'types/options';
import { getIsArbitrum, getIsBSC, getIsPolygon } from './network';

export const isSynth = (currencyKey: string) => !!SYNTHS_MAP[currencyKey];
export const isCryptoCurrency = (currencyKey: string) => !!CRYPTO_CURRENCY_MAP[currencyKey];
export const isFiatCurrency = (currencyKey: string) => !!FIAT_CURRENCY_MAP[currencyKey];
export const toMarketPair = (baseCurrencyKey: string, quoteCurrencyKey: string) =>
    `${baseCurrencyKey}-${quoteCurrencyKey}`;

// TODO: replace this with a more robust logic (like checking the asset field)
export const toInverseSynth = (currencyKey: string) => currencyKey.replace(/^s/i, 'i');
export const toStandardSynth = (currencyKey: string) => currencyKey.replace(/^i/i, 's');
export const synthToAsset = (currencyKey: string) => currencyKey.replace(/^(i|s)/i, '');

export const getAssetIcon = (currencyKey: string) =>
    currencyKeyToAssetIconMap[currencyKey] || currencyKeyToAssetIconMap[`s${currencyKey}`];

export const getSynthName = (currencyKey: string) =>
    currencyKeyToNameMap[currencyKey] || currencyKeyToNameMap[`s${currencyKey}`] || currencyKey;

export const getSynthAsset = (currencyKey: string) =>
    SYNTHS_MAP[currencyKey] ? synthToAsset(SYNTHS_MAP[currencyKey]) : currencyKey;

export const getStableCoinForNetwork = (networkId: number, customStable?: StableCoins) => {
    if (customStable) {
        return customStable as StableCoins;
    }

    if (getIsArbitrum(networkId)) {
        return CRYPTO_CURRENCY_MAP.USDC;
    }

    if (getIsBSC(networkId)) {
        return CRYPTO_CURRENCY_MAP.BUSD;
    }

    if (getIsPolygon(networkId)) {
        return CRYPTO_CURRENCY_MAP.USDC;
    }

    return SYNTHS_MAP.sUSD;
};

export const getMainCurrencyForNetwork = (networkId: number) => {
    if (getIsArbitrum(networkId)) return CRYPTO_CURRENCY_MAP.ETH;
    if (getIsBSC(networkId)) return CRYPTO_CURRENCY_MAP.BNB;
    if (getIsPolygon(networkId)) return CRYPTO_CURRENCY_MAP.MATIC;
    return CRYPTO_CURRENCY_MAP.ETH;
};

export const sortCurrencies = (a: string, b: string) => {
    if (a === 'BTC' || a === 'sBTC') return -1;
    if (b === 'BTC' || b === 'sETH') return 1;
    if (a === 'ETH' || a === 'sETH') return -1;
    if (b === 'ETH' || b === 'sETH') return 1;

    if (a === 'SNX' || a === 'sSNX') return -1;
    if (b === 'SNX' || b === 'sSNX') return 1;
    if (a === 'LINK' || a === 'sLINK') return -1;
    if (b === 'LINK' || b === 'sLINK') return 1;

    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
};

type StableBalances = {
    sUSD: number | null;
    DAI: number | null;
    USDC: number | null;
    USDT: number | null;
};

export const getDefaultStableIndexByBalance = (balancesObject: any) => {
    let index = COLLATERALS_INDEX['sUSD'];
    if (balancesObject?.sUSD < 1) {
        for (const [key, value] of Object.entries(balancesObject as StableBalances)) {
            if (value && value > 1) {
                index = COLLATERALS_INDEX[key as StableCoins];
                break;
            }
        }
    }

    return index;
};

export const getStableCoinBalance = (balancesQueryObject: any, currency: StableCoins) => {
    if (balancesQueryObject && currency) {
        return balancesQueryObject[currency] ? balancesQueryObject[currency] : 0;
    }
    return 0;
};
