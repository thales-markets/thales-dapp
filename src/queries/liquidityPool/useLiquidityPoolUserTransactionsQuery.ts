import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { LiquidityPoolUserTransactions } from 'types/liquidityPool';

const useLiquidityPoolUserTransactionsQuery = (
    networkId: Network,
    round: number,
    options?: UseQueryOptions<LiquidityPoolUserTransactions>
) => {
    return useQuery<LiquidityPoolUserTransactions>(
        QUERY_KEYS.LiquidityPool.UserTransactions(networkId, round),
        async () => {
            try {
                const liquidityPoolUserTransactionsResponse = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.LPTransactions}/${networkId}?round=${round}`
                );

                if (!liquidityPoolUserTransactionsResponse?.data) return [];

                return liquidityPoolUserTransactionsResponse.data;
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
