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
    share: number;
    estimatedRewards: string;
};

const useStakingOverviewQuery = (walletAddress: string, options?: UseQueryOptions<OverviewData | undefined>) => {
    return useQuery<OverviewData | undefined>(
        QUERY_KEYS.Token.StakingOverview(walletAddress),
        async () => {
            const { stakingThalesContract } = snxJSConnector;
            const { stakingBonusRewardsManager } = snxJSConnector;
            try {
                const period = await stakingThalesContract?.periodsOfStaking();
                const [userPoints, totalPoints, bonusRewards, share] = await Promise.all([
                    stakingBonusRewardsManager?.userRoundBonusPoints(walletAddress, period),
                    stakingBonusRewardsManager?.totalRoundBonusPoints(period),
                    stakingThalesContract?.periodExtraReward(),
                    stakingBonusRewardsManager?.getUserRoundBonusShare(walletAddress, period),
                ]);

                console.log('share: ', bigNumberFormatter(share));
                return {
                    period: Number(period),
                    userPoints: formatCurrencyWithKey('', bigNumberFormatter(userPoints)),
                    totalPoints: formatCurrencyWithKey('', bigNumberFormatter(totalPoints)),
                    bonusRewards: formatCurrencyWithKey('', bigNumberFormatter(bonusRewards)),
                    share: bigNumberFormatter(share),
                    estimatedRewards:
                        truncToDecimals(bigNumberFormatter(share) * bigNumberFormatter(bonusRewards)) +
                        '/' +
                        formatCurrencyWithKey(THALES_CURRENCY, bigNumberFormatter(bonusRewards), 2),
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
