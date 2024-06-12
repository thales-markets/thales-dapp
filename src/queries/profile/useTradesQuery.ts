import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { Trades } from 'types/options';

const useTradesQuery = (networkId: Network, walletAddress: string, options?: UseQueryOptions<Trades>) => {
    return useQuery<Trades>(
        QUERY_KEYS.Profile.Trades(walletAddress, networkId),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.Trades}/${networkId}?taker=${walletAddress}`
                );

                if (!response?.data) return [];

                return response?.data as Trades;
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        options
    );
};

export default useTradesQuery;
