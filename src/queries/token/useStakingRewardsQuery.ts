import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { StakingReward } from 'types/token';

// const BALANCE_THRESHOLD = 0.0001;

const useStakingRewardsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<StakingReward>
) => {
    return useQuery<StakingReward>(
        QUERY_KEYS.Token.StakingRewards(walletAddress, networkId),
        async () => {
            const [
                paused,
                period,
                lastPeriodTimeStamp,
                durationPeriod,
                maxSNXRewardsPercentage,
                maxAMMVolumeRewardsPercentage,
                maxThalesRoyaleRewardsPercentage,
                rewards,
                baseRewards,
                totalBonus,
                snxBonus,
                ammBonus,
                thalesRoyaleBonus,
            ] = await Promise.all([
                (snxJSConnector as any).stakingThalesContract.paused(),
                (snxJSConnector as any).stakingThalesContract.periodsOfStaking(),
                (snxJSConnector as any).stakingThalesContract.lastPeriodTimeStamp(),
                (snxJSConnector as any).stakingThalesContract.durationPeriod(),
                (snxJSConnector as any).stakingThalesContract.maxSNXRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.maxAMMVolumeRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.maxThalesRoyaleRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress),
                (snxJSConnector as any).stakingThalesContract.getBaseReward(walletAddress),
                (snxJSConnector as any).stakingThalesContract.getTotalBonus(walletAddress),
                (snxJSConnector as any).stakingThalesContract.getSNXBonus(walletAddress),
                (snxJSConnector as any).stakingThalesContract.getAMMBonus(walletAddress),
                (snxJSConnector as any).stakingThalesContract.getThalesRoyaleBonus(walletAddress),
            ]);

            const stakingRewards: StakingReward = {
                closingDate: Number(lastPeriodTimeStamp) * 1000 + Number(durationPeriod) * 1000,
                period: period,
                isClaimPaused: paused,
                hasClaimRights: Number(baseRewards) > 0 || Number(totalBonus) > 0,
                claimed:
                    (await (snxJSConnector as any).stakingThalesContract.getLastPeriodOfClaimedRewards(
                        walletAddress
                    )) === period,
                rewards: Number(rewards),
                rawRewards: rewards,
                baseRewards: Number(baseRewards),
                totalBonus: Number(totalBonus),
                snxBonus: Number(snxBonus),
                ammBonus: Number(ammBonus),
                thalesRoyaleBonus: Number(thalesRoyaleBonus),
                maxSnxBonusPercentage: Number(maxSNXRewardsPercentage),
                maxAmmBonusPercentage: Number(maxAMMVolumeRewardsPercentage),
                maxThalesRoyaleBonusPercentage: Number(maxThalesRoyaleRewardsPercentage),
                maxSnxBonus: Number(baseRewards) * Number(maxSNXRewardsPercentage),
                maxAmmBonus: Number(baseRewards) * Number(maxAMMVolumeRewardsPercentage),
                maxThalesRoyaleBonus: Number(baseRewards) * Number(maxThalesRoyaleRewardsPercentage),
            };
            return stakingRewards;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useStakingRewardsQuery;
