import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import {
    OptionsTransactions,
    OptionsTransaction,
    Trades,
    Trade,
    MarketType,
    RangedMarketPositionType,
} from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { OptionSide, OrderSide } from 'types/options';
import { MARKET_TYPE } from 'constants/options';

const mapToOptionTransactions = (
    trades: Trades,
    optionSide: OptionSide | RangedMarketPositionType,
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
                blockNumber: trade.blockNumber,
            };
        }
    );

const useBinaryOptionsTradesQuery = (
    marketAddress: string,
    firstPositionAddress: string,
    secondPositionAddress: string,
    networkId: number,
    marketType: MarketType,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    const collateral = snxJSConnector.collateral;

    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.Trades(marketAddress),
        async () => {
            const [firstPositionBuys, firstPositionSells, secondPositionBuys, secondPositionSells] = await Promise.all([
                thalesData.binaryOptions.trades({
                    makerToken: collateral?.address,
                    takerToken: firstPositionAddress,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    makerToken: firstPositionAddress,
                    takerToken: collateral?.address,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    makerToken: collateral?.address,
                    takerToken: secondPositionAddress,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    makerToken: secondPositionAddress,
                    takerToken: collateral?.address,
                    network: networkId,
                }),
            ]);

            const trades = [
                ...mapToOptionTransactions(
                    firstPositionBuys,
                    marketType == MARKET_TYPE[0] ? 'long' : 'in',
                    'buy',
                    marketAddress
                ),
                ...mapToOptionTransactions(
                    firstPositionSells,
                    marketType == MARKET_TYPE[0] ? 'long' : 'in',
                    'sell',
                    marketAddress
                ),
                ...mapToOptionTransactions(
                    secondPositionBuys,
                    marketType == MARKET_TYPE[0] ? 'short' : 'out',
                    'buy',
                    marketAddress
                ),
                ...mapToOptionTransactions(
                    secondPositionSells,
                    marketType == MARKET_TYPE[0] ? 'short' : 'out',
                    'sell',
                    marketAddress
                ),
            ];
            return trades;
        },
        {
            ...options,
        }
    );
};

export default useBinaryOptionsTradesQuery;
