import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { BigNumber } from 'ethers';

const QUERY_KEYS = {
    WalletBalances: {
        StableCoinBalance: (walletAddress: string, networkId: Network, isDeprecatedCurrency: boolean) => [
            'walletBalances',
            'stableCoin',
            walletAddress,
            networkId,
            isDeprecatedCurrency,
        ],
        Eth: (walletAddress: string) => ['walletBalances', 'eth', walletAddress],
        Thales: (walletAddress: string, networkId: Network) => ['walletBalances', 'thales', walletAddress, networkId],
        OpThales: (walletAddress: string, networkId: Network) => [
            'walletBalances',
            'opThales',
            walletAddress,
            networkId,
        ],
        MultipleCollateral: (walletAddress: string, networkId: Network) => [
            'multipleCollateral',
            'balance',
            walletAddress,
            networkId,
        ],
    },
    Rates: {
        ExchangeRates: (networkId: Network) => ['rates', 'exchangeRates', networkId],
        ExchangeRatesMarketData: (networkId: Network) => ['rates', 'exchangeRatesMarketData', networkId],
    },
    Prices: {
        PythPrices: (priceId: string, publishTime: number) => ['prices', 'pythPrices', priceId, publishTime],
        PythCandlestickData: (asset: string, dateRange: number, resolution: string) => [
            'asset',
            'dateRange',
            'resolution',
            asset,
            dateRange,
            resolution,
        ],
    },
    Medium: {
        Posts: ['medium', 'posts'],
    },
    BinaryOptions: {
        Markets: (networkId: Network) => ['markets', networkId],
        RangedMarkets: (networkId: Network, marketIds?: string[]) => ['rangedMarkets', networkId, marketIds],
        SynthsMap: (networkId: Network) => ['synthsMap', networkId],
        Market: (marketAddress: string, isDeprecatedCurrency: boolean) => [
            'market',
            marketAddress,
            isDeprecatedCurrency,
        ],
        RangedMarket: (marketAddress: string, isDeprecatedCurrency: boolean) => [
            'rangedMarket',
            marketAddress,
            isDeprecatedCurrency,
        ],
        UserMarketPositions: (marketAddress: string, accountAddress: string) => [
            'market',
            'positions',
            marketAddress,
            accountAddress,
        ],
        UserRangedMarketPositions: (walletAddress: string, marketAddress: string, networkId: Network) => [
            'rangedMarket',
            'positions',
            walletAddress,
            marketAddress,
            networkId,
        ],
        MarketTransactions: (marketAddress: string) => ['market', 'transactions', marketAddress],
        UserMarketTransactions: (marketAddress: string, walletAddress: string) => [
            'market',
            'transactions',
            marketAddress,
            walletAddress,
        ],
        MarketTrades: (marketAddress: string, isDeprecatedCurrency: boolean) => [
            'market',
            'trades',
            marketAddress,
            isDeprecatedCurrency,
        ],
        UserMarketTrades: (marketAddress: string, walletAddress: string) => [
            'market',
            'trades',
            marketAddress,
            walletAddress,
        ],
        AmmMaxLimits: (marketAddress: string, isDeprecatedCurrency: boolean) => [
            'amm',
            marketAddress,
            isDeprecatedCurrency,
        ],
        RangedAmmMaxLimits: (marketAddress: string, isDeprecatedCurrency: boolean) => [
            'rangedAmm',
            marketAddress,
            isDeprecatedCurrency,
        ],
        AvailableAssets: (networkId: Network, isDeprecatedCurrency: boolean) => [
            'availableAssets',
            networkId,
            isDeprecatedCurrency,
        ],
        MaturityDatesByAsset: (asset: string, networkId: Network, isDeprecatedCurrency: boolean) => [
            'maturityDatesByAsset',
            asset,
            networkId,
            isDeprecatedCurrency,
        ],
        MarketsByAssetAndDate: (
            asset: string,
            date: number,
            position: Positions,
            networkId: Network,
            isDeprecatedCurrency: boolean
        ) => ['marketsByAssetAndDate', asset, date, position, networkId, isDeprecatedCurrency],
        MarketsCount: (networkId: Network, isDeprecatedCurrency: boolean) => [
            'markets-count',
            networkId,
            isDeprecatedCurrency,
        ],
    },
    User: {
        OpenPositions: (walletAddress: string, networkId: Network) => [
            'user',
            'userOpenPositions',
            walletAddress,
            networkId,
        ],
        Notifications: (walletAddress: string, networkId: Network) => [
            'user',
            'notifications',
            walletAddress,
            networkId,
        ],
        VaultsAndLpTransactions: (networkId: Network, walletAddress: string) => [
            'user',
            'vaultsAndLpTransactions',
            networkId,
            walletAddress,
        ],
        UsersAmmBuyVolume: (networkId: Network, period: number) => ['user', 'ammBuyVolume', networkId, period],
    },
    Profile: {
        Data: (walletAddress: string, networkId: Network) => ['profile', 'data', walletAddress, networkId],
        OpenPositions: (walletAddress: string, networkId: Network) => [
            'profile',
            'openPositions',
            walletAddress,
            networkId,
        ],
        ClaimablePositions: (walletAddress: string, networkId: Network) => [
            'profile',
            'claimablePositions',
            walletAddress,
            networkId,
        ],
        ClosedPositions: (walletAddress: string, networkId: Network) => [
            'profile',
            'closedPositions',
            walletAddress,
            networkId,
        ],
        Trades: (walletAddress: string, networkId: Network) => ['profile', 'trades', walletAddress, networkId],
    },
    Token: {
        UserStakingData: (walletAddress: string, networkId: Network) => [
            'token',
            'staking',
            'data',
            walletAddress,
            networkId,
        ],
    },
    TaleOfThales: {
        NFTCollections: (walletAddress: string, networkId: Network) => [
            'taleOfThales',
            'NFTCollections',
            walletAddress,
            networkId,
        ],
        NFTBalances: (walletAddress: string, networkId: Network) => [
            'taleOfThales',
            'NFTBalances',
            walletAddress,
            networkId,
        ],
    },
    Swap: {
        Tokens: (networkId: Network) => ['swap', 'tokens', networkId],
        Quote: (networkId: Network, amount: BigNumber) => ['swap', 'quote', networkId, amount],
        Approve: (networkId: Network) => ['swap', 'approve', networkId],
        Swap: (networkId: Network) => ['swap', 'swap', networkId],
    },
    Bungee: {
        Tokens: () => ['bungee', 'tokens'],
    },
    Vault: {
        Data: (vaultAddress: string, networkId: Network) => [vaultAddress, 'data', networkId],
        UserData: (vaultAddress: string, walletAddress: string, networkId: Network) => [
            vaultAddress,
            'data',
            walletAddress,
            networkId,
        ],
        Trades: (vaultAddress: string, networkId: Network, round: number) => [vaultAddress, 'trades', networkId, round],
        PnL: (vaultAddress: string, networkId: Network) => [vaultAddress, 'pnl', networkId],
        UserTransactions: (vaultAddress: string, networkId: Network) => [vaultAddress, 'userTransactions', networkId],
    },
    Banners: (networkId: Network) => ['banners', networkId],
    LiquidityPool: {
        Data: (address: string, networkId: Network) => ['liquidityPool', 'data', address, networkId],
        UserData: (address: string, walletAddress: string, networkId: Network) => [
            'liquidityPool',
            'data',
            address,
            walletAddress,
            networkId,
        ],
        PnL: (networkId: Network, liquidityPoolAddress: string) => [
            'liquidityPool',
            'pnl',
            liquidityPoolAddress,
            networkId,
        ],
        UserTransactions: (
            networkId: Network,
            liquidityPoolAddress: string,
            walletAddress?: string,
            round?: number
        ) => [
            'liquidityPool',
            'userTransactions',
            liquidityPoolAddress,
            round ? round : walletAddress ? walletAddress : '',
            networkId,
        ],
    },
};

export default QUERY_KEYS;
