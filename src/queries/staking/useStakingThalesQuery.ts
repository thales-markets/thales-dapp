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
            };

            try {
                const [isUnstaking, lastUnstakeTime, thalesStaked, unstakingAmount, rewards] = await Promise.all([
                    await (snxJSConnector as any).stakingThalesContract.unstaking(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.lastUnstakeTime(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.stakedBalanceOf(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.unstakingAmount(walletAddress),
                    await (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress),
                ]);

                staking.isUnstaking = isUnstaking;
                staking.lastUnstakeTime = Number(lastUnstakeTime) * 1000;
                staking.thalesStaked = ethers.utils.formatEther(thalesStaked);
                staking.unstakingAmount = ethers.utils.formatEther(unstakingAmount);
                staking.rewards = bigNumberFormatter(rewards);
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
