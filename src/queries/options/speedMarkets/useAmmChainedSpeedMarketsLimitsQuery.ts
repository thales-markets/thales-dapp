import { ZERO_ADDRESS } from 'constants/network';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { BigNumber } from 'ethers';
import { UseQueryOptions, useQuery } from 'react-query';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { AmmChainedSpeedMarketsLimits } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';

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
                maxProfitPerIndividualMarket: 0,
                minTimeFrame: 0,
                maxTimeFrame: 0,
                risk: { current: 0, max: 0 },
                payoutMultipliers: [],
                maxPriceDelayForResolvingSec: 0,
                whitelistedAddress: false,
            };

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
                ammChainedSpeedMarketsLimits.maxBuyinAmount = coinFormatter(chainedAmmParams.maxBuyinAmount, networkId);

                ammChainedSpeedMarketsLimits.maxProfitPerIndividualMarket = coinFormatter(
                    chainedAmmParams.maxProfitPerIndividualMarket,
                    networkId
                );

                ammChainedSpeedMarketsLimits.minTimeFrame = Number(chainedAmmParams.minTimeFrame);
                ammChainedSpeedMarketsLimits.maxTimeFrame = Number(chainedAmmParams.maxTimeFrame);
                ammChainedSpeedMarketsLimits.risk = {
                    current: coinFormatter(chainedAmmParams.risk.current, networkId),
                    max: coinFormatter(chainedAmmParams.risk.max, networkId),
                };
                ammChainedSpeedMarketsLimits.payoutMultipliers = chainedAmmParams.payoutMultipliers.map(
                    (payoutMultiplier: BigNumber) => bigNumberFormatter(payoutMultiplier)
                );
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
