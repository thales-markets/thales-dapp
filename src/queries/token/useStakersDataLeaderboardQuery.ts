import { THALES_CURRENCY } from 'constants/currency';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';
import { UseQueryOptions, useQuery } from 'react-query';
import thalesData from 'thales-data';
import { Stakers, StakersWithLeaderboardData } from 'types/governance';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';

const useStakersDataLeaderboardQuery = (
    network: Network,
    round: number,
    options?: UseQueryOptions<StakersWithLeaderboardData>
) => {
    return useQuery<StakersWithLeaderboardData>(
        QUERY_KEYS.Token.StakersLeaderboardData(network),
        async () => {
            try {
                const BATCH_SIZE = 800;
                const MIN_STAKING_AMOUNT = 0.01;

                const stakers: Stakers = await thalesData.binaryOptions.stakers({
                    network,
                });

                const stakersOnlyWithSomeStakingAmount =
                    stakers && stakers.filter((staker) => staker.stakedAmount > MIN_STAKING_AMOUNT);

                const { stakingBonusRewardsManager } = snxJSConnector as any;
                const { stakingThalesContract } = snxJSConnector;

                const calls = [];

                for (let i = 0; i < stakersOnlyWithSomeStakingAmount.length; i += BATCH_SIZE) {
                    const stakersAddresses = stakersOnlyWithSomeStakingAmount
                        .slice(i, i + BATCH_SIZE)
                        .map((staker) => staker.id);
                    calls.push(
                        stakingBonusRewardsManager?.getEstimatedCurrentStakersLeaderboardData(stakersAddresses, round)
                    );
                }

                const bonusRewards = await stakingThalesContract?.periodExtraReward();

                const stakersDataFromContract = await Promise.all(calls);
                let globalPoints = 0;

                let finalData: StakersWithLeaderboardData = stakersDataFromContract.flat().map((item, index) => {
                    const vaultPoints = item?.userVaultPointsPerRound
                        ? bigNumberFormatter(item.userVaultPointsPerRound)
                        : 0;

                    const lpPoints = item?.userLPPointsPerRound ? bigNumberFormatter(item.userLPPointsPerRound) : 0;
                    const tradingPoints = item?.userTradingBasePointsPerRound
                        ? bigNumberFormatter(item.userTradingBasePointsPerRound)
                        : 0;
                    const userTotalPoints = vaultPoints + lpPoints + tradingPoints;
                    globalPoints = globalPoints + userTotalPoints;

                    return {
                        ...stakersOnlyWithSomeStakingAmount[index],
                        stakingMultiplier: item?.stakingMultiplier ? bigNumberFormatter(item.stakingMultiplier) + 1 : 0,
                        userLPBasePointsPerRound: item?.userLPPointsPerRound
                            ? bigNumberFormatter(item.userLPPointsPerRound)
                            : 0,
                        userTradingBasePointsPerRound: item?.userTradingBasePointsPerRound
                            ? bigNumberFormatter(item.userTradingBasePointsPerRound)
                            : 0,
                        userVaultBasePointsPerRound: item?.userVaultPointsPerRound
                            ? bigNumberFormatter(item.userVaultPointsPerRound)
                            : 0,
                        userRoundBonusPoints: userTotalPoints,
                        estimatedRewards: '',
                    };
                });

                finalData = orderBy(finalData, 'userRoundBonusPoints', 'desc');

                const finalDataWithRank = finalData.map((item, index) => {
                    return {
                        ...item,
                        rank: index + 1,
                        estimatedRewards: formatCurrencyWithKey(
                            THALES_CURRENCY,
                            (item.userRoundBonusPoints / globalPoints) * bigNumberFormatter(bonusRewards),
                            2
                        ),
                    };
                });

                return finalDataWithRank;
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
