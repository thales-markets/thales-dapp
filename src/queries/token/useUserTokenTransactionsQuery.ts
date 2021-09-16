import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { TokenTransactions } from 'types/token';
import { NetworkId } from 'utils/network';

const useUserTokenTransactionsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<TokenTransactions>
) => {
    return useQuery<TokenTransactions>(
        QUERY_KEYS.Token.Transactions(walletAddress, networkId),
        () =>
            thalesData.binaryOptions.tokenTransactions({
                account: walletAddress,
                network: networkId,
            }),
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useUserTokenTransactionsQuery;
