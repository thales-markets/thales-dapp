import { THALES_CURRENCY } from 'constants/currency';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';
import { UseQueryOptions, useQuery } from 'react-query';
import thalesData from 'thales-data';
import { Staker, Stakers } from 'types/governance';
import { bigNumberFormatter, formatCurrencyWithKey } from 'thales-utils';
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

export type StakingData = {
    estimationForOneThales: number;
    globalVaults: number;
    globalLp: number;
    globalTrading: number;
    tradingPoints: number;
    vaultPoints: number;
    lpPoints: number;
    globalPoints: number;
    tradingMultiplier: number;
    vaultMultiplier: number;
    lpMultiplier: number;
    maxStakingMultiplier: number;
};

type StakersWithLeaderboardDataAndGlobalPoints = {
    leaderboard: StakerWithLeaderboardData[];
    data: StakingData;
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

                const [
                    bonusRewardsRaw,
                    lastPeriodTimestamp,
                    durationPeriod,
                    tradingMultiplierRaw,
                    lpMultiplierRaw,
                    vaultMultiplierRaw,
                    maxStakingMultiplierRaw,
                ] = await Promise.all([
                    stakingThalesContract?.periodExtraReward(),
                    stakingThalesContract?.lastPeriodTimeStamp(),
                    stakingThalesContract?.durationPeriod(),
                    stakingBonusRewardsManager?.tradingMultiplier(),
                    stakingBonusRewardsManager?.lpMultiplier(),
                    stakingBonusRewardsManager?.vaultsMultiplier(),
                    stakingBonusRewardsManager?.maxStakingMultiplier(),
                ]);

                const [bonusRewards, tradingMultiplier, lpMultiplier, vaultMultiplier, maxStakingMultiplier] = [
                    bigNumberFormatter(bonusRewardsRaw),
                    bigNumberFormatter(tradingMultiplierRaw),
                    bigNumberFormatter(lpMultiplierRaw),
                    bigNumberFormatter(vaultMultiplierRaw),
                    bigNumberFormatter(maxStakingMultiplierRaw),
                ];

                const closingDate = Number(lastPeriodTimestamp) * 1000 + Number(durationPeriod) * 1000;

                const stakersDataFromContract = await Promise.all(calls);
                let globalPoints = 0;
                let globalTrading = 0;
                let globalLp = 0;
                let globalVaults = 0;

                let finalData: StakersWithLeaderboardData = stakersDataFromContract.flat().map((item, index) => {
                    const stakingThalesMult = bigNumberFormatter(item.stakingMultiplier) + 1;
                    const userVaultsVolume = bigNumberFormatter(item.userVaultPointsPerRound) / vaultMultiplier;
                    globalVaults = globalVaults + userVaultsVolume;
                    const vaultPoints = userVaultsVolume * vaultMultiplier;

                    const userLPVolume = bigNumberFormatter(item.userLPPointsPerRound) / lpMultiplier;
                    globalLp = globalLp + userLPVolume;
                    const lpPoints = userLPVolume * lpMultiplier;

                    const userTradingVolume =
                        bigNumberFormatter(item.userTradingBasePointsPerRound) / tradingMultiplier;
                    globalTrading = globalTrading + userTradingVolume;
                    const tradingPoints = userTradingVolume * tradingMultiplier;

                    const userTotalPoints = (vaultPoints + lpPoints + tradingPoints) * stakingThalesMult;
                    globalPoints = globalPoints + userTotalPoints;

                    return {
                        ...stakersOnlyWithSomeStakingAmount[index],
                        stakingMultiplier: item?.stakingMultiplier ? stakingThalesMult : 0,
                        userLPBasePointsPerRound: lpPoints,
                        userTradingBasePointsPerRound: tradingPoints,
                        userVaultBasePointsPerRound: vaultPoints,
                        userRoundBonusPoints: userTotalPoints,
                        estimatedRewards: '',
                    };
                });

                finalData = orderBy(finalData, 'userRoundBonusPoints', 'desc');

                const estimationForOneThales = globalPoints / bonusRewards;

                const finalDataWithRank = finalData.map((item, index) => {
                    return {
                        ...item,
                        rank: index + 1,
                        share: item.userRoundBonusPoints / globalPoints,
                        estimatedRewards: formatCurrencyWithKey(
                            THALES_CURRENCY,
                            (item.userRoundBonusPoints / globalPoints) * bonusRewards,
                            2
                        ),
                    };
                });

                return {
                    leaderboard: finalDataWithRank,
                    data: {
                        estimationForOneThales,
                        globalPoints,
                        globalLp,
                        globalVaults,
                        globalTrading,
                        lpMultiplier: lpMultiplier,
                        tradingMultiplier: tradingMultiplier,
                        vaultMultiplier: vaultMultiplier,
                        vaultPoints: globalVaults * vaultMultiplier,
                        tradingPoints: globalTrading * tradingMultiplier,
                        lpPoints: globalLp * lpMultiplier,
                        maxStakingMultiplier: maxStakingMultiplier + 1,
                    },

                    bonusRewards: bonusRewards,
                    closingDate,
                };
            } catch (e) {
                console.log('Error ', e);
                return {
                    leaderboard: [],
                    data: {
                        estimationForOneThales: 0,
                        globalPoints: 0,
                        globalLp: 0,
                        globalVaults: 0,
                        globalTrading: 0,
                        lpMultiplier: 0,
                        tradingMultiplier: 0,
                        vaultMultiplier: 0,
                        vaultPoints: 0,
                        tradingPoints: 0,
                        lpPoints: 0,
                        maxStakingMultiplier: 0,
                    },
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
