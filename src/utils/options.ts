import orderBy from 'lodash/orderBy';
import { COLLATERALS, PHASE } from '../constants/options';
import { OptionSide, OptionsMarkets, Phase, RangedMarketPositionType } from '../types/options';
import { getStableCoinForNetwork, getSynthAsset } from './currency';
import { Color } from '@material-ui/lab';
import { ethers } from 'ethers';
import { NetworkId } from './network';
import { OPTIONS_CURRENCY_MAP } from 'constants/currency';

export enum SortDirection {
    NONE,
    ASC,
    DESC,
}

export const sortOptionsMarkets = (markets: OptionsMarkets) =>
    orderBy(
        markets.map((optionsMarket) => {
            const { phase, timeRemaining } = getPhaseAndEndDate(optionsMarket.maturityDate, optionsMarket.expiryDate);

            return {
                ...optionsMarket,
                phase,
                asset: getSynthAsset(optionsMarket.currencyKey),
                timeRemaining,
                phaseNum: PHASE[phase],
            };
        }),
        ['phaseNum', 'discountedSide', 'ammLiquidity'],
        ['asc', 'asc', 'desc']
    );

export const getPhaseAndEndDate = (
    maturityDate: number,
    expiryDate: number
): { phase: Phase; timeRemaining: number } => {
    const now = Date.now();

    if (maturityDate > now) {
        return {
            phase: 'trading',
            timeRemaining: maturityDate,
        };
    }

    if (expiryDate > now) {
        return {
            phase: 'maturity',
            timeRemaining: expiryDate,
        };
    }

    return {
        phase: 'expiry',
        timeRemaining: expiryDate,
    };
};

export const dispatchMarketNotification = (message: string, type?: Color) => {
    const marketNotificationEvent = new CustomEvent('market-notification', {
        bubbles: true,
        detail: { text: message, type: type },
    });
    document.dispatchEvent(marketNotificationEvent);
};

export const determineIfPositionalMarket = async (contract: ethers.Contract) => {
    try {
        await contract.estimateGas.creator();
        return true;
    } catch (e) {
        console.log('E ', e);
        return false;
    }
};

export const determineIfRangedMarket = async (contract: ethers.Contract) => {
    try {
        await contract.estimateGas.leftMarket();
        return true;
    } catch (e) {
        console.log('E ', e);
        return false;
    }
};

export const getSellToken = (
    isNonDefaultStable: boolean,
    isBuy: boolean,
    isFirstPosition: boolean,
    firstPositionAddress: string,
    secondPositionAddress: string,
    stableIndex: number,
    collateralContract: ethers.Contract | undefined,
    multiCollateralContract?: Array<ethers.Contract | undefined>
) => {
    if (isNonDefaultStable) {
        return multiCollateralContract ? multiCollateralContract[stableIndex]?.address : undefined;
    } else if (isBuy) {
        return collateralContract?.address;
    } else {
        return isFirstPosition ? firstPositionAddress : secondPositionAddress;
    }
};

export const getSellTokenCurrency = (
    isNonDefaultStable: boolean,
    isBuy: boolean,
    networkId: NetworkId,
    positionSide: RangedMarketPositionType | OptionSide,
    stableIndex: number
) => {
    if (isNonDefaultStable) {
        return COLLATERALS[stableIndex];
    } else if (isBuy) {
        return getStableCoinForNetwork(networkId);
    } else {
        return OPTIONS_CURRENCY_MAP[positionSide];
    }
};
