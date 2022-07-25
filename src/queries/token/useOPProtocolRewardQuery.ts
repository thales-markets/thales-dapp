import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

export type RewardTransactionType = {
    account: string;
    amount: number;
    blockNumber: number;
    hash: string;
    protocolRewards: number;
    timestamp: number;
    type: string;
};

const useOPProtocolRewardQuery = (
    networkId: NetworkId,
    minTimestamp?: number,
    maxTimestamp?: number,
    options?: UseQueryOptions<RewardTransactionType[]>
) => {
    return useQuery<RewardTransactionType[]>(
        QUERY_KEYS.Token.OPProtocolRewards(networkId, minTimestamp, undefined),
        async () => {
            try {
                const transactions: RewardTransactionType[] = await thalesData.binaryOptions.tokenTransactions({
                    network: networkId,
                    onlyWithProtocolReward: true,
                    maxTimestamp,
                    minTimestamp,
                });
                return transactions;
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        options
    );
};

export default useOPProtocolRewardQuery;
