export const ROUTES = {
    Home: '/',
    Article: {
        Token: '/article/token',
        Governance: '/article/governance',
        Whitepaper: '/article/whitepaper',
    },
    Options: {
        Home: '/markets',
        RangeMarkets: '/ranged-markets',
        HotMarkets: '/markets?anchor=hot-markets',
        CustomMarkets: '/markets?userFilter2=custom',
        CompetitionMarkets: '/markets?userFilter2=competition',
        Overview: '/markets?anchor=overview',
        CreateMarket: '/markets/create-market',
        MarketMatch: '/markets/:marketAddress',
        RangeMarketMatch: '/ranged-markets/:marketAddress',
        Leaderboard: '/markets/leaderboard',
        TradeHistory: '/markets/trade-history',
        Token: '/token',
        Royal: '/royale',
        Game: '/tale-of-thales',
        TokenMigration: '/token?tab=migration&action=migrate',
        Profile: '/profile',
        Referral: '/referral',
        Wizzard: '/wizard',
    },
    Governance: {
        Home: '/governance',
        Space: '/governance/:space',
        Proposal: '/governance/:space/:id',
    },
};
export default ROUTES;
