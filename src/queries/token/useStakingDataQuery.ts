import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from 'thales-utils';
import { StakingData } from 'types/token';
import { Network } from 'enums/network';

const useStakingDataQuery = (networkId: Network, options?: UseQueryOptions<StakingData | undefined>) => {
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
                canClosePeriod: false,
                closingPeriodInProgress: false,
                mergeAccountEnabled: true,
                totalEscrowBalanceNotIncludedInStaking: 0,
                totalEscrowedRewards: 0,
            };
            try {
                const { stakingDataContract, stakingThalesContract } = snxJSConnector;
                if (stakingDataContract && stakingThalesContract) {
                    const [contractStakingData, closingPeriodInProgress] = await Promise.all([
                        stakingDataContract.getStakingData(),
                        stakingThalesContract.closingPeriodInProgress(),
                    ]);

                    stakingData.period = contractStakingData.periodsOfStaking;
                    stakingData.unstakeDurationPeriod = Number(contractStakingData.unstakeDurationPeriod) * 1000;
                    stakingData.closingDate =
                        Number(contractStakingData.lastPeriodTimeStamp) * 1000 +
                        Number(contractStakingData.durationPeriod) * 1000;
                    stakingData.isPaused = contractStakingData.paused || closingPeriodInProgress;
                    stakingData.baseRewardsPool = bigNumberFormatter(contractStakingData.baseRewardsPool);
                    stakingData.bonusRewardsPool = bigNumberFormatter(contractStakingData.bonusRewardsPool);
                    stakingData.totalStakedAmount = bigNumberFormatter(contractStakingData.totalStakedAmount);
                    stakingData.canClosePeriod = contractStakingData.canClosePeriod;
                    stakingData.mergeAccountEnabled = contractStakingData.mergeAccountEnabled;
                    stakingData.totalEscrowBalanceNotIncludedInStaking = bigNumberFormatter(
                        contractStakingData.totalEscrowBalanceNotIncludedInStaking
                    );
                    stakingData.totalEscrowedRewards = bigNumberFormatter(contractStakingData.totalEscrowedRewards);
                    stakingData.closingPeriodInProgress = closingPeriodInProgress;

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
