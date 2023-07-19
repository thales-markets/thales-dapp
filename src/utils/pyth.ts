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

export const getCurrentPrice = async (connection: EvmPriceServiceConnection, priceId: string) => {
    const priceFeeds = await connection.getLatestPriceFeeds([priceId]);
    // Get the price if it is not older than 60 seconds from the current time.
    return priceFeeds && priceFeeds[0].getPriceNoOlderThan(60)?.getPriceAsNumberUnchecked();
};
