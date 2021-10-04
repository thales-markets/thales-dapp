import { NetworkId } from '../../utils/network';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';

type OpenOrdersMap = Record<string, number> | null;

// TODO: discuss with team to change logic and store and update markets in redux to avoid this
export let openOrdersMapCacheNew: OpenOrdersMap = null;

export const fetchAllMarketOrders = (network: NetworkId, options?: UseQueryOptions<OpenOrdersMap>) => {
    return useQuery<OpenOrdersMap>(
        QUERY_KEYS.BinaryOptions.OrdersCount(network),
        async () => {
            const baseUrl = 'https://api.thales.market/orders/' + network;
            const response = await fetch(baseUrl);
            const json = await response.json();
            const openOrdersMap = new Map(json);

            openOrdersMapCacheNew = openOrdersMap as any;
            return openOrdersMap as any;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};
