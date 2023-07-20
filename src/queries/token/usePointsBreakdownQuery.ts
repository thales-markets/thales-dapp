import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { Network } from 'enums/network';
import { getDefaultDecimalsForNetwork } from 'utils/network';

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

            const DECIMALS = getDefaultDecimalsForNetwork(networkId);

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
                        bigNumberFormatter(vaultsPoints, DECIMALS) / bigNumberFormatter(vaultsMultiplier)
                    ),
                    lpVolume: formatCurrencyWithKey(
                        USD_SIGN,
                        bigNumberFormatter(lpPoints, DECIMALS) / bigNumberFormatter(lpMultiplier)
                    ),
                    tradingVolume: formatCurrencyWithKey(
                        USD_SIGN,
                        bigNumberFormatter(tradingPoints) / bigNumberFormatter(tradingMultiplier)
                    ),
                    vaultsMultiplier: bigNumberFormatter(vaultsMultiplier),
                    lpMultiplier: bigNumberFormatter(lpMultiplier),
                    tradingMultiplier: bigNumberFormatter(tradingMultiplier),
                    stakingMultiplier: truncToDecimals(bigNumberFormatter(stakingMultiplier) + 1, 2),
                    vaultsPoints: truncToDecimals(bigNumberFormatter(vaultsPoints), 2),
                    lpPoints: truncToDecimals(bigNumberFormatter(lpPoints), 2),
                    tradingPoints: truncToDecimals(bigNumberFormatter(tradingPoints), 2),
                    thalesStaked: formatCurrencyWithKey(THALES_CURRENCY, bigNumberFormatter(stakedBalance)),
                    thalesDivider: formatCurrencyWithKey(THALES_CURRENCY, Number(thalesDivider)),
                    totalPoints: truncToDecimals(
                        bigNumberFormatter(vaultsPoints) +
                            bigNumberFormatter(lpPoints) +
                            bigNumberFormatter(tradingPoints)
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
