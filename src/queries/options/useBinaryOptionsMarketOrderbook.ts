import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { OrderbookInfo, OrderItem } from 'types/options';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { get0xBaseURL } from 'utils/0x';
import { NetworkId } from 'utils/network';
import { toJSTimestamp } from 'utils/formatters/date';

const useBinaryOptionsMarketOrderbook = (
    networkId: NetworkId,
    optionsTokenAddress: string,
    options?: UseQueryOptions<OrderbookInfo>
) => {
    const {
        snxJS: { sUSD },
    } = snxJSConnector as any;
    const baseUrl = get0xBaseURL(networkId);

    const orderbook: OrderbookInfo = {
        buyOrders: [],
        sellOrders: [],
    };

    function prepSellOrder(record: any) {
        const price = bigNumberFormatter(record.order.takerAmount) / bigNumberFormatter(record.order.makerAmount);
        const amount = bigNumberFormatter(record.order.makerAmount);
        const total = bigNumberFormatter(record.order.takerAmount);
        const timeRemaining = toJSTimestamp(record.order.expiry);
        const fillableAmount = bigNumberFormatter(record.metaData.remainingFillableTakerAmount) / price;
        const filled = (amount - fillableAmount) / amount;
        const maker = record.order.maker;
        const taker = record.order.taker;

        return {
            rawSignedOrder: record.order,
            displayOrder: {
                amount,
                price,
                total,
                timeRemaining,
                fillableAmount,
                filled,
                maker,
                taker,
            },
        };
    }

    function prepBuyOrder(record: any) {
        const price = bigNumberFormatter(record.order.makerAmount) / bigNumberFormatter(record.order.takerAmount);
        const amount = bigNumberFormatter(record.order.takerAmount);
        const total = bigNumberFormatter(record.order.makerAmount);
        const timeRemaining = toJSTimestamp(record.order.expiry);
        const fillableAmount = bigNumberFormatter(record.metaData.remainingFillableTakerAmount);
        const filled = (amount - fillableAmount) / amount;
        const maker = record.order.maker;
        const taker = record.order.taker;

        return {
            rawSignedOrder: record.order,
            displayOrder: {
                amount,
                price,
                total,
                timeRemaining,
                fillableAmount,
                filled,
                maker,
                taker,
            },
        };
    }

    return useQuery<OrderbookInfo>(
        QUERY_KEYS.BinaryOptions.MarketOrderBook(optionsTokenAddress),
        async () => {
            const orderbookUrl = `${baseUrl}orderbook?baseToken=${optionsTokenAddress}&quoteToken=${sUSD.contract.address}`;

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
