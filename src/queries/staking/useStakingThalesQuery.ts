import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useStakingThalesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<{ thalesStaked: number; rewards: number; lastUnstakeTime: number; isUnstaking: boolean }>
) => {
    return useQuery<{ thalesStaked: number; rewards: number; lastUnstakeTime: number; isUnstaking: boolean }>(
        QUERY_KEYS.Staking.Thales(walletAddress, networkId),
        async () => {
            let rewards = 0;
            let thalesStaked = 0;
            let lastUnstakeTime = Date.now();
            let isUnstaking = false;

            try {
                isUnstaking = await (snxJSConnector as any).stakingThalesContract.unstaking(walletAddress);

                lastUnstakeTime =
                    Number(await (snxJSConnector as any).stakingThalesContract._lastUnstakeTime(walletAddress)) * 1000;

                thalesStaked = bigNumberFormatter(
                    await (snxJSConnector as any).stakingThalesContract.stakedBalanceOf(walletAddress)
                );

                rewards = bigNumberFormatter(
                    await (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress)
                );
            } catch (e) {
                console.error(e);
            }

            return { thalesStaked, rewards, lastUnstakeTime, isUnstaking };
        },
        options
    );
};

export default useStakingThalesQuery;
