import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';

const useStakingClaimOnBehalfQuery = (
    walletAddress: string,
    account: string,
    networkId: NetworkId,
    options?: UseQueryOptions<boolean>
) => {
    return useQuery<boolean>(
        QUERY_KEYS.Staking.ClaimOnBehalf(walletAddress, account, networkId),
        async () => {
            try {
                const { stakingThalesContract } = snxJSConnector as any;
                let canClaimOnBehalf = false;
                if (stakingThalesContract) {
                    canClaimOnBehalf = await (snxJSConnector as any).stakingThalesContract.canClaimOnBehalf(
                        walletAddress,
                        account
                    );
                }
                return canClaimOnBehalf;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useStakingClaimOnBehalfQuery;
