import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/token';

type StakingThalesQueryResponse = {
    thalesStaked: number;
    rewards: number;
    lastUnstakeTime: number;
    isUnstaking: boolean;
    unstakingAmount: number;
    unstakeDurationPeriod: number;
    fixedPeriodReward: number;
    totalStakedAmount: number;
    paused: boolean;
    maxBonusRewardsPercentage: number;
    mergeAccountEnabled: boolean;
};

const useStakingThalesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<StakingThalesQueryResponse>
) => {
    return useQuery<StakingThalesQueryResponse>(
        QUERY_KEYS.Staking.Thales(walletAddress, networkId),
        async () => {
            const staking = {
                rewards: 0,
                thalesStaked: 0,
                unstakingAmount: 0,
                lastUnstakeTime: Date.now(),
                isUnstaking: false,
                unstakeDurationPeriod: 7 * 24 * 60 * 60, // one week
                fixedPeriodReward: 0,
                totalStakedAmount: 0,
                paused: false,
                maxBonusRewardsPercentage: 0,
                mergeAccountEnabled: true,
            };

            try {
                const [
                    unstakeDurationPeriod,
                    fixedPeriodReward,
                    totalStakedAmount,
                    paused,
                    maxSNXRewardsPercentage,
                    maxAMMVolumeRewardsPercentage,
                    maxThalesRoyaleRewardsPercentage,
                    mergeAccountEnabled,
                ] = await Promise.all([
                    (snxJSConnector as any).stakingThalesContract.unstakeDurationPeriod(),
                    (snxJSConnector as any).stakingThalesContract.fixedPeriodReward(),
                    (snxJSConnector as any).stakingThalesContract.totalStakedAmount(),
                    (snxJSConnector as any).stakingThalesContract.paused(),
                    (snxJSConnector as any).stakingThalesContract.maxSNXRewardsPercentage(),
                    (snxJSConnector as any).stakingThalesContract.maxAMMVolumeRewardsPercentage(),
                    (snxJSConnector as any).stakingThalesContract.maxThalesRoyaleRewardsPercentage(),
                    (snxJSConnector as any).stakingThalesContract.mergeAccountEnabled(),
                ]);

                staking.unstakeDurationPeriod = Number(unstakeDurationPeriod) * 1000;
                staking.fixedPeriodReward = bigNumberFormatter(fixedPeriodReward);
                staking.totalStakedAmount = bigNumberFormatter(totalStakedAmount);
                staking.paused = paused;
                staking.maxBonusRewardsPercentage =
                    Number(maxSNXRewardsPercentage) +
                    Number(maxAMMVolumeRewardsPercentage) +
                    Number(maxThalesRoyaleRewardsPercentage);
                staking.mergeAccountEnabled = mergeAccountEnabled;

                if (walletAddress !== '') {
                    const [isUnstaking, lastUnstakeTime, thalesStaked, unstakingAmount, rewards] = await Promise.all([
                        (snxJSConnector as any).stakingThalesContract.unstaking(walletAddress),
                        (snxJSConnector as any).stakingThalesContract.lastUnstakeTime(walletAddress),
                        (snxJSConnector as any).stakingThalesContract.stakedBalanceOf(walletAddress),
                        (snxJSConnector as any).stakingThalesContract.unstakingAmount(walletAddress),
                        (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress),
                    ]);

                    staking.isUnstaking = isUnstaking;
                    staking.lastUnstakeTime = Number(lastUnstakeTime) * 1000;
                    staking.thalesStaked =
                        bigNumberFormatter(thalesStaked) < BALANCE_THRESHOLD ? 0 : bigNumberFormatter(thalesStaked);
                    staking.unstakingAmount = bigNumberFormatter(unstakingAmount);
                    staking.rewards = bigNumberFormatter(rewards);
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

export default useStakingThalesQuery;
