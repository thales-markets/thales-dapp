import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { Network } from 'enums/network';

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

export const DEFAULT_POINTS_BREAKDOWN_DATA = {
    vaultsVolume: '-',
    lpVolume: '-',
    tradingVolume: '-',
    vaultsMultiplier: 0,
    tradingMultiplier: 0,
    lpMultiplier: 0,
    stakingMultiplier: '-',

    vaultsPoints: '-',
    lpPoints: '-',
    tradingPoints: '-',

    thalesStaked: '-',
    thalesDivider: '-',
    totalPoints: '-',
};

const usePointsBreakdownQuery = (
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<PointsData | undefined>
) => {
    return useQuery<PointsData | undefined>(
        QUERY_KEYS.Token.PointsBreakdown(walletAddress, networkId),
        async () => {
            const { stakingThalesContract } = snxJSConnector;
            const { stakingBonusRewardsManager } = snxJSConnector;

            if (!walletAddress) {
                return DEFAULT_POINTS_BREAKDOWN_DATA;
            }

            try {
                const period = await stakingThalesContract?.periodsOfStaking();
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
                return DEFAULT_POINTS_BREAKDOWN_DATA;
            }
        },
        {
            ...options,
        }
    );
};

export default usePointsBreakdownQuery;
