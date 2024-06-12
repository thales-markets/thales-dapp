import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';

type Referrer = {
    id: string;
    trades: number;
    totalVolume: number;
    totalEarned: number;
    timestamp: number;
};

const useReferrerQuery = (networkId: Network, address?: string, options?: UseQueryOptions<Referrer[]>) => {
    return useQuery<Referrer[]>(
        QUERY_KEYS.Referral.Referrer(networkId, address),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.Referrers}/${networkId}?address=${
                        address ? address.toLowerCase() : ''
                    }`
                );

                if (!response?.data) return [];

                return response.data as Referrer[];
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        options
    );
};

export default useReferrerQuery;
