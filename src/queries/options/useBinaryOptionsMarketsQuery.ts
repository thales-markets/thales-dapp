import axios from 'axios';
import { generalConfig } from 'config/general';
import { MIN_MATURITY } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionsMarkets } from 'types/options';

const useBinaryOptionsMarketsQuery = (networkId: Network, options?: UseQueryOptions<OptionsMarkets>) => {
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets(networkId),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.MarketsList}/${networkId}?min-maturity=${MIN_MATURITY}`
                );
                if (!response?.data) return [];

                return response?.data as OptionsMarkets;
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
