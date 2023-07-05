import {
    currencyKeyToAssetIconMap,
    SYNTHS_MAP,
    currencyKeyToNameMap,
    CRYPTO_CURRENCY,
    COMMODITY,
    COLLATERALS,
} from 'constants/currency';
import { StableCoins } from 'types/options';
import { Network } from 'enums/network';

// TODO: replace this with a more robust logic (like checking the asset field)
const synthToAsset = (currencyKey: string) => currencyKey.replace(/^(i|s)/i, '');

export const getAssetIcon = (currencyKey: string) =>
    currencyKeyToAssetIconMap[currencyKey] || currencyKeyToAssetIconMap[`s${currencyKey}`];

export const getSynthName = (currencyKey: string) =>
    currencyKeyToNameMap[currencyKey] || currencyKeyToNameMap[`s${currencyKey}`] || currencyKey;

export const getSynthAsset = (currencyKey: string) =>
    SYNTHS_MAP[currencyKey] ? synthToAsset(SYNTHS_MAP[currencyKey]) : currencyKey;

export const getDefaultCollateral = (networkId: Network) => COLLATERALS[networkId][0];

export const getCollateral = (networkId: Network, index: number) => COLLATERALS[networkId][index];

export const getCollaterals = (networkId: Network) => COLLATERALS[networkId];

export const getCollateralIndexForNetwork = (networkId: Network, currencyKey: StableCoins) =>
    COLLATERALS[networkId].indexOf(currencyKey);

type StableBalances = {
    sUSD: number | null;
    DAI: number | null;
    USDC: number | null;
    USDT: number | null;
};

export const getDefaultStableIndexByBalance = (balancesObject: any, networkId: Network, currencyKey: StableCoins) => {
    let index = COLLATERALS[networkId].indexOf(currencyKey);
    if (balancesObject && balancesObject[currencyKey] < 1) {
        for (const [key, value] of Object.entries(balancesObject as StableBalances)) {
            if (value && value > 1) {
                index = COLLATERALS[networkId].indexOf(key as StableCoins);
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

export const getCurrencyPriority = (currency: string) => {
    const currencyPriority = CRYPTO_CURRENCY.indexOf(currency);
    const commodityPriority = CRYPTO_CURRENCY.length + COMMODITY.indexOf(currency);
    return currencyPriority !== -1 ? currencyPriority : commodityPriority;
};
