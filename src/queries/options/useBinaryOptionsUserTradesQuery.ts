import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import {
    OptionsTransactions,
    OptionsTransaction,
    Trades,
    Trade,
    RangedMarketPositionType,
    MarketType,
} from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { OptionSide, OrderSide } from 'types/options';
import { MARKET_TYPE } from 'constants/options';

const mapToOptionTransactions = (
    trades: Trades,
    optionSide: OptionSide | RangedMarketPositionType,
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
    firstPositionAddress: string,
    secondPositionAddress: string,
    networkId: number,
    walletAddress: string,
    marketType: MarketType,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    const collateral = snxJSConnector.collateral;

    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.UserTrades(marketAddress, walletAddress),
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
                    filterTrades(firstPositionBuys, walletAddress),
                    marketType == MARKET_TYPE[0] ? 'long' : 'in',
                    'buy',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(firstPositionSells, walletAddress),
                    marketType == MARKET_TYPE[0] ? 'long' : 'in',
                    'sell',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(secondPositionBuys, walletAddress),
                    marketType == MARKET_TYPE[0] ? 'short' : 'out',
                    'buy',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(secondPositionSells, walletAddress),
                    marketType == MARKET_TYPE[0] ? 'short' : 'out',
                    'sell',
                    marketAddress,
                    walletAddress
                ),
            ];
            return trades;
        },
        {
            ...options,
        }
    );
};

export default useBinaryOptionsUserTradesQuery;
