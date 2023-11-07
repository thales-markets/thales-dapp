import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { formatCurrency, formatCurrencyWithKey, bigNumberFormatter } from 'thales-utils';
import { THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { Network } from 'enums/network';

export type PointsData = {
    vaultsVolume: string;
    lpVolume: string;
    tradingVolume: string;
    vaultsMultiplier: number;
    tradingMultiplier: number;
    lpMultiplier: number;
    stakingMultiplier: string | number;

    vaultsPoints: string | number;
    lpPoints: string | number;
    tradingPoints: string | number;

    thalesStaked: string;
    thalesDivider: string;
    totalPoints: string | number;
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
                    vaultsPoints,
                    lpPoints,
                    tradingPoints,
                    vaultsMultiplier,
                    lpMultiplier,
                    tradingMultiplier,
                    stakingMultiplier,
                    stakedBalance,
                    thalesDivider,
                ] = await Promise.all([
                    stakingBonusRewardsManager?.getEstimatedCurrentVaultPoints(walletAddress),
                    stakingBonusRewardsManager?.getEstimatedCurrentLPsPoints(walletAddress),
                    stakingBonusRewardsManager?.userTradingBasePointsPerRound(walletAddress, period),
                    stakingBonusRewardsManager?.vaultsMultiplier(),
                    stakingBonusRewardsManager?.lpMultiplier(),
                    stakingBonusRewardsManager?.tradingMultiplier(),
                    stakingBonusRewardsManager?.getStakingMultiplier(walletAddress),
                    stakingThalesContract?.stakedBalanceOf(walletAddress),
                    stakingBonusRewardsManager?.stakingBaseDivider(),
                ]);

                return {
                    vaultsVolume: formatCurrencyWithKey(
                        USD_SIGN,
                        bigNumberFormatter(vaultsPoints) / bigNumberFormatter(vaultsMultiplier)
                    ),
                    lpVolume: formatCurrencyWithKey(
                        USD_SIGN,
                        bigNumberFormatter(lpPoints) / bigNumberFormatter(lpMultiplier)
                    ),
                    tradingVolume: formatCurrencyWithKey(
                        USD_SIGN,
                        bigNumberFormatter(tradingPoints) / bigNumberFormatter(tradingMultiplier)
                    ),
                    vaultsMultiplier: bigNumberFormatter(vaultsMultiplier),
                    lpMultiplier: bigNumberFormatter(lpMultiplier),
                    tradingMultiplier: bigNumberFormatter(tradingMultiplier),
                    stakingMultiplier: formatCurrency(bigNumberFormatter(stakingMultiplier) + 1),
                    vaultsPoints: formatCurrency(bigNumberFormatter(vaultsPoints)),
                    lpPoints: formatCurrency(bigNumberFormatter(lpPoints)),
                    tradingPoints: formatCurrency(bigNumberFormatter(tradingPoints)),
                    thalesStaked: formatCurrencyWithKey(THALES_CURRENCY, bigNumberFormatter(stakedBalance)),
                    thalesDivider: formatCurrencyWithKey(THALES_CURRENCY, Number(thalesDivider)),
                    totalPoints: formatCurrency(
                        (bigNumberFormatter(vaultsPoints) +
                            bigNumberFormatter(lpPoints) +
                            bigNumberFormatter(tradingPoints)) *
                            (bigNumberFormatter(stakingMultiplier) + 1)
                    ),
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
