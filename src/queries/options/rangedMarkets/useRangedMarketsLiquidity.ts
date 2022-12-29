import { NetworkId } from 'utils/network';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { generalConfig } from 'config/general';
import { AMM_MAX_BUFFER_PERCENTAGE } from 'constants/options';

type OpenOrdersMap = Map<
    string,
    { asset: string; availableIn: number; availableOut: number; inPrice: number; outPrice: number }
> | null;

export const useRangedMarketsLiquidity = (network: NetworkId, options?: UseQueryOptions<OpenOrdersMap>) => {
    return useQuery<OpenOrdersMap>(
        QUERY_KEYS.BinaryOptions.RangedLiquidity(network),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/ranged-liquidity/${network}`;
            const response = await fetch(baseUrl);
            const json = await response.json();
            const openOrdersMap: OpenOrdersMap = new Map(json) as any;

            const mappedOpenOrdersMap: OpenOrdersMap = new Map();
            openOrdersMap?.forEach((openOrderMap, key) => {
                mappedOpenOrdersMap?.set(key, {
                    ...openOrderMap,
                    availableIn: openOrderMap.availableIn * AMM_MAX_BUFFER_PERCENTAGE,
                    availableOut: openOrderMap.availableOut * AMM_MAX_BUFFER_PERCENTAGE,
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
