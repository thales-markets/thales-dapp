import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { OrderbookInfo, OrderItem } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { get0xBaseURL } from 'utils/0x';
import { NetworkId } from 'utils/network';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';

const useBinaryOptionsMarketOrderbook = (
    networkId: NetworkId,
    optionsTokenAddress: string,
    options?: UseQueryOptions<OrderbookInfo>
) => {
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const baseUrl = `${get0xBaseURL(networkId)}sra/v4/`;

    const orderbook: OrderbookInfo = {
        buyOrders: [],
        sellOrders: [],
    };

    return useQuery<OrderbookInfo>(
        QUERY_KEYS.BinaryOptions.MarketOrderBook(optionsTokenAddress),
        async () => {
            const orderbookUrl = `${baseUrl}orderbook?baseToken=${optionsTokenAddress}&quoteToken=${SynthsUSD.address}&perPage=1000`;
            const response = await fetch(orderbookUrl);

            const responseJ = await response.json();
            if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                orderbook.sellOrders = responseJ.asks.records.map(
                    (record: any): OrderItem => {
                        return prepSellOrder(record);
                    }
                );
            }
            if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                orderbook.buyOrders = responseJ.bids.records.map(
                    (record: any): OrderItem => {
                        return prepBuyOrder(record);
                    }
                );
            }

            return orderbook;
        },
        options
    );
};

export default useBinaryOptionsMarketOrderbook;
