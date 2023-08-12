import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { VaultsAndLiquidityPoolUserTransaction, VaultsAndLiquidityPoolUserTransactions } from 'types/profile';
import { VAULT_MAP } from 'constants/vault';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';

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

                const vaultsUserTransactions = await Promise.all(
                    vaultsNames.map((name: string) =>
                        thalesData.binaryOptions.vaultUserTransactions({
                            network: networkId,
                            vault: VAULT_MAP[name].addresses[networkId],
                            account: walletAddress,
                        })
                    )
                );
                const vaultsUserTransactionsWithName = vaultsUserTransactions
                    .map((vaultTransactions: VaultsAndLiquidityPoolUserTransactions, index: number) => {
                        return vaultTransactions.map((tx: VaultsAndLiquidityPoolUserTransaction) => {
                            return { ...tx, name: vaultsNames[index] };
                        });
                    })
                    .flat(1);

                const liquidityPoolUserTransactions: VaultsAndLiquidityPoolUserTransactions = await thalesData.binaryOptions.liquidityPoolUserTransactions(
                    {
                        network: networkId,
                        account: walletAddress,
                    }
                );

                const liquidityPoolUserTransactionsWithName = liquidityPoolUserTransactions.map(
                    (tx: VaultsAndLiquidityPoolUserTransaction) => {
                        return { ...tx, name: 'lp' };
                    }
                );

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
