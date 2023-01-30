import { NetworkId } from '../../utils/network';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { generalConfig } from 'config/general';
import { AMM_MAX_BUFFER_PERCENTAGE } from 'constants/options';

type OpenOrdersMap = Map<
    string,
    { ordersCount: number; availableLongs: number; availableShorts: number; longPrice: number; shortPrice: number }
> | null;

export const fetchAllMarketOrders = (network: NetworkId, options?: UseQueryOptions<OpenOrdersMap>) => {
    return useQuery<OpenOrdersMap>(
        QUERY_KEYS.BinaryOptions.OrdersCount(network),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/orders/${network}`;
            const response = await fetch(baseUrl);
            const json = await response.json();
            const openOrdersMap: OpenOrdersMap = new Map(json) as any;

            const mappedOpenOrdersMap: OpenOrdersMap = new Map();
            openOrdersMap?.forEach((openOrderMap, key) => {
                mappedOpenOrdersMap?.set(key, {
                    ...openOrderMap,
                    availableLongs: openOrderMap.availableLongs * AMM_MAX_BUFFER_PERCENTAGE,
                    availableShorts: openOrderMap.availableShorts * AMM_MAX_BUFFER_PERCENTAGE,
                });
            });

            return mappedOpenOrdersMap;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};
