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
    refferer?: string,
    options?: UseQueryOptions<ReferralTransactions[]>
) => {
    return useQuery<ReferralTransactions[]>(
        QUERY_KEYS.Referral.ReferralTransacations(networkId, trader, refferer),
        async () => {
            const referrers: ReferralTransactions[] = await thalesData.binaryOptions.referralTransfers({
                max: Infinity,
                network: networkId,
                trader,
                refferer,
            });
            return referrers;
        },
        options
    );
};

export default useReferralTransactionsQuery;
