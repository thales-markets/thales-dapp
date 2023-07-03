import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { VaultPnls } from 'types/vault';
import { orderBy } from 'lodash';

const useVaultPnlsQuery = (vaultAddress: string, networkId: Network, options?: UseQueryOptions<VaultPnls>) => {
    return useQuery<VaultPnls>(
        QUERY_KEYS.Vault.PnL(vaultAddress, networkId),
        async () => {
            try {
                const vaultPnls = await thalesData.binaryOptions.vaultPnls({
                    network: networkId,
                    vault: vaultAddress,
                });
                return orderBy(vaultPnls, ['round'], ['asc']).map((pnl) => {
                    return {
                        round: `R${pnl.round}`,
                        pnl: pnl.pnl - 1,
                    };
                });
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

export default useVaultPnlsQuery;
