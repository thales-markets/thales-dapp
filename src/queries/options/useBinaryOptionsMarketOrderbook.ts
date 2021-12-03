import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { OrderbookInfo, OrderItem } from 'types/options';
import { NetworkId } from 'utils/network';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';
import { ORDERBOOK_AMOUNT_THRESHOLD } from 'constants/options';
import { getAllBuyOrdersForToken, getAllSellOrdersForToken } from 'utils/1inch';

const useBinaryOptionsMarketOrderbook = (
    networkId: NetworkId,
    optionsTokenAddress: string,
    options?: UseQueryOptions<OrderbookInfo>
) => {
    const orderbook: OrderbookInfo = {
        buyOrders: [],
        sellOrders: [],
    };

    return useQuery<OrderbookInfo>(
        QUERY_KEYS.BinaryOptions.MarketOrderBook(optionsTokenAddress),
        async () => {
            const buyOrders = await getAllBuyOrdersForToken(networkId, optionsTokenAddress);
            const sellOrders = await getAllSellOrdersForToken(networkId, optionsTokenAddress);

            if (sellOrders.length > 0) {
                orderbook.sellOrders = sellOrders
                    .map(
                        (record: any): OrderItem => {
                            return prepSellOrder(record);
                        }
                    )
                    .filter((order: OrderItem) => order.displayOrder.fillableAmount >= ORDERBOOK_AMOUNT_THRESHOLD);
            }
            if (buyOrders.length > 0) {
                orderbook.buyOrders = buyOrders
                    .map(
                        (record: any): OrderItem => {
                            return prepBuyOrder(record);
                        }
                    )
                    .filter((order: OrderItem) => order.displayOrder.fillableAmount >= ORDERBOOK_AMOUNT_THRESHOLD);
            }

            return orderbook;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useBinaryOptionsMarketOrderbook;
