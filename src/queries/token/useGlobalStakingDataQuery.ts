import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter } from 'thales-utils';
import { GlobalStakingData } from 'types/token';
import CCIPCollector from 'utils/contracts/ccipCollector';

const useGlobalStakingDataQuery = (options?: UseQueryOptions<GlobalStakingData | undefined>) => {
    return useQuery<GlobalStakingData | undefined>(
        QUERY_KEYS.Token.GlobalStakingData(),
        async () => {
            const stakingData: GlobalStakingData = {
                totalStakedAmount: 0,
                thalesApy: 0,
                feeApy: 0,
            };
            try {
                // Thales staked - Base
                const baseAnkrProvider = new ethers.providers.JsonRpcProvider(
                    `https://rpc.ankr.com/base/${process.env.REACT_APP_ANKR_PROJECT_ID}`,
                    Network.Base
                );

                const CCIPCollectorContract = new ethers.Contract(
                    CCIPCollector.addresses[Network.Base],
                    CCIPCollector.abi,
                    baseAnkrProvider
                );

                const period = Number(await CCIPCollectorContract.period()) - 1;
                const [
                    price,
                    stakedAmount,
                    escrowedAmount,
                    calculatedRevenueForPeriod,
                    baseRewardsPool,
                    bonusRewardsPool,
                ] = await Promise.all([
                    fetch(`${generalConfig.API_URL}/token/price`),
                    CCIPCollectorContract.calculatedStakedAmountForPeriod(Number(period)),
                    CCIPCollectorContract.calculatedEscrowedAmountForPeriod(Number(period)),
                    CCIPCollectorContract.calculatedRevenueForPeriod(Number(period)),
                    CCIPCollectorContract.baseRewardsPerPeriod(),
                    CCIPCollectorContract.extraRewardsPerPeriod(),
                ]);

                const revShare = period <= 3 ? 30000 : bigNumberFormatter(calculatedRevenueForPeriod);
                const thalesTokenPrice = Number(await price.text());

                stakingData.feeApy =
                    (revShare * 52 * 100) /
                    ((bigNumberFormatter(stakedAmount) + bigNumberFormatter(escrowedAmount)) * thalesTokenPrice);

                const thalesRewardsAPY =
                    ((bigNumberFormatter(baseRewardsPool) + bigNumberFormatter(bonusRewardsPool)) * 52 * 100) /
                    (bigNumberFormatter(stakedAmount) + bigNumberFormatter(escrowedAmount));

                stakingData.feeApy = Number((Math.round(stakingData.feeApy * 100) / 100).toFixed(2));
                stakingData.thalesApy = Number((Math.round(thalesRewardsAPY * 100) / 100).toFixed(2));

                stakingData.totalStakedAmount = bigNumberFormatter(stakedAmount) + bigNumberFormatter(escrowedAmount);

                return stakingData;
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

export default useGlobalStakingDataQuery;
