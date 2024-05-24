import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { VaultUserTransactions } from 'types/vault';

const useVaultUserTransactionsQuery = (
    vaultAddress: string,
    networkId: Network,
    options?: UseQueryOptions<VaultUserTransactions>
) => {
    return useQuery<VaultUserTransactions>(
        QUERY_KEYS.Vault.UserTransactions(vaultAddress, networkId),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.VaultsUserTransactions}/${networkId}?vault=${vaultAddress}`
                );

                if (!response?.data) return [];

                return response.data;
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

export default useVaultUserTransactionsQuery;
