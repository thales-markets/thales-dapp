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
    marketAddress: string
): OptionsTransactions =>
    trades.map(
        (trade: Trade): OptionsTransaction => {
            return {
                timestamp: trade.timestamp,
                hash: trade.transactionHash,
                type: orderSide === 'sell' ? 'buy' : 'sell',
                market: marketAddress,
                side: optionSide,
                amount: orderSide === 'buy' ? trade.takerAmount : trade.makerAmount,
                price:
                    orderSide === 'buy' ? trade.makerAmount / trade.takerAmount : trade.takerAmount / trade.makerAmount,
            };
        }
    );

const useBinaryOptionsTradesQuery = (
    marketAddress: string,
    longAddress: string,
    shortAddress: string,
    networkId: number,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;

    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.Trades(marketAddress),
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
                ...mapToOptionTransactions(longBuys, 'long', 'buy', marketAddress),
                ...mapToOptionTransactions(longSells, 'long', 'sell', marketAddress),
                ...mapToOptionTransactions(shortBuys, 'short', 'buy', marketAddress),
                ...mapToOptionTransactions(shortSells, 'short', 'sell', marketAddress),
            ];
            return trades;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useBinaryOptionsTradesQuery;
