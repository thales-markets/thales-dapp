import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { THALES_CURRENCY, USD_SIGN } from 'constants/currency';

export type PointsData = {
    vaultsVolume: string;
    lpVolume: string;
    tradingVolume: string;
    vaultsMultiplier: number;
    tradingMultiplier: number;
    lpMultiplier: number;
    stakingMultiplier: string;

    vaultsPoints: string;
    lpPoints: string;
    tradingPoints: string;

    thalesStaked: string;
    thalesDivider: string;
    totalPoints: string;
};

const usePointsBreakdownQuery = (walletAddress: string, options?: UseQueryOptions<PointsData | undefined>) => {
    return useQuery<PointsData | undefined>(
        QUERY_KEYS.Token.PointsBreakdown(walletAddress),
        async () => {
            const { stakingThalesContract } = snxJSConnector;
            const { stakingBonusRewardsManager } = snxJSConnector;
            console.log(stakingBonusRewardsManager);
            try {
                const period = (await stakingThalesContract?.periodsOfStaking()) - 1;
                const [
                    vaultsVolume,
                    lpVolume,
                    tradingVolume,
                    vaultsMultiplier,
                    lpMultiplier,
                    tradingMultiplier,
                    stakingMultiplier,
                    stakedBalance,
                    thalesDivider,
                    totalPoints,
                ] = await Promise.all([
                    stakingBonusRewardsManager?.userVaultBasePointsPerRound(walletAddress, period),
                    stakingBonusRewardsManager?.userLPBasePointsPerRound(walletAddress, period),
                    stakingBonusRewardsManager?.userTradingBasePointsPerRound(walletAddress, period),
                    stakingBonusRewardsManager?.vaultsMultiplier(),
                    stakingBonusRewardsManager?.lpMultiplier(),
                    stakingBonusRewardsManager?.tradingMultiplier(),
                    stakingBonusRewardsManager?.getStakingMultiplier(walletAddress),
                    stakingThalesContract?.stakedBalanceOf(walletAddress),
                    stakingBonusRewardsManager?.stakingBaseDivider(),
                    stakingBonusRewardsManager?.userRoundBonusPoints(walletAddress, period),
                ]);

                console.log('stakedBalance: ', bigNumberFormatter(stakedBalance));
                console.log('thalesDivider: ', Number(thalesDivider));

                return {
                    vaultsVolume: formatCurrencyWithKey(USD_SIGN, bigNumberFormatter(vaultsVolume)),
                    lpVolume: formatCurrencyWithKey(USD_SIGN, bigNumberFormatter(lpVolume)),
                    tradingVolume: formatCurrencyWithKey(USD_SIGN, bigNumberFormatter(tradingVolume)),
                    vaultsMultiplier: bigNumberFormatter(vaultsMultiplier),
                    lpMultiplier: bigNumberFormatter(lpMultiplier),
                    tradingMultiplier: bigNumberFormatter(tradingMultiplier),
                    stakingMultiplier: truncToDecimals(bigNumberFormatter(stakingMultiplier) + 1, 2),
                    vaultsPoints: truncToDecimals(
                        bigNumberFormatter(vaultsMultiplier) * bigNumberFormatter(vaultsVolume),
                        2
                    ),
                    lpPoints: truncToDecimals(bigNumberFormatter(lpMultiplier) * bigNumberFormatter(lpVolume), 2),
                    tradingPoints: truncToDecimals(
                        bigNumberFormatter(tradingMultiplier) * bigNumberFormatter(tradingVolume),
                        2
                    ),
                    thalesStaked: formatCurrencyWithKey(THALES_CURRENCY, bigNumberFormatter(stakedBalance)),
                    thalesDivider: formatCurrencyWithKey(THALES_CURRENCY, Number(thalesDivider)),
                    totalPoints: truncToDecimals(bigNumberFormatter(totalPoints)),
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

export default usePointsBreakdownQuery;
