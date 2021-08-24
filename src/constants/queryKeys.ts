import { NetworkId } from 'utils/network';
import { CurrencyKey } from './currency';

export const QUERY_KEYS = {
    WalletBalances: {
        Airdrop: (walletAddress: string, networkId: NetworkId) => [
            'walletBalances',
            'airdrop',
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
        Vesting: (walletAddress: string, networkId: NetworkId) => [
            'walletBalances',
            'vesting',
            walletAddress,
            networkId,
        ],
    },
    Rates: {
        HistoricalRates: (currencyKey: CurrencyKey) => ['rates', 'historicalRates', currencyKey],
        ExchangeRates: ['rates', 'exchangeRates'],
    },
    Synths: {
        FrozenSynths: ['synths', 'frozenSynths'],
    },
    Network: {
        EthGasPrice: ['network', 'ethGasPrice'],
    },
    BinaryOptions: {
        Markets: (networkId: NetworkId) => ['binaryOptions', 'markets', networkId],
        Market: (marketAddress: string) => ['binaryOptions', 'markets', marketAddress],
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
        Trades: (marketAddress: string) => ['binaryOptions', 'trades', marketAddress],
        UserTrades: (marketAddress: string, walletAddress: string) => [
            'binaryOptions',
            'trades',
            marketAddress,
            walletAddress,
        ],
        Leaderboard: (networkId: NetworkId) => ['binaryOptions', 'leaderboard', networkId],
        Orders: (orderType: string, networkId: NetworkId) => ['binaryOptions', 'orders', orderType, networkId],
    },
    User: {
        Watchlist: (walletAddress: string, networkId: NetworkId) => ['user', 'watchlist', walletAddress, networkId],
        Orders: (walletAddress: string, networkId: NetworkId) => ['user', 'orders', walletAddress, networkId],
        Assets: (walletAddress: string, networkId: NetworkId) => ['user', 'assets', walletAddress, networkId],
        DisplayName: (walletAddress: string) => ['user', 'displayName', walletAddress],
        DisplayNames: () => ['user', 'displayNames'],
    },
};

export default QUERY_KEYS;
