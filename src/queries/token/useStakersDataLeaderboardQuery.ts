import { THALES_CURRENCY } from 'constants/currency';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';
import { UseQueryOptions, useQuery } from 'react-query';
import thalesData from 'thales-data';
import { Staker, Stakers } from 'types/governance';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';

type StakerContractLeaderboardData = {
    rank?: number;
    share?: number;
    stakingMultiplier: number;
    userLPBasePointsPerRound: number;
    userRoundBonusPoints: number;
    userTradingBasePointsPerRound: number;
    userVaultBasePointsPerRound: number;
    estimatedRewards?: string;
};

type StakerWithLeaderboardData = Staker & StakerContractLeaderboardData;

type StakersWithLeaderboardDataAndGlobalPoints = {
    leaderboard: StakerWithLeaderboardData[];
    globalPoints: number;
    globalVaults: number;
    globalLp: number;
    globalTrading: number;
    bonusRewards: number;
    closingDate: number;
};

export type StakersWithLeaderboardData = StakerWithLeaderboardData[];

const useStakersDataLeaderboardQuery = (
    walletAddress: string,
    network: Network,
    round: number,
    lastPeriod: boolean,
    options?: UseQueryOptions<StakersWithLeaderboardDataAndGlobalPoints>
) => {
    return useQuery<StakersWithLeaderboardDataAndGlobalPoints>(
        QUERY_KEYS.Token.StakersLeaderboardData(walletAddress, network, round),
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
                        lastPeriod
                            ? stakingBonusRewardsManager?.getEstimatedCurrentStakersLeaderboardData(
                                  stakersAddresses,
                                  round
                              )
                            : stakingBonusRewardsManager?.getStakersLeaderboardData(stakersAddresses, round)
                    );
                }

                const [bonusRewards, lastPeriodTimestamp, durationPeriod] = await Promise.all([
                    stakingThalesContract?.periodExtraReward(),
                    stakingThalesContract?.lastPeriodTimeStamp(),
                    stakingThalesContract?.durationPeriod(),
                ]);

                const closingDate = Number(lastPeriodTimestamp) * 1000 + Number(durationPeriod) * 1000;

                const stakersDataFromContract = await Promise.all(calls);
                let globalPoints = 0;
                let globalTrading = 0;
                let globalLp = 0;
                let globalVaults = 0;

                let finalData: StakersWithLeaderboardData = stakersDataFromContract.flat().map((item, index) => {
                    const vaultPoints = item?.userVaultPointsPerRound
                        ? bigNumberFormatter(item.userVaultPointsPerRound) * 0.4
                        : 0;

                    globalVaults = globalVaults + (vaultPoints * 4) / 0.4;

                    const lpPoints = item?.userLPPointsPerRound
                        ? bigNumberFormatter(item.userLPPointsPerRound) * 0.4
                        : 0;
                    globalLp = globalLp + (lpPoints * 2) / 0.4;

                    const tradingPoints = item?.userTradingBasePointsPerRound
                        ? bigNumberFormatter(item.userTradingBasePointsPerRound)
                        : 0;

                    globalTrading = globalTrading + tradingPoints;

                    const userTotalPoints =
                        (vaultPoints + lpPoints + tradingPoints) * (bigNumberFormatter(item.stakingMultiplier) / 4 + 1);
                    globalPoints = globalPoints + userTotalPoints;

                    return {
                        ...stakersOnlyWithSomeStakingAmount[index],
                        stakingMultiplier: item?.stakingMultiplier
                            ? bigNumberFormatter(item.stakingMultiplier) / 4 + 1
                            : 0,
                        userLPBasePointsPerRound: lpPoints,
                        userTradingBasePointsPerRound: tradingPoints,
                        userVaultBasePointsPerRound: vaultPoints,
                        userRoundBonusPoints: userTotalPoints,
                        estimatedRewards: '',
                    };
                });

                finalData = orderBy(finalData, 'userRoundBonusPoints', 'desc');

                const finalDataWithRank = finalData.map((item, index) => {
                    return {
                        ...item,
                        rank: index + 1,
                        share: item.userRoundBonusPoints / globalPoints,
                        estimatedRewards: formatCurrencyWithKey(
                            THALES_CURRENCY,
                            (item.userRoundBonusPoints / globalPoints) * bigNumberFormatter(bonusRewards),
                            2
                        ),
                    };
                });

                return {
                    leaderboard: finalDataWithRank,
                    globalPoints,
                    globalLp,
                    globalTrading,
                    globalVaults,
                    bonusRewards: bigNumberFormatter(bonusRewards),
                    closingDate,
                };
            } catch (e) {
                console.log('Error ', e);
                return {
                    leaderboard: [],
                    globalPoints: 0,
                    globalLp: 0,
                    globalTrading: 0,
                    globalVaults: 0,
                    bonusRewards: 0,
                    closingDate: Date.now(),
                };
            }
        },
        {
            ...options,
        }
    );
};

export default useStakersDataLeaderboardQuery;
