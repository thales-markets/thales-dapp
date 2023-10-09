import { Page } from 'types/ui';

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
        SpeedMarkets: '/speed-markets',
        SpeedMarketsOverview: '/speed-markets/overview',
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
        StakingLeaderboard: '/token/leaderboard',
        Royal: '/royale',
        Game: '/tale-of-thales',
        TokenMigration: '/token?tab=migration&action=migrate',
        Profile: '/profile',
        Referral: '/referral',
        Wizard: '/wizard',
        OPRewards: '/op-rewards',
        Vaults: '/vaults',
        Vault: '/vaults/:vaultId',
        LiquidityPool: '/liquidity-pool',
    },
    Governance: {
        Home: '/governance',
        Space: '/governance/:space',
        Proposal: '/governance/:space/:id',
    },
};

export const PAGE_NAME_TO_META_DATA_KEYS: { [page in Page]: { title: string; description: string } } = {
    Home: {
        title: 'seo.home.title',
        description: 'seo.home.description',
    },
    Markets: {
        title: 'seo.markets.title',
        description: 'seo.markets.description',
    },
    SpeedMarkets: {
        title: 'seo.speed-markets.title',
        description: 'seo.speed-markets.description',
    },
    Vaults: {
        title: 'seo.vaults.title',
        description: 'seo.vaults.description',
    },
    Wizard: {
        title: 'seo.wizard.title',
        description: 'seo.wizard.description',
    },
    Referral: {
        title: 'seo.referral.title',
        description: 'seo.referral.description',
    },
    Governance: {
        title: 'seo.governance.title',
        description: 'seo.governance.description',
    },
    TaleOfThales: {
        title: 'seo.taleofthales.title',
        description: 'seo.taleofthales.description',
    },
    Profile: {
        title: 'seo.profile.title',
        description: 'seo.profile.description',
    },
    Token: {
        title: 'seo.token.title',
        description: 'seo.token.description',
    },
    LiquidityPool: {
        title: 'seo.liquidity-pool.title',
        description: 'seo.liquidity-pool.description',
    },
};

export default ROUTES;
