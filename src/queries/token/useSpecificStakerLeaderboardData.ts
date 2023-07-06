import QUERY_KEYS from 'constants/queryKeys';
import { UseQueryOptions, useQuery } from 'react-query';
import { StakerContractLeaderboardData } from 'types/governance';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

const useSpecificStakerLeaderboardData = (
    walletAddress: string,
    round: number,
    options?: UseQueryOptions<StakerContractLeaderboardData | null>
) => {
    return useQuery<StakerContractLeaderboardData | null>(
        QUERY_KEYS.Token.SpecificStakerLeaderboardData(walletAddress),
        async () => {
            try {
                const { stakingBonusRewardsManager } = snxJSConnector as any;

                const contractData = await stakingBonusRewardsManager?.getStakersLeaderboardData(
                    [walletAddress],
                    round
                );

                return {
                    share: contractData[0]?.share ? bigNumberFormatter(contractData[0].share) : 0,
                    stakingMultiplier: contractData[0]?.stakingMultiplier
                        ? bigNumberFormatter(contractData[0].stakingMultiplier) + 1
                        : 0,
                    userLPBasePointsPerRound: contractData[0]?.userLPBasePointsPerRound
                        ? bigNumberFormatter(contractData[0].userLPBasePointsPerRound)
                        : 0,
                    userRoundBonusPoints: contractData[0]?.userRoundBonusPoints
                        ? bigNumberFormatter(contractData[0].userRoundBonusPoints)
                        : 0,
                    userTradingBasePointsPerRound: contractData[0]?.userTradingBasePointsPerRound
                        ? bigNumberFormatter(contractData[0].userTradingBasePointsPerRound)
                        : 0,
                    userVaultBasePointsPerRound: contractData[0]?.userVaultBasePointsPerRound
                        ? bigNumberFormatter(contractData[0].userVaultBasePointsPerRound)
                        : 0,
                    totalPoints:
                        (bigNumberFormatter(contractData[0].stakingMultiplier) + 1) *
                        bigNumberFormatter(contractData[0].userRoundBonusPoints),
                };
            } catch (e) {
                console.log('Error ', e);
                return null;
            }
        },
        {
            ...options,
        }
    );
};

export default useSpecificStakerLeaderboardData;
