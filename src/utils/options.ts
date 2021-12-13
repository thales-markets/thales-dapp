import { MarketWidgetKey } from 'constants/ui';
import orderBy from 'lodash/orderBy';
import { PHASE } from '../constants/options';
import { OptionsMarkets, Phase } from '../types/options';
import { getSynthAsset } from './currency';

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
        ['phaseNum', 'timeRemaining']
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

export const isMarketWidgetVisible = (
    marketWidget: MarketWidgetKey,
    visibilityMap: Record<MarketWidgetKey, boolean>,
    marketPhase: string,
    isCustomMarket: boolean,
    isWalletConected: boolean,
    isCustomizationVisibility: boolean,
    ammSelected: boolean
) => {
    switch (marketWidget) {
        case MarketWidgetKey.AMM:
            return (
                marketPhase === 'trading' && ammSelected && (visibilityMap[marketWidget] || isCustomizationVisibility)
            );
        case MarketWidgetKey.ORDERBOOK:
        case MarketWidgetKey.TRADE:
            return (
                marketPhase === 'trading' && !ammSelected && (visibilityMap[marketWidget] || isCustomizationVisibility)
            );
        case MarketWidgetKey.MATURITY_PHASE:
            return marketPhase === 'maturity' && (visibilityMap[marketWidget] || isCustomizationVisibility);
        case MarketWidgetKey.YOUR_TRANSACTIONS:
            return isWalletConected && (visibilityMap[marketWidget] || isCustomizationVisibility);
        case MarketWidgetKey.CHART_TRADING_VIEW:
            return !isCustomMarket && (visibilityMap[marketWidget] || isCustomizationVisibility);
        case MarketWidgetKey.CUSTOM_MARKET_RESULTS:
            return isCustomMarket && (visibilityMap[marketWidget] || isCustomizationVisibility);
        default:
            return visibilityMap[marketWidget] || isCustomizationVisibility;
    }
};

export const dispatchMarketNotification = (message: string) => {
    const marketNotificationEvent = new CustomEvent('market-notification', {
        bubbles: true,
        detail: { text: message },
    });
    document.dispatchEvent(marketNotificationEvent);
};
