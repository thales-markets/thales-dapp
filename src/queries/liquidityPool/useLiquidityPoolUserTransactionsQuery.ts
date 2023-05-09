import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { LiquidityPoolUserTransactions } from 'types/liquidityPool';
import { NetworkId } from 'utils/network';

const useLiquidityPoolUserTransactionsQuery = (
    networkId: NetworkId,
    options?: UseQueryOptions<LiquidityPoolUserTransactions>
) => {
    return useQuery<LiquidityPoolUserTransactions>(
        QUERY_KEYS.LiquidityPool.UserTransactions(networkId),
        async () => {
            try {
                const liquidityPoolUserTransactions = await thalesData.binaryOptions.liquidityPoolUserTransactions({
                    network: networkId,
                });
                return liquidityPoolUserTransactions;
            } catch (e) {
                console.log(e);
                return [];
            }
        },
        {
            ...options,
        }
    );
};

export default useLiquidityPoolUserTransactionsQuery;
