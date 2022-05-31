import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

export type Referrer = {
    id: string;
    trades: number;
    totalVolume: number;
    totalEarned: number;
    timestamp: number;
};

const useReferrerQuery = (networkId: NetworkId, address?: string, options?: UseQueryOptions<Referrer[]>) => {
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
