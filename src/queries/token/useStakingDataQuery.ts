import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { StakingData } from 'types/token';

const useStakingDataQuery = (networkId: NetworkId, options?: UseQueryOptions<StakingData | undefined>) => {
    return useQuery<StakingData | undefined>(
        QUERY_KEYS.Token.StakingData(networkId),
        async () => {
            const stakingData: StakingData = {
                period: 0,
                unstakeDurationPeriod: 7 * 24 * 60 * 60, // one week
                closingDate: Date.now(),
                isPaused: false,
                baseRewardsPool: 0,
                bonusRewardsPool: 0,
                totalStakedAmount: 0,
                maxSnxBonusPercentage: 0,
                maxAmmBonusPercentage: 0,
                maxThalesRoyaleBonusPercentage: 0,
                maxBonusRewardsPercentage: 0,
                snxVolumeRewardsMultiplier: 0,
                ammVolumeRewardsMultiplier: 0,
                canClosePeriod: false,
                mergeAccountEnabled: true,
                totalEscrowBalanceNotIncludedInStaking: 0,
                totalEscrowedRewards: 0,
            };
            try {
                const { stakingDataContract } = snxJSConnector;
                if (stakingDataContract) {
                    const contractStakingData = await stakingDataContract.getStakingData();

                    stakingData.period = contractStakingData.periodsOfStaking;
                    stakingData.unstakeDurationPeriod = Number(contractStakingData.unstakeDurationPeriod) * 1000;
                    stakingData.closingDate =
                        Number(contractStakingData.lastPeriodTimeStamp) * 1000 +
                        Number(contractStakingData.durationPeriod) * 1000;
                    stakingData.isPaused = contractStakingData.paused;
                    stakingData.baseRewardsPool = bigNumberFormatter(contractStakingData.baseRewardsPool);
                    stakingData.bonusRewardsPool = bigNumberFormatter(contractStakingData.bonusRewardsPool);
                    stakingData.totalStakedAmount = bigNumberFormatter(contractStakingData.totalStakedAmount);
                    stakingData.maxSnxBonusPercentage = Number(contractStakingData.maxSNXRewardsPercentage);
                    stakingData.maxAmmBonusPercentage = Number(contractStakingData.maxAMMVolumeRewardsPercentage);
                    stakingData.maxThalesRoyaleBonusPercentage = Number(
                        contractStakingData.maxThalesRoyaleRewardsPercentage
                    );
                    stakingData.maxBonusRewardsPercentage =
                        Number(contractStakingData.maxSNXRewardsPercentage) +
                        Number(contractStakingData.maxAMMVolumeRewardsPercentage) +
                        Number(contractStakingData.maxThalesRoyaleRewardsPercentage);
                    stakingData.snxVolumeRewardsMultiplier = Number(contractStakingData.SNXVolumeRewardsMultiplier);
                    stakingData.ammVolumeRewardsMultiplier = Number(contractStakingData.AMMVolumeRewardsMultiplier);
                    stakingData.canClosePeriod = contractStakingData.canClosePeriod;
                    stakingData.mergeAccountEnabled = contractStakingData.mergeAccountEnabled;
                    stakingData.totalEscrowBalanceNotIncludedInStaking = bigNumberFormatter(
                        contractStakingData.totalEscrowBalanceNotIncludedInStaking
                    );
                    stakingData.totalEscrowedRewards = bigNumberFormatter(contractStakingData.totalEscrowedRewards);

                    return stakingData;
                }
            } catch (e) {
                console.log(e);
            }

            return undefined;
        },
        {
            ...options,
        }
    );
};

export default useStakingDataQuery;
