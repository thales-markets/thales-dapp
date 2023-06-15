import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';

export type OverviewData = {
    period: number;
    userPoints: string;
    totalPoints: string;
    bonusRewards: string;
    share: string;
    estimatedRewards: string;
};

const useStakingOverviewQuery = (walletAddress: string, options?: UseQueryOptions<OverviewData | undefined>) => {
    return useQuery<OverviewData | undefined>(
        QUERY_KEYS.Token.StakingOverview(walletAddress),
        async () => {
            const { stakingThalesContract } = snxJSConnector;
            const { stakingBonusRewardsManager } = snxJSConnector;
            console.log(stakingBonusRewardsManager);
            try {
                const period = (await stakingThalesContract?.periodsOfStaking()) - 1;
                const [userPoints, totalPoints, bonusRewards, share] = await Promise.all([
                    stakingBonusRewardsManager?.userRoundBonusPoints(walletAddress, period),
                    stakingBonusRewardsManager?.totalRoundBonusPoints(period),
                    stakingThalesContract?.periodExtraReward(),
                    stakingBonusRewardsManager?.getUserRoundBonusShare(walletAddress, period),
                ]);

                return {
                    period: Number(period),
                    userPoints: truncToDecimals(bigNumberFormatter(userPoints)),
                    totalPoints: truncToDecimals(bigNumberFormatter(totalPoints)),
                    bonusRewards: truncToDecimals(bigNumberFormatter(bonusRewards)),
                    share: truncToDecimals(bigNumberFormatter(share)),
                    estimatedRewards: formatCurrencyWithKey(
                        THALES_CURRENCY,
                        bigNumberFormatter(share) * bigNumberFormatter(bonusRewards),
                        2
                    ),
                };
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

export default useStakingOverviewQuery;
