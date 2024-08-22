const ROUTES = {
    Home: '/',
    Options: {
        Home: '/markets',
        RangeMarkets: '/ranged-markets',
        CreateMarket: '/markets/create-market',
        MarketMatch: '/markets/:marketAddress',
        RangeMarketMatch: '/ranged-markets/:marketAddress',
        Game: '/tale-of-thales',
        Profile: '/profile',
        Wizard: '/wizard',
        Vaults: '/vaults',
        Vault: '/vaults/:vaultId',
        LiquidityPool: '/liquidity-pool',
    },
};

export const API_ROUTES = {
    Staking: 'v1/staking',
    CacheControl: 'v1/cache-control',
    LP: 'v1/digital-options/liquidity-providing',
    LPPnls: 'v1/digital-options/liquidity-providing/pnl',
    LPTransactions: 'v1/digital-options/liquidity-providing/transactions',
    Trades: 'v1/digital-options/trades',
    OptionTransactions: 'v1/digital-options/trades/option-transactions',
    PositionBalance: 'v1/digital-options/trades/position-balance',
    RangedPositionBalance: 'v1/digital-options/trades/ranged-position-balance',
    MarketsList: 'v1/digital-options/markets/list',
    RangeMarketsList: 'v1/digital-options/markets/ranged',
    Referral: 'v1/digital-options/referral',
    ReferralTransactions: 'v1/digital-options/referral/transactions',
    ReferralTraders: 'v1/digital-options/referral/traders',
    Referrers: 'v1/digital-options/referral/referrers',
    VaultsUserTransactions: 'v1/digital-options/vaults/user-transactions',
    VaultsPnl: 'v1/digital-options/vaults/pnl',
    VaultsTransactions: 'v1/digital-options/vaults/transactions',
};

export default ROUTES;
