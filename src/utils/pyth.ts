import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { PRICE_ID, PRICE_SERVICE_ENDPOINTS } from 'constants/pyth';
import { Network } from 'enums/network';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';

export const getPriceServiceEndpoint = (networkId: Network) => {
    switch (networkId) {
        case (Network.Mainnet, Network.OptimismMainnet, Network.BSC, Network.PolygonMainnet, Network.Arbitrum):
            return PRICE_SERVICE_ENDPOINTS.mainnet;
        case Network.OptimismGoerli:
            return PRICE_SERVICE_ENDPOINTS.testnet;

        default:
            return PRICE_SERVICE_ENDPOINTS.mainnet;
    }
};

export const getPriceId = (networkId: Network, currency: typeof CRYPTO_CURRENCY_MAP[number]) => {
    switch (networkId) {
        case (Network.Mainnet, Network.OptimismMainnet, Network.BSC, Network.PolygonMainnet, Network.Arbitrum):
            return PRICE_ID.mainnet[currency];
        case Network.OptimismGoerli:
            return PRICE_ID.testnet[currency];

        default:
            return PRICE_ID.mainnet[currency];
    }
};

const getCurrencyByPriceId = (networkId: Network, priceId: string) => {
    switch (networkId) {
        case (Network.Mainnet, Network.OptimismMainnet, Network.BSC, Network.PolygonMainnet, Network.Arbitrum):
            return (
                Object.keys(PRICE_ID.mainnet).find((key) => PRICE_ID.mainnet[key] === '0x' + priceId) ||
                'currencyNotFound'
            );
        case Network.OptimismGoerli:
            return (
                Object.keys(PRICE_ID.testnet).find((key) => PRICE_ID.testnet[key] === '0x' + priceId) ||
                'currencyNotFound'
            );

        default:
            return (
                Object.keys(PRICE_ID.mainnet).find((key) => PRICE_ID.mainnet[key] === '0x' + priceId) ||
                'currencyNotFound'
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
                      // Get the price if it is not older than 60 seconds from the current time
                      priceFeed.getPriceNoOlderThan(60)?.getPriceAsNumberUnchecked() || 0,
              }),
              {}
          )
        : { [CRYPTO_CURRENCY_MAP.BTC]: 0, [CRYPTO_CURRENCY_MAP.ETH]: 0 };
};
