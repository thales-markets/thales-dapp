import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';

export type ReferralTransactions = {
    id: string;
    refferer: string;
    trader: string;
    amount: number;
    volume: number;
    timestamp: number;
};

const useReferralTransactionsQuery = (
    networkId: Network,
    trader?: string,
    referrer?: string,
    options?: UseQueryOptions<ReferralTransactions[]>
) => {
    return useQuery<ReferralTransactions[]>(
        QUERY_KEYS.Referral.ReferralTransacations(networkId, trader, referrer),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.ReferralTransactions}/${networkId}?trader=${
                        trader ? trader.toLowerCase() : ''
                    }&referrer=${referrer ? referrer.toLowerCase() : ''}`
                );

                if (!response?.data) return [];

                return response.data as ReferralTransactions[];
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        options
    );
};

export default useReferralTransactionsQuery;
