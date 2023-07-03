import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import thalesData from 'thales-data';

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
            const referrers: ReferredTrader[] = await thalesData.binaryOptions.referredTraders({
                max: Infinity,
                network: networkId,
                referrer: referrer ? referrer.toLowerCase() : undefined,
            });
            return referrers;
        },
        options
    );
};

export default useReferredTradersQuery;
