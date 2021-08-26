import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useStakingThalesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<{ thalesStaked: number; rewards: number }>
) => {
    return useQuery<{ thalesStaked: number; rewards: number }>(
        QUERY_KEYS.Staking.Thales(walletAddress, networkId),
        async () => {
            let rewards = 0;

            const thalesStaked = bigNumberFormatter(
                await (snxJSConnector as any).stakingThalesContract.stakedBalanceOf(walletAddress)
            );

            try {
                rewards = bigNumberFormatter(
                    await (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress)
                );
            } catch (e) {
                console.error(e);
            }

            return { thalesStaked, rewards };
        },
        options
    );
};

export default useStakingThalesQuery;
