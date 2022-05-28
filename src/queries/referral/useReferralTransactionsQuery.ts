import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

export type ReferralTransactions = {
    id: string;
    refferer: string;
    trader: string;
    amount: number;
    volume: number;
    timestamp: number;
};

const useReferralTransactionsQuery = (
    networkId: NetworkId,
    trader?: string,
    referrer?: string,
    options?: UseQueryOptions<ReferralTransactions[]>
) => {
    return useQuery<ReferralTransactions[]>(
        QUERY_KEYS.Referral.ReferralTransacations(networkId, trader, referrer),
        async () => {
            const referrers: ReferralTransactions[] = await thalesData.binaryOptions.referralTransfers({
                max: Infinity,
                network: networkId,
                trader,
                referrer,
            });
            return referrers;
        },
        options
    );
};

export default useReferralTransactionsQuery;
