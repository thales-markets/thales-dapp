import { SpaceKey } from 'enums/governance';
import { Positions } from 'enums/options';
import { BigNumber } from 'ethers';
import { NetworkId } from 'utils/network';

const QUERY_KEYS = {
    WalletBalances: {
        StableCoinBalance: (walletAddress: string, networkId: NetworkId) => [
            'walletBalances',
            'stableCoin',
            walletAddress,
            networkId,
        ],
        Eth: (walletAddress: string) => ['walletBalances', 'eth', walletAddress],
        Thales: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'thales', walletAddress, networkId],
        OpThales: (walletAddress: string, networkId: NetworkId) => [
            'walletBalances',
            'opThales',
            walletAddress,
            networkId,
        ],
        MultipleCollateral: (walletAddress: string, networkId: NetworkId) => [
            'multipleCollateral',
            'balance',
            walletAddress,
            networkId,
        ],
    },
    Rates: {
        ExchangeRates: () => ['rates', 'exchangeRates'],
        ExchangeRatesMarketData: (networkId: NetworkId) => ['rates', 'exchangeRatesMarketData', networkId],
    },
    Medium: {
        Posts: ['medium', 'posts'],
    },
    PriceData: {
        Currency: (currencyKey: string) => ['pricedata', currencyKey],
    },
    BinaryOptions: {
        Markets: (networkId: NetworkId) => ['markets', networkId],
        RangedMarkets: (networkId: NetworkId, marketIds?: string[]) => ['rangedMarkets', networkId, marketIds],
        SynthsMap: (networkId: NetworkId) => ['synthsMap', networkId],
        Market: (marketAddress: string) => ['market', marketAddress],
        RangedMarket: (marketAddress: string) => ['rangedMarket', marketAddress],
        UserMarketPositions: (marketAddress: string, accountAddress: string) => [
            'market',
            'positions',
            marketAddress,
            accountAddress,
        ],
        UserRangedMarketPositions: (walletAddress: string, marketAddress: string, networkId: NetworkId) => [
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
        MarketTrades: (marketAddress: string) => ['market', 'trades', marketAddress],
        UserMarketTrades: (marketAddress: string, walletAddress: string) => [
            'market',
            'trades',
            marketAddress,
            walletAddress,
        ],
        AmmMaxLimits: (marketAddress: string) => ['amm', marketAddress],
        RangedAmmMaxLimits: (marketAddress: string) => ['rangedAmm', marketAddress],
        AvailableAssets: (networkId: NetworkId) => ['availableAssets', networkId],
        MaturityDatesByAsset: (asset: string, networkId: NetworkId) => ['maturityDatesByAsset', asset, networkId],
        MarketsByAssetAndDate: (asset: string, date: number, position: Positions, networkId: NetworkId) => [
            'marketsByAssetAndDate',
            asset,
            date,
            position,
            networkId,
        ],
    },
    User: {
        ProfileData: (walletAddress: string, networkId: NetworkId) => ['user', 'profileData', walletAddress, networkId],
        AllPositions: (walletAddress: string, networkId: NetworkId) => [
            'user',
            'allPositions',
            walletAddress,
            networkId,
        ],
        UserOpenPositions: (walletAddress: string, networkId: NetworkId) => [
            'user',
            'userOpenPositions',
            walletAddress,
            networkId,
        ],
        UserNotifications: (walletAddress: string, networkId: NetworkId) => [
            'user',
            'userNotifications',
            walletAddress,
            networkId,
        ],
        VaultsAndLpTransactions: (networkId: NetworkId, walletAddress: string) => [
            'user',
            'vaultsAndLpTransactions',
            networkId,
            walletAddress,
        ],
        UsersAmmBuyVolume: (networkId: NetworkId, period: number) => ['user', 'ammBuyVolume', networkId, period],
    },
    Token: {
        StakingData: (networkId: NetworkId) => ['token', 'staking', 'data', networkId],
        UserStakingData: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'staking',
            'data',
            walletAddress,
            networkId,
        ],
        UserVestingData: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'vesting',
            'data',
            walletAddress,
            networkId,
        ],
        ClaimOnBehalf: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'staking',
            'claimOnBehalf',
            walletAddress,
            networkId,
        ],
        Transactions: (walletAddress: string | undefined, networkId: NetworkId, type_in: string | undefined) => [
            'token',
            'transactions',
            walletAddress,
            networkId,
            type_in,
        ],
        MigratedInvestorsRetroRewards: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'migratedInvestorsRetroRewards',
            walletAddress,
            networkId,
        ],
        VestingEscrow: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'vestingEscrow',
            walletAddress,
            networkId,
        ],
        LPStaking: (walletAddress: string, networkId: NetworkId) => ['token', 'lpStaking', walletAddress, networkId],
        GelatoBalance: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'gelatoBalance',
            walletAddress,
            networkId,
        ],
        Gelato: () => ['token', 'gelato'],
        Info: (networkId: NetworkId) => ['token', 'info', networkId],
    },
    TaleOfThales: {
        NFTCollections: (walletAddress: string, networkId: NetworkId) => [
            'taleOfThales',
            'NFTCollections',
            walletAddress,
            networkId,
        ],
        NFTBalances: (walletAddress: string, networkId: NetworkId) => [
            'taleOfThales',
            'NFTBalances',
            walletAddress,
            networkId,
        ],
    },
    Swap: {
        Tokens: (networkId: NetworkId) => ['swap', 'tokens', networkId],
        Quote: (networkId: NetworkId, amount: BigNumber) => ['swap', 'quote', networkId, amount],
        Approve: (networkId: NetworkId) => ['swap', 'approve', networkId],
        Swap: (networkId: NetworkId) => ['swap', 'swap', networkId],
    },
    Referral: {
        Referrer: (networkId: NetworkId, address?: string) => [
            'referral',
            'referrer',
            networkId,
            address ? address : undefined,
        ],
        ReferredTrader: (networkId: NetworkId, referrer?: string) => [
            'referral',
            'ReferredTrader',
            networkId,
            referrer ? referrer : undefined,
        ],
        ReferralTransacations: (networkId: NetworkId, trader?: string, refferer?: string) => [
            'referral',
            'referralTransacations',
            networkId,
            trader ? trader : undefined,
            refferer ? refferer : undefined,
        ],
        ReferrerID: (walletAddress: string) => ['referrerId', walletAddress],
    },
    Governance: {
        Proposals: (spaceKey: SpaceKey) => ['governance', 'proposals', spaceKey],
        Proposal: (spaceKey: SpaceKey, hash: string, walletAddress: string) => [
            'governance',
            'proposal',
            spaceKey,
            hash,
            walletAddress,
        ],
        ThalesStakers: (filter: string) => ['governance', 'thalesStakers', filter],
        VotingPower: (proposalId: string, snapshot: string, walletAddress: string) => [
            'governance',
            'votingPower',
            proposalId,
            snapshot,
            walletAddress,
        ],
    },
    Bungee: {
        Tokens: () => ['bungee', 'tokens'],
    },
    Vault: {
        Data: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'data', networkId],
        UserData: (vaultAddress: string, walletAddress: string, networkId: NetworkId) => [
            vaultAddress,
            'data',
            walletAddress,
            networkId,
        ],
        Trades: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'trades', networkId],
        PnL: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'pnl', networkId],
        UserTransactions: (vaultAddress: string, networkId: NetworkId) => [vaultAddress, 'userTransactions', networkId],
    },
    Banners: (networkId: NetworkId) => ['banners', networkId],
    LiquidityPool: {
        Data: (networkId: NetworkId) => ['liquidityPool', 'data', networkId],
        UserData: (walletAddress: string, networkId: NetworkId) => ['liquidityPool', 'data', walletAddress, networkId],
        PnL: (networkId: NetworkId) => ['liquidityPool', 'pnl', networkId],
        UserTransactions: (networkId: NetworkId) => ['liquidityPool', 'userTransactions', networkId],
    },
};

export default QUERY_KEYS;
