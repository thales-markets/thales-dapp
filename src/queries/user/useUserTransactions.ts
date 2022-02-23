import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

const useUserTransactionsQuery = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.User.Transactions(walletAddress, networkId),
        async () => {
            const marketTx = await thalesData.binaryOptions.optionTransactions({
                account: walletAddress,
                network: networkId,
            });

            const tradesMaker = await thalesData.binaryOptions.trades({
                maker: walletAddress,
                network: networkId,
            });

            const tradesTaker = await thalesData.binaryOptions.trades({
                taker: walletAddress,
                network: networkId,
            });
            return { marketTx, trades: [...tradesMaker, ...tradesTaker] };
        },
        options
    );
};

export default useUserTransactionsQuery;
