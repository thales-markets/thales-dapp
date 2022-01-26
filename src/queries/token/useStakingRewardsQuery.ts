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
                (snxJSConnector as any).stakingThalesContract.canClosePeriod(),
                (snxJSConnector as any).stakingThalesContract.maxSNXRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.maxAMMVolumeRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.maxThalesRoyaleRewardsPercentage(),
                (snxJSConnector as any).stakingThalesContract.AMMVolumeRewardsMultiplier(),
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
                hasClaimRights: bigNumberFormatter(rewards) > 0,
                claimed:
                    (await (snxJSConnector as any).stakingThalesContract.getLastPeriodOfClaimedRewards(
                        walletAddress
                    )) === period,
                canClosePeriod,
                rewards: bigNumberFormatter(rewards),
                rawRewards: rewards,
                baseRewards: bigNumberFormatter(baseRewards),
                totalBonus: bigNumberFormatter(totalBonus),
                snxBonus: bigNumberFormatter(snxBonus),
                ammBonus: bigNumberFormatter(ammBonus),
                thalesRoyaleBonus: Number(thalesRoyaleBonus),
                maxSnxBonusPercentage: Number(maxSNXRewardsPercentage),
                maxAmmBonusPercentage: Number(maxAMMVolumeRewardsPercentage),
                maxThalesRoyaleBonusPercentage: Number(maxThalesRoyaleRewardsPercentage),
                ammVolumeRewardsMultiplier: Number(ammVolumeRewardsMultiplier),
                maxSnxBonus: (bigNumberFormatter(baseRewards) * Number(maxSNXRewardsPercentage)) / 100,
                maxAmmBonus: (bigNumberFormatter(baseRewards) * Number(maxAMMVolumeRewardsPercentage)) / 100,
                maxThalesRoyaleBonus:
                    (bigNumberFormatter(baseRewards) * Number(maxThalesRoyaleRewardsPercentage)) / 100,
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
