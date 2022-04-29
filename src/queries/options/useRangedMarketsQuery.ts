import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { RangedMarket } from 'types/options';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

const useRangedMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<RangedMarket[]>) => {
    return useQuery<RangedMarket[]>(
        QUERY_KEYS.BinaryOptions.RangedMarkets(networkId),
        async () => {
            const rangedMarkets: RangedMarket[] = await thalesData.binaryOptions.rangedMarkets({
                max: Infinity,
                network: networkId,
            });
            return rangedMarkets;
        },
        options
    );
};

export default useRangedMarketsQuery;
