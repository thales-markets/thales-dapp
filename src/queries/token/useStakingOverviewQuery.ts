import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'thales-utils';
import { Network } from 'enums/network';

export type OverviewData = {
    period: number;
    bonusRewards: number;
    fixedPeriodReward: number;
    maxThalesMultiplier: number;
    vaultsMultiplier: number;
    lpMultiplier: number;
    tradingMultiplier: number;
};

const useStakingOverviewQuery = (
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<OverviewData | undefined>
) => {
    return useQuery<OverviewData | undefined>(
        QUERY_KEYS.Token.StakingOverview(walletAddress, networkId),
        async () => {
            const { stakingThalesContract } = snxJSConnector;
            const { stakingBonusRewardsManager } = snxJSConnector;
            try {
                const [
                    period,
                    bonusRewards,
                    fixedPeriodReward,
                    maxThalesMultiplier,
                    vaultsMultiplier,
                    lpMultiplier,
                    tradingMultiplier,
                ] = await Promise.all([
                    stakingThalesContract?.periodsOfStaking(),
                    stakingThalesContract?.periodExtraReward(),
                    stakingThalesContract?.currentPeriodRewards(),
                    stakingBonusRewardsManager?.maxStakingMultiplier(),
                    stakingBonusRewardsManager?.vaultsMultiplier(),
                    stakingBonusRewardsManager?.lpMultiplier(),
                    stakingBonusRewardsManager?.tradingMultiplier(),
                ]);

                return {
                    period: Number(period),
                    bonusRewards: bigNumberFormatter(bonusRewards),
                    fixedPeriodReward: bigNumberFormatter(fixedPeriodReward),
                    maxThalesMultiplier: bigNumberFormatter(maxThalesMultiplier) + 1,
                    vaultsMultiplier: bigNumberFormatter(vaultsMultiplier),
                    lpMultiplier: bigNumberFormatter(lpMultiplier),
                    tradingMultiplier: bigNumberFormatter(tradingMultiplier),
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
