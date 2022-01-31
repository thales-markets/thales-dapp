import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { StakingReward } from 'types/token';
import { bigNumberFormatter } from 'utils/formatters/ethers';

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
                canClosePeriod,
                maxSNXRewardsPercentage,
                maxAMMVolumeRewardsPercentage,
                maxThalesRoyaleRewardsPercentage,
                ammVolumeRewardsMultiplier,
                snxVolumeRewardsMultiplier,
                baseRewardsPool,
                bonusRewardsPool,
            ] = await Promise.all([
                (snxJSConnector as any).stakingThalesContract.paused(),
                (snxJSConnector as any).stakingThalesContract.periodsOfStaking(),
                (snxJSConnector as any).stakingThalesContract.lastPeriodTimeStamp(),
                (snxJSConnector as any).stakingThalesContract.durationPeriod(),
                (snxJSConnector as any).stakingThalesContract.canClosePeriod(),
                (snxJSConnector as any).stakingThalesContract.maxSNXRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.maxAMMVolumeRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.maxThalesRoyaleRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.AMMVolumeRewardsMultiplier(),
                (snxJSConnector as any).stakingThalesContract.SNXVolumeRewardsMultiplier(),
                (snxJSConnector as any).stakingThalesContract.fixedPeriodReward(),
                (snxJSConnector as any).stakingThalesContract.periodExtraReward(),
            ]);

            const stakingRewards: StakingReward = {
                isClaimPaused: paused,
                period: period,
                closingDate: Number(lastPeriodTimeStamp) * 1000 + Number(durationPeriod) * 1000,
                canClosePeriod,
                maxSnxBonusPercentage: Number(maxSNXRewardsPercentage),
                maxAmmBonusPercentage: Number(maxAMMVolumeRewardsPercentage),
                maxThalesRoyaleBonusPercentage: Number(maxThalesRoyaleRewardsPercentage),
                bonusRewardsPoolPercentage:
                    Number(maxSNXRewardsPercentage) +
                    Number(maxAMMVolumeRewardsPercentage) +
                    Number(maxThalesRoyaleRewardsPercentage),
                ammVolumeRewardsMultiplier: Number(ammVolumeRewardsMultiplier),
                snxVolumeRewardsMultiplier: Number(snxVolumeRewardsMultiplier),
                baseRewardsPool: bigNumberFormatter(baseRewardsPool),
                bonusRewardsPool: bigNumberFormatter(bonusRewardsPool),

                hasClaimRights: false,
                claimed: false,
                rewards: 0,
                baseRewards: 0,
                totalBonus: 0,
                snxBonus: 0,
                ammBonus: 0,
                thalesRoyaleBonus: 0,
                maxSnxBonus: 0,
                maxAmmBonus: 0,
                maxThalesRoyaleBonus: 0,
                snxStaked: 0,
                ammVolume: 0,
            };

            if (walletAddress !== '') {
                const [
                    rewards,
                    baseRewards,
                    totalBonus,
                    snxBonus,
                    ammBonus,
                    thalesRoyaleBonus,
                    snxStaked,
                    ammVolume,
                ] = await Promise.all([
                    (snxJSConnector as any).stakingThalesContract.getRewardsAvailable(walletAddress),
                    (snxJSConnector as any).stakingThalesContract.getBaseReward(walletAddress),
                    (snxJSConnector as any).stakingThalesContract.getTotalBonus(walletAddress),
                    (snxJSConnector as any).stakingThalesContract.getSNXBonus(walletAddress),
                    (snxJSConnector as any).stakingThalesContract.getAMMBonus(walletAddress),
                    (snxJSConnector as any).stakingThalesContract.getThalesRoyaleBonus(walletAddress),
                    (snxJSConnector as any).stakingThalesContract.getSNXStaked(walletAddress),
                    (snxJSConnector as any).stakingThalesContract.getAMMVolume(walletAddress),
                ]);

                stakingRewards.hasClaimRights = bigNumberFormatter(rewards) > 0;
                stakingRewards.claimed =
                    Number(
                        await (snxJSConnector as any).stakingThalesContract.getLastPeriodOfClaimedRewards(walletAddress)
                    ) === Number(period);
                stakingRewards.rewards = bigNumberFormatter(rewards);
                stakingRewards.baseRewards = bigNumberFormatter(baseRewards);
                stakingRewards.totalBonus = bigNumberFormatter(totalBonus);
                stakingRewards.snxBonus = bigNumberFormatter(snxBonus);
                stakingRewards.ammBonus = bigNumberFormatter(ammBonus);
                stakingRewards.thalesRoyaleBonus = bigNumberFormatter(thalesRoyaleBonus);
                stakingRewards.maxSnxBonus = (bigNumberFormatter(baseRewards) * Number(maxSNXRewardsPercentage)) / 100;
                stakingRewards.maxAmmBonus =
                    (bigNumberFormatter(baseRewards) * Number(maxAMMVolumeRewardsPercentage)) / 100;
                stakingRewards.maxThalesRoyaleBonus =
                    (bigNumberFormatter(baseRewards) * Number(maxThalesRoyaleRewardsPercentage)) / 100;
                stakingRewards.snxStaked = bigNumberFormatter(snxStaked);
                stakingRewards.ammVolume = bigNumberFormatter(ammVolume);
            }

            return stakingRewards;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useStakingRewardsQuery;
