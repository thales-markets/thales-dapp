import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { ethers } from 'ethers';

type StakingThalesQueryResponse = {
    thalesStaked: string;
    rewards: number;
    lastUnstakeTime: number;
    isUnstaking: boolean;
    unstakingAmount: string;
    unstakeDurationPeriod: number;
    fixedPeriodReward: string;
    totalStakedAmount: string;
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
                thalesStaked: '0',
                unstakingAmount: '0',
                lastUnstakeTime: Date.now(),
                isUnstaking: false,
                unstakeDurationPeriod: 7 * 24 * 60 * 60, // one week
                fixedPeriodReward: '0',
                totalStakedAmount: '0',
            };

            try {
                const [
                    isUnstaking,
                    lastUnstakeTime,
                    thalesStaked,
                    unstakingAmount,
                    rewards,
                    unstakeDurationPeriod,
                    fixedPeriodReward,
                    totalStakedAmount,
                ] = await Promise.all([
                    await (snxJSConnector as any).stakingThalesContract.unstaking(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.lastUnstakeTime(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.stakedBalanceOf(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.unstakingAmount(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.unstakeDurationPeriod(),
                    await (snxJSConnector as any).stakingThalesContract.fixedPeriodReward(),
                    await (snxJSConnector as any).stakingThalesContract.totalStakedAmount(),
                ]);

                staking.isUnstaking = isUnstaking;
                staking.lastUnstakeTime = Number(lastUnstakeTime) * 1000;
                staking.thalesStaked = ethers.utils.formatEther(thalesStaked);
                staking.unstakingAmount = ethers.utils.formatEther(unstakingAmount);
                staking.rewards = bigNumberFormatter(rewards);
                staking.unstakeDurationPeriod = Number(unstakeDurationPeriod) * 1000;
                staking.fixedPeriodReward = ethers.utils.formatEther(fixedPeriodReward);
                staking.totalStakedAmount = ethers.utils.formatEther(totalStakedAmount);
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
