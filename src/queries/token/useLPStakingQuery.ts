import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from 'thales-utils';
import { Network } from 'enums/network';

type LPStakingThalesQueryResponse = {
    staked: number;
    rewards: number;
    secondRewards: number;
    paused: boolean;
};

const useLPStakingThalesQuery = (
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<LPStakingThalesQueryResponse>
) => {
    return useQuery<LPStakingThalesQueryResponse>(
        QUERY_KEYS.Token.LPStaking(walletAddress, networkId),
        async () => {
            const staking = {
                staked: 0,
                rewards: 0,
                secondRewards: 0,
                paused: false,
            };

            try {
                staking.paused = await (snxJSConnector as any).lpStakingRewardsContract.paused();

                if (walletAddress !== '') {
                    const [staked, rewards] = await Promise.all([
                        (snxJSConnector as any).lpStakingRewardsContract.balanceOf(walletAddress),
                        (snxJSConnector as any).lpStakingRewardsContract.earned(walletAddress),
                    ]);
                    staking.staked = bigNumberFormatter(staked);
                    staking.rewards = bigNumberFormatter(rewards[0]);
                    staking.secondRewards = bigNumberFormatter(rewards[1]);
                }
            } catch (e) {
                console.log(e);
            }

            return staking;
        },
        {
            ...options,
        }
    );
};

export default useLPStakingThalesQuery;
