import { Layout } from 'react-grid-layout';

export enum MarketWidgetKey {
    BIDDING_PHASE = 'bidding-phase-widget',
    TRADING_PHASE = 'trading-phase-widget',
    MATURITY_PHASE = 'maturity-phase-widget',
    ORDERBOOK = 'orderbook-widget',
    TRADE = 'trade-widget',
    CHART = 'chart-widget',
    RECENT_TRANSACTIONS = 'recent-transactions-widget',
    YOUR_TRANSACTIONS = 'your-transactions-widget',
}

export const MarketWidgetDefaultLayoutMap: Record<MarketWidgetKey, Layout> = {
    [MarketWidgetKey.BIDDING_PHASE]: { i: MarketWidgetKey.BIDDING_PHASE, x: 0, y: 0, w: 12, h: 18 },
    [MarketWidgetKey.TRADING_PHASE]: { i: MarketWidgetKey.TRADING_PHASE, x: 8, y: 0, w: 4, h: 12 },
    [MarketWidgetKey.MATURITY_PHASE]: { i: MarketWidgetKey.MATURITY_PHASE, x: 8, y: 0, w: 4, h: 13 },
    [MarketWidgetKey.ORDERBOOK]: { i: MarketWidgetKey.ORDERBOOK, x: 0, y: 1, w: 6, h: 17 },
    [MarketWidgetKey.TRADE]: { i: MarketWidgetKey.TRADE, x: 6, y: 1, w: 6, h: 17 },
    [MarketWidgetKey.CHART]: { i: MarketWidgetKey.CHART, x: 0, y: 2, w: 12, h: 11 },
    [MarketWidgetKey.RECENT_TRANSACTIONS]: { i: MarketWidgetKey.RECENT_TRANSACTIONS, x: 0, y: 3, w: 12, h: 10 },
    [MarketWidgetKey.YOUR_TRANSACTIONS]: { i: MarketWidgetKey.YOUR_TRANSACTIONS, x: 0, y: 4, w: 12, h: 10 },
};
