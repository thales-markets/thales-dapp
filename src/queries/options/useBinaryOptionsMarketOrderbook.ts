import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { OrderbookInfo, OrderItem } from 'types/options';
import { NetworkId } from 'utils/network';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';
import { ORDERBOOK_AMOUNT_THRESHOLD } from 'constants/options';
import { getAllBuyOrdersForToken, getAllSellOrdersForToken } from 'utils/1inch';
import { orderBy } from 'lodash';

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
                orderbook.sellOrders = orderBy(
                    sellOrders
                        .map(
                            (record: any): OrderItem => {
                                return prepSellOrder(record);
                            }
                        )
                        .filter(
                            (order: OrderItem) =>
                                order.displayOrder.fillableAmount >= ORDERBOOK_AMOUNT_THRESHOLD &&
                                order.displayOrder.timeRemaining >= Date.now()
                        ),
                    'displayOrder.price',
                    'asc'
                );
            }
            if (buyOrders.length > 0) {
                orderbook.buyOrders = orderBy(
                    buyOrders
                        .map(
                            (record: any): OrderItem => {
                                return prepBuyOrder(record);
                            }
                        )
                        .filter(
                            (order: OrderItem) =>
                                order.displayOrder.fillableAmount >= ORDERBOOK_AMOUNT_THRESHOLD &&
                                order.displayOrder.timeRemaining >= Date.now()
                        ),
                    'displayOrder.price',
                    'desc'
                );
            }

            return orderbook;
        },
        {
            ...options,
            refetchInterval: 5000,
            // enable only for Optimism Mainnet
            enabled: options?.enabled && networkId === 10,
        }
    );
};

export default useBinaryOptionsMarketOrderbook;
