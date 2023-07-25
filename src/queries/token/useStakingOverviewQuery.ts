import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { Network } from 'enums/network';

export type OverviewData = {
    bonusRewards: string;
    fixedPeriodReward: string | number;
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
            try {
                const [period, bonusRewards, fixedPeriodReward] = await Promise.all([
                    stakingThalesContract?.periodsOfStaking(),
                    stakingThalesContract?.periodExtraReward(),
                    stakingThalesContract?.fixedPeriodReward(),
                ]);

                return {
                    period: Number(period),
                    bonusRewards: formatCurrencyWithKey('', bigNumberFormatter(bonusRewards)),
                    fixedPeriodReward: formatCurrency(bigNumberFormatter(fixedPeriodReward)),
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
