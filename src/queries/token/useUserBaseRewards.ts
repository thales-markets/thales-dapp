import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/token';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';

export type UserStakingData = {
    thalesStaked: string;
    totalStaked: string;
    share: string;
    baseRewards: string;
};

const useUserBaseRewardsQuery = (walletAddress: string, options?: UseQueryOptions<UserStakingData | undefined>) => {
    return useQuery<UserStakingData | undefined>(
        QUERY_KEYS.Token.UserBaseRewards(walletAddress),
        async () => {
            try {
                const { stakingDataContract } = snxJSConnector;

                const [contractStakingData, contractUserStakingData] = await Promise.all([
                    stakingDataContract?.getStakingData(),
                    stakingDataContract?.getUserStakingData(walletAddress),
                ]);

                const thalesStaked =
                    bigNumberFormatter(contractUserStakingData.thalesStaked) < BALANCE_THRESHOLD
                        ? 0
                        : bigNumberFormatter(contractUserStakingData.thalesStaked);

                const escrowedBalance = bigNumberFormatter(contractUserStakingData.escrowedBalance);

                const totalEscrowBalanceNotIncludedInStaking = bigNumberFormatter(
                    contractStakingData.totalEscrowBalanceNotIncludedInStaking
                );
                const totalEscrowedRewards = bigNumberFormatter(contractStakingData.totalEscrowedRewards);

                const totalStaked =
                    bigNumberFormatter(contractStakingData.totalStakedAmount) +
                    totalEscrowedRewards -
                    totalEscrowBalanceNotIncludedInStaking;

                const baseRewardsPool = bigNumberFormatter(contractStakingData.baseRewardsPool);

                const baseRewards = (baseRewardsPool * (thalesStaked + escrowedBalance)) / totalStaked;

                return {
                    thalesStaked: formatCurrencyWithKey(THALES_CURRENCY, thalesStaked + escrowedBalance),
                    totalStaked: formatCurrencyWithKey(THALES_CURRENCY, totalStaked),
                    share: formatPercentage((thalesStaked + escrowedBalance) / totalStaked),
                    baseRewards: formatCurrencyWithKey(THALES_CURRENCY, baseRewards),
                };
            } catch (e) {
                console.log(e);
            }
        },
        {
            ...options,
        }
    );
};

export default useUserBaseRewardsQuery;
