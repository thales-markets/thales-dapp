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
                baseRewards: 0,
                extraRewards: 0,
            };
            try {
                // Thales staked - Base
                const baseAnkrProvider = new ethers.providers.JsonRpcProvider(
                    `https://base-mainnet.chainnodes.org/${process.env.REACT_APP_CHAINNODE_PROJECT_ID}`,
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

                const feeAPR =
                    (revShare * 52 * 100) /
                    ((bigNumberFormatter(stakedAmount) + bigNumberFormatter(escrowedAmount)) * thalesTokenPrice);

                const thalesRewardsAPR =
                    ((bigNumberFormatter(baseRewardsPool) + bigNumberFormatter(bonusRewardsPool)) * 52 * 100) /
                    (bigNumberFormatter(stakedAmount) + bigNumberFormatter(escrowedAmount));

                stakingData.feeApy = aprToApy(feeAPR);
                stakingData.thalesApy = aprToApy(thalesRewardsAPR);

                stakingData.feeApy = Number((Math.round(stakingData.feeApy * 100) / 100).toFixed(2));
                stakingData.thalesApy = Number((Math.round(stakingData.thalesApy * 100) / 100).toFixed(2));

                stakingData.totalStakedAmount = bigNumberFormatter(stakedAmount) + bigNumberFormatter(escrowedAmount);
                stakingData.baseRewards = bigNumberFormatter(baseRewardsPool);
                stakingData.extraRewards = bigNumberFormatter(bonusRewardsPool);

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

const APR_FREQUENCY = 52;
const aprToApy = (interest: number) => ((1 + interest / 100 / APR_FREQUENCY) ** APR_FREQUENCY - 1) * 100;

export default useGlobalStakingDataQuery;
