export const ROUTES = {
    Home: '/',
    Options: {
        Home: '/markets',
        HotMarkets: '/markets#hot-markets',
        Olympics: '/markets#olympics',
        Overview: '/markets#overview',
        CreateMarket: '/markets/create-market',
        MarketMatch: '/markets/:marketAddress',
        Leaderboard: '/markets/leaderboard',
    },
};
export default ROUTES;
