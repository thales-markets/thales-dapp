import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

export type AmmSpeedMarketsLimits = {
    maxBuyinAmount: number;
    minBuyinAmount: number;
    minimalTimeToMaturity: number;
    maximalTimeToMaturity: number;
};

const useAmmSpeedMarketsLimitsQuery = (networkId: Network, options?: UseQueryOptions<AmmSpeedMarketsLimits>) => {
    return useQuery<AmmSpeedMarketsLimits>(
        QUERY_KEYS.BinaryOptions.SpeedMarkets(networkId),
        async () => {
            const ammSpeedMarkets: AmmSpeedMarketsLimits = {
                minBuyinAmount: 0,
                maxBuyinAmount: 0,
                minimalTimeToMaturity: 0,
                maximalTimeToMaturity: 0,
            };
            const { speedMarketsAMMContract } = snxJSConnector;
            if (speedMarketsAMMContract) {
                const [
                    minBuyinAmount,
                    maxBuyinAmount,
                    minimalTimeToMaturity,
                    maximalTimeToMaturity,
                ] = await Promise.all([
                    speedMarketsAMMContract.minBuyinAmount(),
                    speedMarketsAMMContract.maxBuyinAmount(),
                    speedMarketsAMMContract.minimalTimeToMaturity(),
                    speedMarketsAMMContract.maximalTimeToMaturity(),
                ]);

                ammSpeedMarkets.minBuyinAmount = bigNumberFormatter(minBuyinAmount);
                ammSpeedMarkets.maxBuyinAmount = bigNumberFormatter(maxBuyinAmount);
                ammSpeedMarkets.minimalTimeToMaturity = bigNumberFormatter(minimalTimeToMaturity, 0);
                ammSpeedMarkets.maximalTimeToMaturity = bigNumberFormatter(maximalTimeToMaturity, 0);
            }

            return ammSpeedMarkets;
        },
        {
            ...options,
        }
    );
};

export default useAmmSpeedMarketsLimitsQuery;