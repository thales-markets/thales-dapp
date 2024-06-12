import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';

export type ReferredTrader = {
    id: string;
    trades: number;
    totalVolume: number;
    totalEarned: number;
    refferer: string;
    timestamp: number;
};

const useReferredTradersQuery = (
    networkId: Network,
    referrer?: string,
    options?: UseQueryOptions<ReferredTrader[]>
) => {
    return useQuery<ReferredTrader[]>(
        QUERY_KEYS.Referral.ReferredTrader(networkId, referrer),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.ReferralTraders}/${networkId}?referrer=${
                        referrer ? referrer.toLowerCase() : ''
                    }`
                );

                if (!response?.data) return [];

                return response.data as ReferredTrader[];
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        options
    );
};

export default useReferredTradersQuery;
