import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

export interface OptOut {
    optOut: boolean;
}

const useStakingMigrationOptOutQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<OptOut>
) => {
    return useQuery<OptOut>(
        QUERY_KEYS.Token.StakingMigrationOptout(walletAddress, networkId),
        async () => {
            const baseUrl = `https://api.thales.market/token/staking-migration/opt-out/${networkId}/${walletAddress.toLowerCase()}`;
            const response = await fetch(baseUrl);
            const result = await response.text();

            return JSON.parse(result);
        },
        options
    );
};

export default useStakingMigrationOptOutQuery;
