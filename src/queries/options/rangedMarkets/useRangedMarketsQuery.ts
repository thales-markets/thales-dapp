import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { RangedMarket } from 'types/options';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

const useRangedMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<RangedMarket[]>) => {
    return useQuery<RangedMarket[]>(
        QUERY_KEYS.BinaryOptions.RangedMarkets(networkId),
        async () => {
            // const today = new Date();
            // // thales-data takes timestamp argument in seconds - take markets from last 120 days (4 months)
            // const priorDate = Math.round(new Date(new Date().setDate(today.getDate() - 120)).getTime() / 1000);

            const today = new Date();
            const tomorrow = Math.round(new Date(new Date().setDate(today.getDate() + 1)).getTime() / 1000);

            const rangedMarkets: RangedMarket[] = await thalesData.binaryOptions.rangedMarkets({
                max: Infinity,
                network: networkId,
                minMaturity: tomorrow,
            });

            console.log(rangedMarkets);

            return rangedMarkets;
        },
        options
    );
};

export default useRangedMarketsQuery;
