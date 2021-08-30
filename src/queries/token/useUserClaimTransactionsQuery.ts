import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { ClaimTransactions } from 'types/token';
import { NetworkId } from 'utils/network';

const useSnxStakingUserTransactionsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<ClaimTransactions>
) => {
    return useQuery<ClaimTransactions>(
        QUERY_KEYS.Token.Claims(walletAddress, networkId),
        () =>
            thalesData.binaryOptions.tokenClaims({
                claimer: walletAddress,
                network: networkId,
            }),
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useSnxStakingUserTransactionsQuery;
