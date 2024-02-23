import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { generalConfig } from 'config/general';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { PRICE_ID, PRICE_SERVICE_ENDPOINTS, PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import { Network } from 'enums/network';
import { ethers } from 'ethers';
import { bigNumberFormatter, floorNumberToDecimals } from 'thales-utils';

export const getPriceServiceEndpoint = (networkId: Network) => {
    if (
        [Network.OptimismGoerli, Network.OptimismSepolia, Network.ZkSyncSepolia, Network.BlastSepolia].includes(
            networkId
        )
    ) {
        return PRICE_SERVICE_ENDPOINTS.testnet;
    } else {
        return PRICE_SERVICE_ENDPOINTS.mainnet;
    }
};

export const getPriceId = (networkId: Network, currency: typeof CRYPTO_CURRENCY_MAP[number]) => {
    if (
        [Network.OptimismGoerli, Network.OptimismSepolia, Network.ZkSyncSepolia, Network.BlastSepolia].includes(
            networkId
        )
    ) {
        return PRICE_ID.testnet[currency];
    } else {
        return PRICE_ID.mainnet[currency];
    }
};

const getCurrencyByPriceId = (networkId: Network, priceId: string) => {
    if (
        [Network.OptimismGoerli, Network.OptimismSepolia, Network.ZkSyncSepolia, Network.BlastSepolia].includes(
            networkId
        )
    ) {
        return (
            Object.keys(PRICE_ID.testnet).find((key) => PRICE_ID.testnet[key] === '0x' + priceId) || 'currencyNotFound'
        );
    } else {
        return (
            Object.keys(PRICE_ID.mainnet).find((key) => PRICE_ID.mainnet[key] === '0x' + priceId) || 'currencyNotFound'
        );
    }
};

export const getCurrentPrices = async (
    connection: EvmPriceServiceConnection,
    networkId: Network,
    priceIds: string[]
) => {
    const priceFeeds = await connection.getLatestPriceFeeds(priceIds);

    return priceFeeds
        ? priceFeeds.reduce(
              (accumulator, priceFeed) => ({
                  ...accumulator,
                  [getCurrencyByPriceId(networkId, priceFeed.id)]:
                      // Get the price if it is not older than 30 seconds from the current time
                      priceFeed.getPriceNoOlderThan(30)?.getPriceAsNumberUnchecked() || 0,
              }),
              {}
          )
        : { [CRYPTO_CURRENCY_MAP.BTC]: 0, [CRYPTO_CURRENCY_MAP.ETH]: 0 };
};

/*
 * Fetching historical prices for a given array of objects with price ID and publish time
 * using Pyth benchmarks API.
 *
 * Pyth benchmarks API - for given price ID and publish time returns single historical price
 * as object 'parsed' with array of prices which contains parsed object with id and price data.
 *
 * Parametar Price ID is without starting chars 0x
 * Has limitations of 30 requests per 10 seconds.
 */
export const getBenchmarksPriceFeeds = async (priceFeeds: { priceId: string; publishTime: number }[]) => {
    const benchmarksPriceFeeds: { priceId: string; publishTime: number; price: number }[] = [];

    if (priceFeeds.length) {
        const benchmarksPricePromises = priceFeeds.map((data: any) =>
            fetch(`${generalConfig.PYTH_BENCHMARKS_API_URL}${data.publishTime}?ids=${data.priceId}`).catch((e) =>
                console.log('Pyth price benchmarks error', e)
            )
        );

        const benchmarksPriceResponses = await Promise.allSettled(benchmarksPricePromises);
        const benchmarksResponseBodies: (Promise<any> | undefined)[] = benchmarksPriceResponses.map(
            (benchmarksPriceResponse) => {
                if (benchmarksPriceResponse.status === 'fulfilled') {
                    if (benchmarksPriceResponse.value) {
                        if (benchmarksPriceResponse.value.status == 200) {
                            return benchmarksPriceResponse.value.text();
                        } else {
                            console.log('Failed to fetch Pyth benchmarks data', benchmarksPriceResponse.value.status);
                        }
                    }
                }
            }
        );

        const responses = await Promise.all(benchmarksResponseBodies);
        responses.map((response, index) => {
            // parsed[0] - always fetching one price ID
            const bodyTextParsed = response ? JSON.parse(response).parsed[0] : undefined;

            benchmarksPriceFeeds.push({
                priceId: priceFeeds[index].priceId,
                publishTime: priceFeeds[index].publishTime, // requested publish time
                price: bodyTextParsed ? bigNumberFormatter(bodyTextParsed.price.price, PYTH_CURRENCY_DECIMALS) : 0,
            });
        });
    }

    return benchmarksPriceFeeds;
};

export const priceParser = (value: number) =>
    ethers.utils.parseUnits(floorNumberToDecimals(value, PYTH_CURRENCY_DECIMALS).toString(), PYTH_CURRENCY_DECIMALS);
