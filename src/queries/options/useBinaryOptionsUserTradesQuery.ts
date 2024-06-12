import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { useQuery, UseQueryOptions } from 'react-query';
import {
    OptionSide,
    OptionsTransaction,
    OptionsTransactions,
    OrderSide,
    RangedMarketPositionType,
    Trade,
    Trades,
} from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';

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
    isRangedMarket: boolean,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    const collateral = snxJSConnector.collateral;

    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.UserMarketTrades(marketAddress, walletAddress),
        async () => {
            const [
                firstPositionBuysResponse,
                firstPositionSellsResponse,
                secondPositionBuysResponse,
                secondPositionSellsResponse,
            ] = await Promise.all([
                axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.Trades}/${networkId}?maker-token=${collateral?.address}&taker-token=${firstPositionAddress}`
                ),
                axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.Trades}/${networkId}?maker-token=${firstPositionAddress}&taker-token=${collateral?.address}`
                ),
                axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.Trades}/${networkId}?maker-token=${collateral?.address}&taker-token=${secondPositionAddress}`
                ),
                axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.Trades}/${networkId}?maker-token=${secondPositionAddress}&taker-token=${collateral?.address}`
                ),
            ]);

            const firstPositionBuys = firstPositionBuysResponse?.data ? firstPositionBuysResponse.data : [];
            const firstPositionSells = firstPositionSellsResponse?.data ? firstPositionSellsResponse.data : [];
            const secondPositionBuys = secondPositionBuysResponse?.data ? secondPositionBuysResponse.data : [];
            const secondPositionSells = secondPositionSellsResponse?.data ? secondPositionSellsResponse.data : [];

            const trades = [
                ...mapToOptionTransactions(
                    filterTrades(firstPositionBuys, walletAddress),
                    isRangedMarket ? 'in' : 'long',
                    'buy',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(firstPositionSells, walletAddress),
                    isRangedMarket ? 'in' : 'long',
                    'sell',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(secondPositionBuys, walletAddress),
                    isRangedMarket ? 'out' : 'short',
                    'buy',
                    marketAddress,
                    walletAddress
                ),
                ...mapToOptionTransactions(
                    filterTrades(secondPositionSells, walletAddress),
                    isRangedMarket ? 'out' : 'short',
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
