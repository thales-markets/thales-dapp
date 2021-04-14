import { MarketWidgetKey } from 'constants/ui';
import orderBy from 'lodash/orderBy';
import { SynthsMap } from 'types/synthetix';
import { PHASE } from '../constants/options';
import { OptionsMarkets, Phase } from '../types/options';

export const sortOptionsMarkets = (markets: OptionsMarkets, synthsMap: SynthsMap) =>
    orderBy(
        markets.map((optionsMarket) => {
            const { phase, timeRemaining } = getPhaseAndEndDate(
                optionsMarket.biddingEndDate,
                optionsMarket.maturityDate,
                optionsMarket.expiryDate
            );

            return {
                ...optionsMarket,
                phase,
                asset: synthsMap[optionsMarket.currencyKey]?.asset || optionsMarket.currencyKey,
                timeRemaining,
                phaseNum: PHASE[phase],
            };
        }),
        ['phaseNum', 'timeRemaining']
    );

export const getPhaseAndEndDate = (
    biddingEndDate: number,
    maturityDate: number,
    expiryDate: number
): { phase: Phase; timeRemaining: number } => {
    const now = Date.now();

    if (biddingEndDate > now) {
        return {
            phase: 'bidding',
            timeRemaining: biddingEndDate,
        };
    }

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

export const isMarketWidgetVisible = (
    marketWidget: MarketWidgetKey,
    marketWidgetVisibilityMap: Record<MarketWidgetKey, boolean>,
    marketPhase: string,
    isWalletConected: boolean,
    isCustomizationVisibility: boolean
) => {
    switch (marketWidget) {
        case MarketWidgetKey.BIDDING_PHASE:
            return marketPhase === 'bidding' && (marketWidgetVisibilityMap[marketWidget] || isCustomizationVisibility);
        case MarketWidgetKey.ORDERBOOK:
        case MarketWidgetKey.TRADE:
        case MarketWidgetKey.TRADING_PHASE:
            return marketPhase === 'trading' && (marketWidgetVisibilityMap[marketWidget] || isCustomizationVisibility);
        case MarketWidgetKey.MATURITY_PHASE:
            return marketPhase === 'maturity' && (marketWidgetVisibilityMap[marketWidget] || isCustomizationVisibility);
        case MarketWidgetKey.YOUR_TRANSACTIONS:
            return isWalletConected && (marketWidgetVisibilityMap[marketWidget] || isCustomizationVisibility);
        default:
            return marketWidgetVisibilityMap[marketWidget] || isCustomizationVisibility;
    }
};
