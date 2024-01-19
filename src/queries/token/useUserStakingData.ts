import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter, getDefaultDecimalsForNetwork } from 'thales-utils';
import { BALANCE_THRESHOLD } from 'constants/token';
import { ZERO_ADDRESS } from 'constants/network';
import { UserStakingData } from 'types/token';
import { Network } from 'enums/network';

const useUserStakingDataQuery = (
    walletAddress: string,
    networkId: Network,
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
                feeRewards: 0,
                escrowedBalance: 0,
                claimable: 0,
                rawClaimable: '0',
                isPaused: false,
                unstakeDurationPeriod: 7 * 24 * 60 * 60, // one week
                mergeAccountEnabled: true,
            };
            try {
                const { stakingDataContract, stakingThalesContract } = snxJSConnector;
                if (stakingDataContract && stakingThalesContract) {
                    const [
                        contractStakingData,
                        contractUserStakingData,
                        feeRewards,
                        closingPeriodInProgress,
                    ] = await Promise.all([
                        stakingDataContract.getStakingData(),
                        stakingDataContract.getUserStakingData(walletAddress),
                        stakingThalesContract.getRewardFeesAvailable(walletAddress),
                        stakingThalesContract.closingPeriodInProgress(),
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
                    userStakingData.feeRewards = bigNumberFormatter(
                        feeRewards,
                        getDefaultDecimalsForNetwork(networkId)
                    );
                    userStakingData.escrowedBalance = bigNumberFormatter(contractUserStakingData.escrowedBalance);
                    userStakingData.claimable = bigNumberFormatter(contractUserStakingData.claimable);
                    userStakingData.rawClaimable = contractUserStakingData.claimable;

                    userStakingData.isPaused = contractStakingData.paused || closingPeriodInProgress;
                    userStakingData.unstakeDurationPeriod = Number(contractStakingData.unstakeDurationPeriod) * 1000;
                    userStakingData.mergeAccountEnabled = contractStakingData.mergeAccountEnabled;

                    const totalEscrowBalanceNotIncludedInStaking = bigNumberFormatter(
                        contractStakingData.totalEscrowBalanceNotIncludedInStaking
                    );
                    const totalEscrowedRewards = bigNumberFormatter(contractStakingData.totalEscrowedRewards);

                    const totalStaked =
                        bigNumberFormatter(contractStakingData.totalStakedAmount) +
                        totalEscrowedRewards -
                        totalEscrowBalanceNotIncludedInStaking;
                    const baseRewardsPool = bigNumberFormatter(contractStakingData.baseRewardsPool);

                    const baseRewards =
                        (baseRewardsPool * (userStakingData.thalesStaked + userStakingData.escrowedBalance)) /
                        totalStaked;

                    userStakingData.baseRewards =
                        userStakingData.baseRewards === 0 ? baseRewards : userStakingData.baseRewards;

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
