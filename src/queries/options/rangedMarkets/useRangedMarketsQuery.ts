import axios from 'axios';
import { generalConfig } from 'config/general';
import { MIN_MATURITY } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { RangedMarket } from 'types/options';

const useRangedMarketsQuery = (networkId: Network, marketIds?: string[], options?: UseQueryOptions<RangedMarket[]>) => {
    return useQuery<RangedMarket[]>(
        QUERY_KEYS.BinaryOptions.RangedMarkets(networkId, marketIds),
        async () => {
            const rangedMarketsResponse = await axios.get(
                `${generalConfig.API_URL}/${API_ROUTES.RangeMarketsList}/${networkId}?min-maturity=${MIN_MATURITY}${
                    marketIds ? `&market-ids=${marketIds?.join(',')}` : ''
                }`
            );
            const rangedMarkets: RangedMarket[] = rangedMarketsResponse?.data ? rangedMarketsResponse.data : [];

            return rangedMarkets;
        },
        options
    );
};

export default useRangedMarketsQuery;
