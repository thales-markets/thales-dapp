import { currencyKeyToAssetIconMap, CRYPTO_CURRENCY_MAP, SYNTHS_MAP, currencyKeyToNameMap } from 'constants/currency';
import { COLLATERALS_INDEX } from 'enums/options';
import { StableCoins } from 'types/options';
import { getIsArbitrum, getIsBSC, getIsPolygon } from './network';

// TODO: replace this with a more robust logic (like checking the asset field)
const synthToAsset = (currencyKey: string) => currencyKey.replace(/^(i|s)/i, '');

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
