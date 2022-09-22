import { NetworkId } from 'utils/network';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { generalConfig } from 'config/general';

type OpenOrdersMap = Record<string, any> | null;

// TODO: discuss with team to change logic and store and update markets in redux to avoid this
export let openOrdersMapCacheNew: OpenOrdersMap = null;

export const useRangedMarketsLiquidity = (network: NetworkId, options?: UseQueryOptions<OpenOrdersMap>) => {
    return useQuery<OpenOrdersMap>(
        QUERY_KEYS.BinaryOptions.RangedLiquidity(network),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/ranged-liquidity/${network}`;
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
