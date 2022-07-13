import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

type LPStakingThalesQueryResponse = {
    staked: number;
    rewards: number;
    secondRewards: number;
    paused: boolean;
    totalGelatoLocked: number;
};

const useLPStakingThalesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<LPStakingThalesQueryResponse>
) => {
    return useQuery<LPStakingThalesQueryResponse>(
        QUERY_KEYS.Token.LPStaking(walletAddress, networkId),
        async () => {
            // const staking = {
            //     rewards: 0,
            //     thalesStaked: 0,
            //     unstakingAmount: 0,
            //     lastUnstakeTime: Date.now(),
            //     isUnstaking: false,
            //     unstakeDurationPeriod: 7 * 24 * 60 * 60, // one week
            //     fixedPeriodReward: 0,
            //     totalStakedAmount: 0,
            //     paused: false,
            //     maxBonusRewardsPercentage: 0,
            // };

            const staking = {
                staked: 0,
                rewards: 0,
                secondRewards: 0,
                paused: false,
                totalGelatoLocked: 0,
            };

            try {
                // staking.unstakeDurationPeriod = Number(unstakeDurationPeriod) * 1000;
                // staking.totalStakedAmount = bigNumberFormatter(totalStakedAmount);
                // staking.paused = paused;
                // staking.maxBonusRewardsPercentage =
                //     Number(maxSNXRewardsPercentage) +
                //     Number(maxAMMVolumeRewardsPercentage) +
                //     Number(maxThalesRoyaleRewardsPercentage);

                const [paused, totalGelatoLocked] = await Promise.all([
                    (snxJSConnector as any).lpStakingRewardsContract.paused(),
                    (snxJSConnector as any).lpStakingRewardsContract.totalSupply(),
                ]);

                staking.paused = paused;
                staking.totalGelatoLocked = bigNumberFormatter(totalGelatoLocked);

                if (walletAddress !== '') {
                    const [staked, rewards] = await Promise.all([
                        (snxJSConnector as any).lpStakingRewardsContract.balanceOf(walletAddress),
                        (snxJSConnector as any).lpStakingRewardsContract.earned(walletAddress),
                    ]);

                    staking.staked = bigNumberFormatter(staked);
                    staking.rewards = bigNumberFormatter(rewards);

                    // const [isUnstaking, lastUnstakeTime, thalesStaked, unstakingAmount, rewards] = await Promise.all([
                    //     (snxJSConnector as any).stakingThalesContract.unstaking(walletAddress),
                    //     (snxJSConnector as any).stakingThalesContract.lastUnstakeTime(walletAddress),
                    //     (snxJSConnector as any).stakingThalesContract.stakedBalanceOf(walletAddress),
                    //     (snxJSConnector as any).stakingThalesContract.unstakingAmount(walletAddress),
                    //     (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress),
                    // ]);
                    // staking.isUnstaking = isUnstaking;
                    // staking.lastUnstakeTime = Number(lastUnstakeTime) * 1000;
                    // staking.thalesStaked =
                    //     bigNumberFormatter(thalesStaked) < BALANCE_THRESHOLD ? 0 : bigNumberFormatter(thalesStaked);
                    // staking.unstakingAmount = bigNumberFormatter(unstakingAmount);
                    // staking.rewards = bigNumberFormatter(rewards);
                }
            } catch {}

            return staking;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useLPStakingThalesQuery;
