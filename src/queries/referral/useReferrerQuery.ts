import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import thalesData from 'thales-data';

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
            const referrers: Referrer[] = await thalesData.binaryOptions.referrers({
                max: Infinity,
                network: networkId,
                address: address ? address.toLowerCase() : undefined,
            });
            return referrers;
        },
        options
    );
};

export default useReferrerQuery;
