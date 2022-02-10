export const ROUTES = {
    Home: '/',
    Article: {
        Token: '/article/token',
        Governance: '/article/governance',
        Whitepaper: '/article/whitepaper',
    },
    Options: {
        Home: '/markets',
        HotMarkets: '/markets?anchor=hot-markets',
        CustomMarkets: '/markets?userFilter2=custom',
        CompetitionMarkets: '/markets?userFilter2=competition',
        Overview: '/markets?anchor=overview',
        CreateMarket: '/markets/create-market',
        MarketMatch: '/markets/:marketAddress',
        Leaderboard: '/markets/leaderboard',
        QuickTrading: '/markets/quick-trading',
        QuickTradingCompetition: '/markets/competition-orders',
        TradeHistory: '/markets/trade-history',
        AmmMining: '/markets/amm-rewards',
        AmmReporting: '/markets/amm-reporting',
        Token: '/token',
        Royal: '/royale',
        Game: '/tale-of-thales',
        TokenMigration: '/token?tab=migration&action=migrate',
    },
    Governance: {
        Home: '/governance',
        Space: '/governance/:space',
        Proposal: '/governance/:space/:id',
    },
    Test: {
        Home: '/test/markets',
        AmmTrading: '/test/amm-trading',
    },
};
export default ROUTES;
