import { NetworkId } from 'utils/network';
import { CurrencyKey } from './currency';
import { Period } from './period';

export const QUERY_KEYS = {
    WalletBalances: {
        Synths: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'synths', walletAddress, networkId],
        ETH: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'ETH', walletAddress, networkId],
        Tokens: (walletAddress: string, networkId: NetworkId) => ['walletBalances', 'tokens', walletAddress, networkId],
    },
    Rates: {
        HistoricalRates: (currencyKey: CurrencyKey, period: Period) => [
            'rates',
            'historicalRates',
            currencyKey,
            period,
        ],
        ExchangeRates: ['rates', 'exchangeRates'],
    },
    Synths: {
        FrozenSynths: ['synths', 'frozenSynths'],
    },
    Network: {
        EthGasPrice: ['network', 'ethGasPrice'],
    },
    BinaryOptions: {
        Markets: ['binaryOptions', 'markets'],
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
        UserMarkets: (walletAddress: string) => ['binaryOptions', 'userMarkets', walletAddress],
        OptionPrices: (marketAddress: string, period: Period) => ['binaryOptions', marketAddress, period],
        MarketOrderBook: (optionsTokenAddress: string) => ['binaryOptions', 'marketOrderBook', optionsTokenAddress],
    },
};

export default QUERY_KEYS;
