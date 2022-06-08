import {
    currencyKeyToAssetIconMap,
    CurrencyKey,
    CRYPTO_CURRENCY_MAP,
    FIAT_CURRENCY_MAP,
    SYNTHS_MAP,
    currencyKeyToNameMap,
} from 'constants/currency';
import { COLLATERALS_INDEX } from 'constants/options';
import { StableCoins } from 'types/options';
import { getIsPolygon } from './network';

export const isSynth = (currencyKey: CurrencyKey) => !!SYNTHS_MAP[currencyKey];
export const isCryptoCurrency = (currencyKey: CurrencyKey) => !!CRYPTO_CURRENCY_MAP[currencyKey];
export const isFiatCurrency = (currencyKey: CurrencyKey) => !!FIAT_CURRENCY_MAP[currencyKey];
export const toMarketPair = (baseCurrencyKey: CurrencyKey, quoteCurrencyKey: CurrencyKey) =>
    `${baseCurrencyKey}-${quoteCurrencyKey}`;

// TODO: replace this with a more robust logic (like checking the asset field)
export const toInverseSynth = (currencyKey: CurrencyKey) => currencyKey.replace(/^s/i, 'i');
export const toStandardSynth = (currencyKey: CurrencyKey) => currencyKey.replace(/^i/i, 's');
export const synthToAsset = (currencyKey: CurrencyKey) => currencyKey.replace(/^(i|s)/i, '');

export const getAssetIcon = (currencyKey: CurrencyKey) =>
    currencyKeyToAssetIconMap[currencyKey] || currencyKeyToAssetIconMap[`s${currencyKey}`];

export const getSynthName = (currencyKey: string) =>
    currencyKeyToNameMap[currencyKey] || currencyKeyToNameMap[`s${currencyKey}`] || currencyKey;

export const getSynthAsset = (currencyKey: string) =>
    SYNTHS_MAP[currencyKey] ? synthToAsset(SYNTHS_MAP[currencyKey]) : currencyKey;

export const getStableCoinForNetwork = (networkId: number) => {
    if (getIsPolygon(networkId)) {
        return CRYPTO_CURRENCY_MAP.USDC;
    }

    return SYNTHS_MAP.sUSD;
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

export const checkMultipleStableBalances = (balancesObject: any) => {
    let index = COLLATERALS_INDEX['sUSD'];
    if (balancesObject?.sUSD == 0) {
        for (const [key, value] of Object.entries(balancesObject as StableBalances)) {
            if (value && value > 0) {
                index = COLLATERALS_INDEX[key as StableCoins];
                break;
            }
        }
    }

    return index;
};
