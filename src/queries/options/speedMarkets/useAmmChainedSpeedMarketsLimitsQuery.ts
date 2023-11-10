import { ZERO_ADDRESS } from 'constants/network';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { AmmChainedSpeedMarketsLimits } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';

const MAX_BUYIN_COLLATERAL_CONVERSION_BUFFER = 1;

const useChainedAmmSpeedMarketsLimitsQuery = (
    networkId: Network,
    walletAddress?: string,
    options?: UseQueryOptions<AmmChainedSpeedMarketsLimits>
) => {
    return useQuery<AmmChainedSpeedMarketsLimits>(
        QUERY_KEYS.BinaryOptions.ChainedSpeedMarketsLimits(networkId, walletAddress),
        async () => {
            const ammChainedSpeedMarketsLimits: AmmChainedSpeedMarketsLimits = {
                minChainedMarkets: 0,
                maxChainedMarkets: 0,
                minBuyinAmount: 0,
                maxBuyinAmount: 0,
                minTimeFrame: 0,
                maxTimeFrame: 0,
                risk: { current: 0, max: 0 },
                payoutMultiplier: 0,
            };
            const { speedMarketsDataContract } = snxJSConnector;
            if (speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getChainedSpeedMarketsAMMParameters(
                    walletAddress || ZERO_ADDRESS
                );

                ammChainedSpeedMarketsLimits.minChainedMarkets = Number(ammParams.minChainedMarkets);
                ammChainedSpeedMarketsLimits.maxChainedMarkets = Number(ammParams.maxChainedMarkets);
                ammChainedSpeedMarketsLimits.minBuyinAmount = Math.ceil(
                    coinFormatter(ammParams.minBuyinAmount, networkId)
                );
                ammChainedSpeedMarketsLimits.maxBuyinAmount =
                    coinFormatter(ammParams.maxBuyinAmount, networkId) - MAX_BUYIN_COLLATERAL_CONVERSION_BUFFER;
                ammChainedSpeedMarketsLimits.minTimeFrame = Number(ammParams.minTimeFrame);
                ammChainedSpeedMarketsLimits.maxTimeFrame = Number(ammParams.maxTimeFrame);
                ammChainedSpeedMarketsLimits.risk = {
                    current: coinFormatter(ammParams.risk.current, networkId),
                    max: coinFormatter(ammParams.risk.max, networkId),
                };
                ammChainedSpeedMarketsLimits.payoutMultiplier = bigNumberFormatter(ammParams.payoutMultiplier);
            }

            return ammChainedSpeedMarketsLimits;
        },
        {
            ...options,
        }
    );
};

export default useChainedAmmSpeedMarketsLimitsQuery;
