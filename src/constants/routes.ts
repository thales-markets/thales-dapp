export const ROUTES = {
    Home: '/',
    Options: {
        Home: '/markets',
        HotMarkets: '/markets?anchor=hot-markets',
        CustomMarkets: '/markets?userFilter2=custom',
        Overview: '/markets?anchor=overview',
        CreateMarket: '/markets/create-market',
        MarketMatch: '/markets/:marketAddress',
        Leaderboard: '/markets/leaderboard',
        QuickTrading: '/markets/quick-trading',
        Token: '/token',
    },
};
export default ROUTES;
