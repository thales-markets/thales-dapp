import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { TokenTransactions } from 'types/token';
import { NetworkId } from 'utils/network';

const useUserTokenTransactionsQuery = (
    walletAddress: string | undefined,
    networkId: NetworkId,
    type_in?: string,
    options?: UseQueryOptions<TokenTransactions>
) => {
    return useQuery<TokenTransactions>(
        QUERY_KEYS.Token.Transactions(walletAddress, networkId, type_in),
        () =>
            thalesData.binaryOptions.tokenTransactions({
                account: walletAddress,
                network: networkId,
                type_in,
            }),
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useUserTokenTransactionsQuery;
