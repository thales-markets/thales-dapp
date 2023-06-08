import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { LiquidityPoolUserTransactions, VaultsAndLiquidityPoolUserTransactions } from 'types/liquidityPool';
import { VAULT_MAP } from 'constants/vault';
import { VaultUserTransactions } from 'types/vault';
import { NetworkId } from 'utils/network';

const useUserVaultAndLpTransactions = (
    networkId: NetworkId,
    walletAddress: string,
    options?: UseQueryOptions<VaultsAndLiquidityPoolUserTransactions>
) => {
    return useQuery<VaultsAndLiquidityPoolUserTransactions>(
        QUERY_KEYS.User.VaultsAndLpTxs(networkId, walletAddress),
        async () => {
            try {
                const vaultTx: VaultsAndLiquidityPoolUserTransactions = [];
                for (const key in VAULT_MAP) {
                    const vaultUserTransactions: VaultUserTransactions = await thalesData.binaryOptions.vaultUserTransactions(
                        {
                            network: networkId,
                            vault: VAULT_MAP[key].addresses[networkId],
                            account: walletAddress,
                        }
                    );

                    vaultTx.push(
                        ...vaultUserTransactions.map((tx) => {
                            return { name: key, ...tx };
                        })
                    );
                }

                const liquidityPoolUserTransactions: LiquidityPoolUserTransactions = await thalesData.binaryOptions.liquidityPoolUserTransactions(
                    {
                        network: networkId,
                        account: walletAddress,
                    }
                );

                vaultTx.push(
                    ...liquidityPoolUserTransactions.map((tx) => {
                        return { name: 'LP', ...tx };
                    })
                );

                return vaultTx.sort((a, b) => b.timestamp - a.timestamp);
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

export default useUserVaultAndLpTransactions;
