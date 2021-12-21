import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions, OptionsTransaction, Trades, Trade } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { OptionSide, OrderSide } from 'types/options';

const mapToOptionTransactions = (
    trades: Trades,
    optionSide: OptionSide,
    orderSide: OrderSide,
    marketAddress: string,
    walletAddress: string
): OptionsTransactions =>
    trades.map(
        (trade: Trade): OptionsTransaction => {
            return {
                timestamp: trade.timestamp,
                hash: trade.transactionHash,
                type:
                    trade.taker.toLowerCase() === walletAddress.toLowerCase()
                        ? orderSide === 'sell'
                            ? 'buy'
                            : 'sell'
                        : orderSide,
                market: marketAddress,
                side: optionSide,
                amount: orderSide === 'buy' ? trade.takerAmount : trade.makerAmount,
                price:
                    orderSide === 'buy' ? trade.makerAmount / trade.takerAmount : trade.takerAmount / trade.makerAmount,
                blockNumber: trade.blockNumber,
            };
        }
    );

const filterTrades = (trades: Trades, walletAddress: string): Trades =>
    trades.filter(
        (trade: Trade) =>
            trade.maker.toLowerCase() === walletAddress.toLowerCase() ||
            trade.taker.toLowerCase() === walletAddress.toLowerCase()
    );

const useBinaryOptionsUserTradesQuery = (
    marketAddress: string,
    longAddress: string,
    shortAddress: string,
    networkId: number,
    walletAddress: string,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;

    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.UserTrades(marketAddress, walletAddress),
        async () => {
            const [longBuys, longSells, shortBuys, shortSells] = await Promise.all([
                thalesData.binaryOptions.trades({
                    makerToken: SynthsUSD.address,
                    takerToken: longAddress,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    makerToken: longAddress,
                    takerToken: SynthsUSD.address,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    makerToken: SynthsUSD.address,
                    takerToken: shortAddress,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    makerToken: shortAddress,
                    takerToken: SynthsUSD.address,
                    network: networkId,
                }),
            ]);

            const trades = [
                ...mapToOptionTransactions(
                    filterTrades(longBuys, walletAddress),
                    'long',
                    'buy',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(longSells, walletAddress),
                    'long',
                    'sell',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(shortBuys, walletAddress),
                    'short',
                    'buy',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(shortSells, walletAddress),
                    'short',
                    'sell',
                    marketAddress,
                    walletAddress
                ),
            ];
            return trades;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useBinaryOptionsUserTradesQuery;
