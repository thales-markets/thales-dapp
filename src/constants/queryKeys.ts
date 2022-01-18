import { NetworkId } from 'utils/network';
import { SpaceKey } from './governance';

export const QUERY_KEYS = {
    WalletBalances: {
        RetroAirdrop: (walletAddress: string, networkId: NetworkId) => [
            'walletBalances',
            'retroAirdrop',
            walletAddress,
            networkId,
        ],
        OngoingAirdrop: (walletAddress: string, networkId: NetworkId) => [
            'walletBalances',
            'ongoingAirdrop',
            walletAddress,
            networkId,
        ],
        Synths: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'synths', walletAddress, networkId],
        ETH: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'ETH', walletAddress, networkId],
        Tokens: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'tokens', walletAddress, networkId],
        Thales: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'thales', walletAddress, networkId],
        Vesting: (walletAddress: string, networkId: NetworkId) => [
            'walletBalances',
            'vesting',
            walletAddress,
            networkId,
        ],
    },
    Rates: {
        ExchangeRates: (networkId: NetworkId) => ['rates', 'exchangeRates', networkId],
        ExchangeRatesMarketData: (networkId: NetworkId) => ['rates', 'exchangeRatesMarketData', networkId],
    },
    Synths: {
        FrozenSynths: ['synths', 'frozenSynths'],
    },
    Network: {
        EthGasPrice: ['network', 'ethGasPrice'],
        EthGasPriceEip1559: (networkId: NetworkId) => ['network', 'ethGasPriceEip1559', networkId],
    },
    BinaryOptions: {
        Markets: (networkId: NetworkId) => ['binaryOptions', 'markets', networkId],
        SynthsMap: (networkId: NetworkId) => ['binaryOptions', 'synthsMap', networkId],
        Market: (marketAddress: string) => ['binaryOptions', 'markets', marketAddress],
        MarketFlippening: () => ['binaryOptions', 'marketFlippening'],
        ETHBTCMarketCapRatioHistory: () => ['binaryOptions', 'ETHBTCMarketCapRatioHistory'],
        EthBurnedCount: () => ['binaryOptions', 'ethBurnedCount'],
        AccountMarketInfo: (marketAddress: string, accountAddress: string) => [
            'binaryOptions',
            'markets',
            marketAddress,
            accountAddress,
        ],
        RecentTransactions: (marketAddress: string) => ['binaryOptions', 'transactions', marketAddress],
        UserTransactions: (marketAddress: string, walletAddress: string) => [
            'binaryOptions',
            'transactions',
            marketAddress,
            walletAddress,
        ],
        UserMarkets: (walletAddress: string, networkId: NetworkId) => [
            'binaryOptions',
            'userMarkets',
            walletAddress,
            networkId,
        ],
        OptionPrices: (marketAddress: string) => ['binaryOptions', marketAddress],
        MarketOrderBook: (optionsTokenAddress: string) => ['binaryOptions', 'marketOrderBook', optionsTokenAddress],
        AllTrades: (networkId: NetworkId) => ['binaryOptions', 'allTrades', networkId],
        Trades: (marketAddress: string) => ['binaryOptions', 'trades', marketAddress],
        UserTrades: (marketAddress: string, walletAddress: string) => [
            'binaryOptions',
            'trades',
            marketAddress,
            walletAddress,
        ],
        Leaderboard: (networkId: NetworkId) => ['binaryOptions', 'leaderboard', networkId],
        Profiles: (networkId: NetworkId) => ['binaryOptions', 'profiles', networkId],
        Competition: (networkId: NetworkId) => ['binaryOptions', 'competition', networkId],
        Orders: (orderType: string, networkId: NetworkId) => ['binaryOptions', 'orders', orderType, networkId],
        OrdersCount: (networkId: NetworkId) => ['binaryOptions', 'ordersCount', networkId],
        AmmMaxLimits: (marketAddress: string) => ['binaryOptions', 'amm', marketAddress],
    },
    User: {
        Watchlist: (walletAddress: string, networkId: NetworkId) => ['user', 'watchlist', walletAddress, networkId],
        Orders: (walletAddress: string, networkId: NetworkId) => ['user', 'orders', walletAddress, networkId],
        Assets: (walletAddress: string, networkId: NetworkId) => ['user', 'assets', walletAddress, networkId],
        DisplayName: (walletAddress: string) => ['user', 'displayName', walletAddress],
        DisplayNames: () => ['user', 'displayNames'],
        TwitterAccount: (walletAddress: string) => ['user', 'twitterAccount', walletAddress],
        TwitterAccounts: () => ['user', 'twitterAccounts'],
        VerifiedTwitterAccounts: () => ['user', 'verifiedTwitterAccounts'],
    },
    Staking: {
        Thales: (walletAddress: string, networkId: NetworkId) => ['staking', 'thales', walletAddress, networkId],
        Escrow: (walletAddress: string, networkId: NetworkId) => ['staking', 'escrow', walletAddress, networkId],
    },
    Token: {
        Transactions: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'transactions',
            walletAddress,
            networkId,
        ],
        VestingSchedule: (walletAddress: string, networkId: NetworkId) => [
            'token',
            'vesting',
            'schedule',
            walletAddress,
            networkId,
        ],
        Info: (networkId: NetworkId) => ['token', 'info', networkId],
    },
    Swap: {
        Tokens: (networkId: NetworkId) => ['swap', 'tokens', networkId],
        Quote: (networkId: NetworkId) => ['swap', 'quote', networkId],
        Approve: (networkId: NetworkId) => ['swap', 'approve', networkId],
        Swap: (networkId: NetworkId) => ['swap', 'swap', networkId],
    },
    Royale: {
        Data: (walletAddress: string) => ['royale', 'data', walletAddress],
        Players: () => ['royale', 'layers'],
        Rounds: (networkId: NetworkId) => ['royale', 'rounds', networkId],
        Seasons: (networkId: NetworkId) => ['royale', 'Seasons', networkId],
        Positions: (networkId: NetworkId) => ['royale', 'positions', networkId],
        EthBalance: (walletAddress: string) => ['royale', 'ethBalance', walletAddress],
        EthPrice: () => ['royale', 'ethPrice'],
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
        CouncilMembers: () => ['governance', 'councilMembers'],
        ThalesStakers: () => ['governance', 'thalesStakers'],
        VotingPower: (proposalId: string, snapshot: string, walletAddress: string) => [
            'governance',
            'votingPower',
            proposalId,
            snapshot,
            walletAddress,
        ],
    },
};

export default QUERY_KEYS;
