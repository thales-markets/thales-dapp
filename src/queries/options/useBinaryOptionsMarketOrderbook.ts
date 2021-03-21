import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { OrderbookInfo, OrderItem } from 'types/options';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters';
import { ONE_SECOND_MS } from 'constants/0x';
import { get0xBaseURL, isV4 } from 'utils/0x';
import { NetworkId } from 'utils/network';

const useBinaryOptionsMarketOrderbook = (
    networkId: NetworkId,
    optionsTokenAddress: string,
    options?: UseQueryOptions<OrderbookInfo>
) => {
    const {
        snxJS: { sUSD },
        contractWrappers0x,
    } = snxJSConnector as any;
    const baseUrl = get0xBaseURL(networkId);

    const orderbook: OrderbookInfo = {
        buyOrders: [],
        sellOrders: [],
    };
    return useQuery<OrderbookInfo>(
        QUERY_KEYS.BinaryOptions.MarketOrderBook(optionsTokenAddress),
        async () => {
            const makerAssetData = await contractWrappers0x.devUtils
                .encodeERC20AssetData(optionsTokenAddress)
                .callAsync();
            const takerAssetData = await contractWrappers0x.devUtils
                .encodeERC20AssetData(sUSD.contract.address)
                .callAsync();
            const orderbookUrl = isV4(networkId)
                ? `${baseUrl}orderbook?baseToken=${optionsTokenAddress}&quoteToken=${sUSD.contract.address}`
                : `${baseUrl}orderbook?baseAssetData=${makerAssetData}&quoteAssetData=${takerAssetData}`;

            const response = await fetch(orderbookUrl);

            const responseJ = await response.json();
            if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                orderbook.sellOrders = responseJ.asks.records.map(
                    (record: any): OrderItem => {
                        return {
                            rawSignedOrder: record.order,
                            order: {
                                amount: bigNumberFormatter(record.order.makerAssetAmount),
                                price:
                                    bigNumberFormatter(record.order.takerAssetAmount) /
                                    bigNumberFormatter(record.order.makerAssetAmount),
                                total: bigNumberFormatter(record.order.takerAssetAmount),
                                timeRemaining: record.order.expirationTimeSeconds * ONE_SECOND_MS,
                            },
                        };
                    }
                );
            }
            if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                orderbook.buyOrders = responseJ.bids.records.map(
                    (record: any): OrderItem => {
                        return {
                            rawSignedOrder: record.order,
                            order: {
                                amount: bigNumberFormatter(record.order.takerAssetAmount),
                                price:
                                    bigNumberFormatter(record.order.makerAssetAmount) /
                                    bigNumberFormatter(record.order.takerAssetAmount),
                                total: bigNumberFormatter(record.order.makerAssetAmount),
                                timeRemaining: record.order.expirationTimeSeconds * ONE_SECOND_MS,
                            },
                        };
                    }
                );
            }

            return orderbook;
        },
        options
    );
};

export default useBinaryOptionsMarketOrderbook;
