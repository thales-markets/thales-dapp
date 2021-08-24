export const ROUTES = {
    Home: '/',
    Options: {
        Home: '/markets',
        HotMarkets: '/markets?anchor=hot-markets',
        Olympics: '/markets?userFilter2=Olympics',
        Overview: '/markets?anchor=overview',
        CreateMarket: '/markets/create-market',
        MarketMatch: '/markets/:marketAddress',
        Leaderboard: '/markets/leaderboard',
        QuickTrading: '/markets/quick-trading',
    },
};
export default ROUTES;
