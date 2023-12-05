import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { CONNECTION_TIMEOUT_MS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { hoursToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { UseQueryOptions, useQueries } from 'react-query';
import { getBenchmarksPriceFeeds, getPriceServiceEndpoint } from 'utils/pyth';

type PriceRequest = {
    priceId: string;
    publishTime: number;
};

const usePythPriceQueries = (networkId: Network, priceRequests: PriceRequest[], options?: UseQueryOptions<number>) => {
    const fetchPythPrice = async (priceRequest: PriceRequest) => {
        const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
            timeout: CONNECTION_TIMEOUT_MS,
        });

        let price = 0;
        try {
            const priceFeed = await priceConnection.getPriceFeed(priceRequest.priceId, priceRequest.publishTime);
            price = priceFeed.getPriceUnchecked().getPriceAsNumberUnchecked();
        } catch (e) {
            console.log('Pyth price feed error', e);
            const unavailablePrice: PriceRequest = {
                priceId: priceRequest.priceId.replace('0x', ''),
                publishTime: priceRequest.publishTime,
            };
            // Secondary API for fetching prices using Pyth benchmarks in case that primary fails
            const benchmarksPriceFeeds = await getBenchmarksPriceFeeds([unavailablePrice]);
            price = benchmarksPriceFeeds.length ? benchmarksPriceFeeds[0].price : 0;
        }

        return price;
    };

    return useQueries(
        priceRequests.map((priceRequest) => ({
            queryKey: QUERY_KEYS.Prices.PythPrices(priceRequest.priceId, priceRequest.publishTime),
            queryFn: () => fetchPythPrice(priceRequest),
            cacheTime: hoursToMilliseconds(10),
            staleTime: hoursToMilliseconds(10),
            ...options,
        }))
    );
};

export default usePythPriceQueries;
