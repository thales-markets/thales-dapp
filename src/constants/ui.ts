import { Layout } from 'react-grid-layout';

export enum MarketWidgetKey {
    MATURITY_PHASE = 'maturity-phase-widget',
    ORDERBOOK = 'orderbook-widget',
    TRADE = 'trade-widget',
    CHART_TRADING_VIEW = 'chart-trading-view-widget',
    CHART_OPTIONS_PRICE = 'chart-options-price-widget',
    RECENT_TRANSACTIONS = 'recent-transactions-widget',
    YOUR_TRANSACTIONS = 'your-transactions-widget',
}

export const MarketWidgetDefaultLayoutMap: Record<MarketWidgetKey, Layout> = {
    [MarketWidgetKey.MATURITY_PHASE]: { i: MarketWidgetKey.MATURITY_PHASE, x: 8, y: 0, w: 4, h: 13 },
    [MarketWidgetKey.ORDERBOOK]: { i: MarketWidgetKey.ORDERBOOK, x: 0, y: 1, w: 6, h: 17 },
    [MarketWidgetKey.TRADE]: { i: MarketWidgetKey.TRADE, x: 6, y: 1, w: 6, h: 17 },
    [MarketWidgetKey.CHART_TRADING_VIEW]: { i: MarketWidgetKey.CHART_TRADING_VIEW, x: 0, y: 2, w: 6, h: 11 },
    [MarketWidgetKey.CHART_OPTIONS_PRICE]: { i: MarketWidgetKey.CHART_OPTIONS_PRICE, x: 6, y: 2, w: 6, h: 11 },
    [MarketWidgetKey.RECENT_TRANSACTIONS]: { i: MarketWidgetKey.RECENT_TRANSACTIONS, x: 0, y: 3, w: 12, h: 10 },
    [MarketWidgetKey.YOUR_TRANSACTIONS]: { i: MarketWidgetKey.YOUR_TRANSACTIONS, x: 0, y: 4, w: 12, h: 10 },
};

export enum COLORS {
    LONG = '#04C19D',
    SHORT = '#FF553E',
    BUY = '#04C19D',
    SELL = '#FF553E',
    WHITE = '#F6F6FE',
}
