import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

export type AmmSpeedMarkets = {
    maxBuyinAmount: number;
    minBuyinAmount: number;
};

const useAmmSpeedMarketsQuery = (networkId: Network, options?: UseQueryOptions<AmmSpeedMarkets>) => {
    return useQuery<AmmSpeedMarkets>(
        QUERY_KEYS.BinaryOptions.SpeedMarkets(networkId),
        async () => {
            const ammSpeedMarkets: AmmSpeedMarkets = {
                maxBuyinAmount: 0,
                minBuyinAmount: 0,
            };
            const { speedMarketsAMMContract } = snxJSConnector;
            if (speedMarketsAMMContract) {
                const [maxBuyinAmount, minBuyinAmount] = await Promise.all([
                    speedMarketsAMMContract.maxBuyinAmount(),
                    speedMarketsAMMContract.minBuyinAmount(),
                ]);

                ammSpeedMarkets.maxBuyinAmount = bigNumberFormatter(maxBuyinAmount);
                ammSpeedMarkets.minBuyinAmount = bigNumberFormatter(minBuyinAmount);
            }

            return ammSpeedMarkets;
        },
        {
            ...options,
        }
    );
};

export default useAmmSpeedMarketsQuery;
