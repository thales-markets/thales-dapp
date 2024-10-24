import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { VAULT_MAP } from 'constants/vault';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';
import { VaultsAndLiquidityPoolUserTransaction, VaultsAndLiquidityPoolUserTransactions } from 'types/profile';
import { LiquidityPoolMap } from '../../constants/liquidityPool';
import { LiquidityPoolCollateral } from '../../enums/liquidityPool';

const useUserVaultsAndLpTransactionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<VaultsAndLiquidityPoolUserTransactions>
) => {
    return useQuery<VaultsAndLiquidityPoolUserTransactions>(
        QUERY_KEYS.User.VaultsAndLpTransactions(networkId, walletAddress),
        async () => {
            try {
                const vaultsNames = Object.keys(VAULT_MAP);

                const vaultsUserTransactionsResponse = await Promise.all(
                    vaultsNames.map((name: string) => {
                        return VAULT_MAP[name]?.addresses[networkId]
                            ? axios.get(
                                  `${generalConfig.API_URL}/${API_ROUTES.VaultsUserTransactions}/${networkId}?vault=${VAULT_MAP[name].addresses[networkId]}&account=${walletAddress}`
                              )
                            : { data: [] };
                    })
                );

                const vaultsUserTransactions = vaultsUserTransactionsResponse
                    .map((response) => (response?.data ? response.data : undefined))
                    .filter((item) => item);

                const vaultsUserTransactionsWithName = vaultsUserTransactions
                    .map((vaultTransactions: VaultsAndLiquidityPoolUserTransactions, index: number) => {
                        return vaultTransactions.map((tx: VaultsAndLiquidityPoolUserTransaction) => {
                            return { ...tx, name: vaultsNames[index] };
                        });
                    })
                    .flat(1);

                const liquidityPoolUserTransactionsResponse = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.LPTransactions}/${networkId}?account=${walletAddress}`
                );

                const liquidityPoolUserTransactions = liquidityPoolUserTransactionsResponse?.data
                    ? liquidityPoolUserTransactionsResponse?.data
                    : [];

                const liquidityPoolUserTransactionsWithName = liquidityPoolUserTransactions.map((tx: any) => {
                    const lpPerNetwork = LiquidityPoolMap[Network.OptimismMainnet];
                    const sUsdLpAddress = lpPerNetwork ? lpPerNetwork[LiquidityPoolCollateral.sUSD]?.address || '' : '';
                    return { ...tx, name: tx.liquidityPool === sUsdLpAddress.toLowerCase() ? 'susd-lp' : 'lp' };
                });

                return orderBy(
                    [...vaultsUserTransactionsWithName, ...liquidityPoolUserTransactionsWithName],
                    ['timestamp'],
                    ['desc']
                );
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

export default useUserVaultsAndLpTransactionsQuery;
