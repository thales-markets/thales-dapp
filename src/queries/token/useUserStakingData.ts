import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/token';
import { ZERO_ADDRESS } from 'constants/network';
import { UserStakingData } from 'types/token';

const useUserStakingDataQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<UserStakingData | undefined>
) => {
    return useQuery<UserStakingData | undefined>(
        QUERY_KEYS.Token.UserStakingData(walletAddress, networkId),
        async () => {
            const userStakingData: UserStakingData = {
                thalesStaked: 0,
                hasClaimRights: false,
                claimed: false,
                isUnstaking: false,
                lastUnstakeTime: Date.now(),
                unstakingAmount: 0,
                delegatedVolume: ZERO_ADDRESS,
                rewards: 0,
                baseRewards: 0,
                totalBonus: 0,
                snxBonus: 0,
                ammBonus: 0,
                maxSnxBonus: 0,
                maxAmmBonus: 0,
                maxThalesRoyaleBonus: 0,
                snxStaked: 0,
                ammVolume: 0,
                thalesAmmVolume: 0,
                rangedAmmVolume: 0,
                sportsAmmVolume: 0,
                escrowedBalance: 0,
                claimable: 0,
                rawClaimable: '0',
                isUserLPing: false,
                isPaused: false,
                unstakeDurationPeriod: 7 * 24 * 60 * 60, // one week
                mergeAccountEnabled: true,
            };
            try {
                const { stakingDataContract, sportLiquidityPoolContract } = snxJSConnector;

                if (stakingDataContract && sportLiquidityPoolContract) {
                    const [contractStakingData, contractUserStakingData, isUserLPing] = await Promise.all([
                        stakingDataContract.getStakingData(),
                        stakingDataContract.getUserStakingData(walletAddress),
                        sportLiquidityPoolContract.isUserLPing(walletAddress),
                    ]);

                    userStakingData.thalesStaked =
                        bigNumberFormatter(contractUserStakingData.thalesStaked) < BALANCE_THRESHOLD
                            ? 0
                            : bigNumberFormatter(contractUserStakingData.thalesStaked);
                    userStakingData.hasClaimRights = bigNumberFormatter(contractUserStakingData.rewards) > 0;
                    userStakingData.claimed =
                        Number(contractUserStakingData.lastPeriodOfClaimedRewards) ===
                        Number(contractStakingData.periodsOfStaking);
                    userStakingData.isUnstaking = contractUserStakingData.unstaking;
                    userStakingData.lastUnstakeTime = Number(contractUserStakingData.lastUnstakeTime) * 1000;
                    userStakingData.unstakingAmount = bigNumberFormatter(contractUserStakingData.unstakingAmount);
                    userStakingData.delegatedVolume = contractUserStakingData.delegatedVolume;
                    userStakingData.rewards = bigNumberFormatter(contractUserStakingData.rewards);
                    userStakingData.baseRewards = bigNumberFormatter(contractUserStakingData.baseRewards);
                    userStakingData.totalBonus = bigNumberFormatter(contractUserStakingData.totalBonus);
                    userStakingData.snxBonus = bigNumberFormatter(contractUserStakingData.snxBonus);
                    userStakingData.ammBonus = bigNumberFormatter(contractUserStakingData.ammBonus);
                    userStakingData.maxSnxBonus =
                        (bigNumberFormatter(contractUserStakingData.baseRewards) *
                            Number(contractStakingData.maxSNXRewardsPercentage)) /
                        100;
                    userStakingData.maxAmmBonus =
                        (bigNumberFormatter(contractUserStakingData.baseRewards) *
                            Number(contractStakingData.maxAMMVolumeRewardsPercentage)) /
                        100;
                    userStakingData.maxThalesRoyaleBonus =
                        (bigNumberFormatter(contractUserStakingData.baseRewards) *
                            Number(contractStakingData.maxThalesRoyaleRewardsPercentage)) /
                        100;
                    userStakingData.snxStaked = bigNumberFormatter(contractUserStakingData.snxStaked);
                    userStakingData.ammVolume = bigNumberFormatter(contractUserStakingData.ammVolume);
                    userStakingData.thalesAmmVolume = bigNumberFormatter(contractUserStakingData.thalesAmmVolume);
                    userStakingData.rangedAmmVolume = bigNumberFormatter(contractUserStakingData.rangedAmmVolume);
                    userStakingData.sportsAmmVolume = bigNumberFormatter(contractUserStakingData.sportsAmmVolume);
                    userStakingData.escrowedBalance = bigNumberFormatter(contractUserStakingData.escrowedBalance);
                    userStakingData.claimable = bigNumberFormatter(contractUserStakingData.claimable);
                    userStakingData.rawClaimable = contractUserStakingData.claimable;
                    userStakingData.isUserLPing = isUserLPing;
                    userStakingData.isPaused = contractStakingData.paused;
                    userStakingData.unstakeDurationPeriod = Number(contractStakingData.unstakeDurationPeriod) * 1000;
                    userStakingData.mergeAccountEnabled = contractStakingData.mergeAccountEnabled;

                    return userStakingData;
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

export default useUserStakingDataQuery;
