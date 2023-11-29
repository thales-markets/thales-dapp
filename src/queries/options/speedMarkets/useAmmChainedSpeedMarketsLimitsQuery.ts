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
                maxPriceDelayForResolvingSec: 0,
                whitelistedAddress: false,
            };
            // TODO: remove after contarct deploy on all chains
            if ([Network.Arbitrum, Network.OptimismMainnet, Network.PolygonMainnet].includes(networkId)) {
                return ammChainedSpeedMarketsLimits;
            }
            const { speedMarketsDataContract } = snxJSConnector;
            if (speedMarketsDataContract) {
                const [chainedAmmParams, ammParams] = await Promise.all([
                    speedMarketsDataContract.getChainedSpeedMarketsAMMParameters(walletAddress || ZERO_ADDRESS),
                    speedMarketsDataContract.getSpeedMarketsAMMParameters(walletAddress || ZERO_ADDRESS),
                ]);

                ammChainedSpeedMarketsLimits.minChainedMarkets = Number(chainedAmmParams.minChainedMarkets);
                ammChainedSpeedMarketsLimits.maxChainedMarkets = Number(chainedAmmParams.maxChainedMarkets);
                ammChainedSpeedMarketsLimits.minBuyinAmount = Math.ceil(
                    coinFormatter(chainedAmmParams.minBuyinAmount, networkId)
                );
                ammChainedSpeedMarketsLimits.maxBuyinAmount =
                    coinFormatter(chainedAmmParams.maxBuyinAmount, networkId) - MAX_BUYIN_COLLATERAL_CONVERSION_BUFFER;
                ammChainedSpeedMarketsLimits.minTimeFrame = Number(chainedAmmParams.minTimeFrame);
                ammChainedSpeedMarketsLimits.maxTimeFrame = Number(chainedAmmParams.maxTimeFrame);
                ammChainedSpeedMarketsLimits.risk = {
                    current: coinFormatter(chainedAmmParams.risk.current, networkId),
                    max: coinFormatter(chainedAmmParams.risk.max, networkId),
                };
                ammChainedSpeedMarketsLimits.payoutMultiplier = bigNumberFormatter(chainedAmmParams.payoutMultiplier);
                ammChainedSpeedMarketsLimits.maxPriceDelayForResolvingSec = Number(
                    ammParams.maximumPriceDelayForResolving
                );
                ammChainedSpeedMarketsLimits.whitelistedAddress = ammParams.isAddressWhitelisted;
            }

            return ammChainedSpeedMarketsLimits;
        },
        {
            ...options,
        }
    );
};

export default useChainedAmmSpeedMarketsLimitsQuery;
