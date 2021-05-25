import { NetworkId } from 'utils/network';
import { CurrencyKey } from './currency';

export const QUERY_KEYS = {
    WalletBalances: {
        Synths: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'synths', walletAddress, networkId],
        ETH: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'ETH', walletAddress, networkId],
        Tokens: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'tokens', walletAddress, networkId],
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
    },
    User: {
        Watchlist: (walletAddress: string, networkId: NetworkId) => ['user', 'watchlist', walletAddress, networkId],
        Orders: (walletAddress: string) => ['user', 'orders', walletAddress],
    },
};

export default QUERY_KEYS;
