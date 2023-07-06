import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import thalesData from 'thales-data';
import { Stakers, StakersWithLeaderboardData } from 'types/governance';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

const useStakersDataLeaderboardQuery = (
    network: Network,
    round: number,
    startFromUserNumber?: number,
    endOnUserNumber?: number,
    options?: UseQueryOptions<StakersWithLeaderboardData>
) => {
    return useQuery<StakersWithLeaderboardData>(
        QUERY_KEYS.Token.StakersLeaderboardData(network),
        async () => {
            try {
                const BATCH_SIZE = 300;
                const MIN_STAKING_AMOUNT = 0.01;

                const stakers: Stakers = await thalesData.binaryOptions.stakers({
                    network,
                });

                let stakersOnlyWithSomeStakingAmount =
                    stakers && stakers.filter((staker) => staker.stakedAmount > MIN_STAKING_AMOUNT);

                const { stakingBonusRewardsManager } = snxJSConnector as any;

                const calls = [];

                if (startFromUserNumber || endOnUserNumber) {
                    if (startFromUserNumber && endOnUserNumber) {
                        stakersOnlyWithSomeStakingAmount = stakersOnlyWithSomeStakingAmount.slice(
                            startFromUserNumber,
                            endOnUserNumber
                        );
                    } else if (startFromUserNumber && !endOnUserNumber) {
                        stakersOnlyWithSomeStakingAmount.splice(0, startFromUserNumber);
                    }
                }

                for (let i = 0; i < stakersOnlyWithSomeStakingAmount.length; i += BATCH_SIZE) {
                    const stakersAddresses = stakersOnlyWithSomeStakingAmount
                        .slice(i, i + BATCH_SIZE)
                        .map((staker) => staker.id);
                    calls.push(stakingBonusRewardsManager?.getStakersLeaderboardData(stakersAddresses, round));
                }

                const stakersDataFromContract = await Promise.all(calls);

                const finalData: StakersWithLeaderboardData = stakersDataFromContract.flat().map((item, index) => {
                    return {
                        ...stakersOnlyWithSomeStakingAmount[index],
                        share: item?.share ? bigNumberFormatter(item.share) : 0,
                        stakingMultiplier: item?.stakingMultiplier ? bigNumberFormatter(item.stakingMultiplier) : 0,
                        userLPBasePointsPerRound: item?.userLPBasePointsPerRound
                            ? bigNumberFormatter(item.userLPBasePointsPerRound)
                            : 0,
                        userRoundBonusPoints: item?.userRoundBonusPoints
                            ? bigNumberFormatter(item.userRoundBonusPoints)
                            : 0,
                        userTradingBasePointsPerRound: item?.userTradingBasePointsPerRound
                            ? bigNumberFormatter(item.userTradingBasePointsPerRound)
                            : 0,
                        userVaultBasePointsPerRound: item?.userVaultBasePointsPerRound
                            ? bigNumberFormatter(item.userVaultBasePointsPerRound)
                            : 0,
                    };
                });

                console.log('finalData ', finalData);

                return finalData;
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        {
            ...options,
        }
    );
};

export default useStakersDataLeaderboardQuery;
