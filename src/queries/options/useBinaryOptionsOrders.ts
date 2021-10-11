import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionSide, OptionsMarkets, OrderItem, ExtendedOrders, ExtendedOrderItem } from 'types/options';
import { NetworkId } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { get0xBaseURL } from 'utils/0x';
import { prepBuyOrder, prepSellOrder } from 'utils/formatters/order';
import { keyBy } from 'lodash';
import { ethers } from 'ethers';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import ethBurnedOracleInstance from 'utils/contracts/ethBurnedOracleInstance';
import { sortOptionsMarkets } from 'utils/options';
import { ORDERBOOK_AMOUNT_THRESHOLD } from 'constants/options';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const filterAndPrepareOrders = (
    optionSide: OptionSide,
    responseJ: any,
    isBuyOrder: boolean,
    optionsAddresses: string[],
    marketsAddressMap: any
) => {
    let preparedOrders = [];

    if (responseJ.records && responseJ.records.length > 0) {
        const filteredOrders = responseJ.records.filter((record: any) =>
            isBuyOrder
                ? optionsAddresses.includes(record.order.takerToken.toLowerCase())
                : optionsAddresses.includes(record.order.makerToken.toLowerCase())
        );

        preparedOrders = filteredOrders
            .map(
                (record: any): ExtendedOrderItem => {
                    const preparedOrder: OrderItem = isBuyOrder ? prepBuyOrder(record) : prepSellOrder(record);
                    return {
                        ...preparedOrder,
                        market:
                            marketsAddressMap[
                                isBuyOrder
                                    ? record.order.takerToken.toLowerCase()
                                    : record.order.makerToken.toLowerCase()
                            ],
                        optionSide,
                    };
                }
            )
            .filter(
                (order: ExtendedOrderItem) =>
                    order.displayOrder.fillableAmount >= ORDERBOOK_AMOUNT_THRESHOLD &&
                    order.displayOrder.potentialReturnAmount >= ORDERBOOK_AMOUNT_THRESHOLD
            );
    }

    return preparedOrders;
};

type OrderType = 'buys' | 'sells';

const useBinaryOptionsOrders = (
    networkId: NetworkId,
    orderType: OrderType,
    options?: UseQueryOptions<ExtendedOrders>
) => {
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const baseUrl = `${get0xBaseURL(networkId)}sra/v4/`;

    return useQuery<ExtendedOrders>(
        QUERY_KEYS.BinaryOptions.Orders(orderType, networkId),
        async () => {
            const rawOptionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });
            const optionsMarkets = await Promise.all(
                rawOptionsMarkets.map(async (currentMarket) => {
                    if (currentMarket.customMarket) {
                        try {
                            const sportFeedContract = new ethers.Contract(
                                currentMarket.customOracle,
                                sportFeedOracleContract.abi,
                                (snxJSConnector as any).provider
                            );
                            const data: any = await Promise.all([
                                sportFeedContract.targetName(),
                                sportFeedContract.eventName(),
                                sportFeedContract.targetOutcome(),
                            ]);
                            currentMarket.country =
                                data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0];
                            currentMarket.eventName = data[1];
                            currentMarket.outcome = data[2];
                            return currentMarket;
                        } catch (e) {
                            const sportFeedContract = new ethers.Contract(
                                currentMarket.customOracle,
                                ethBurnedOracleInstance.abi,
                                (snxJSConnector as any).provider
                            );
                            const data: any = await Promise.all([
                                sportFeedContract.targetName(),
                                sportFeedContract.eventName(),
                                sportFeedContract.targetOutcome(),
                            ]);
                            currentMarket.country =
                                data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0];
                            currentMarket.eventName = data[1];
                            currentMarket.outcome =
                                currentMarket.eventName === 'Flippening Markets' ||
                                currentMarket.eventName === 'ETH/BTC market cap ratio'
                                    ? bigNumberFormatter(data[2]).toString()
                                    : Number(data[2]).toString();
                            return currentMarket;
                        }
                    } else {
                        return currentMarket;
                    }
                })
            );

            const sortedOptionsMarkets = sortOptionsMarkets(optionsMarkets, snxJSConnector.synthsMap).filter(
                (market) => market.phase === 'trading'
            );

            const isBuyOrder = orderType === 'buys';

            const orders = isBuyOrder
                ? `${baseUrl}orders?makerToken=${SynthsUSD.address}&perPage=1000`
                : `${baseUrl}orders?takerToken=${SynthsUSD.address}&perPage=1000`;

            const response = await fetch(orders);
            const responseJ = await response.json();

            const marketsLongAddressMap = keyBy(sortedOptionsMarkets, 'longAddress');
            const marketsShortAddressMap = keyBy(sortedOptionsMarkets, 'shortAddress');
            const longAddresses = sortedOptionsMarkets.map((currentMarket) => currentMarket.longAddress.toLowerCase());
            const shortAddresses = sortedOptionsMarkets.map((currentMarket) =>
                currentMarket.shortAddress.toLowerCase()
            );

            return [
                ...filterAndPrepareOrders('long', responseJ, isBuyOrder, longAddresses, marketsLongAddressMap),
                ...filterAndPrepareOrders('short', responseJ, isBuyOrder, shortAddresses, marketsShortAddressMap),
            ];
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useBinaryOptionsOrders;
