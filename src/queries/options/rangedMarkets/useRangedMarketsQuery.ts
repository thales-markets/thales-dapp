import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { RangedMarket } from 'types/options';
import { Network } from 'enums/network';
import thalesData from 'thales-data';

const useRangedMarketsQuery = (networkId: Network, marketIds?: string[], options?: UseQueryOptions<RangedMarket[]>) => {
    return useQuery<RangedMarket[]>(
        QUERY_KEYS.BinaryOptions.RangedMarkets(networkId, marketIds),
        async () => {
            const rangedMarkets: RangedMarket[] = await thalesData.binaryOptions.rangedMarkets({
                max: Infinity,
                network: networkId,
                marketIds,
            });

            return rangedMarkets;
        },
        options
    );
};

export default useRangedMarketsQuery;
