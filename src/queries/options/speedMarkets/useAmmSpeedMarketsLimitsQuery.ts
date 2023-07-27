import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

type RiskPerAsset = { currency: string; current: number; max: number };

export type AmmSpeedMarketsLimits = {
    maxBuyinAmount: number;
    minBuyinAmount: number;
    minimalTimeToMaturity: number;
    maximalTimeToMaturity: number;
    maxPriceDelaySec: number;
    risksPerAsset: RiskPerAsset[];
    lpFee: number;
    safeBoxImpact: number;
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
                maxPriceDelaySec: 0,
                risksPerAsset: [],
                lpFee: 0,
                safeBoxImpact: 0,
            };
            const { speedMarketsAMMContract } = snxJSConnector;
            if (speedMarketsAMMContract) {
                const [
                    minBuyinAmount,
                    maxBuyinAmount,
                    minTimeToMaturity,
                    maxTimeToMaturity,
                    maxPriceDelay,
                    currentRiskForETH,
                    maxRiskForETH,
                    currentRiskForBTC,
                    maxRiskForBTC,
                    lpFee,
                    safeBoxImpact,
                ] = await Promise.all([
                    speedMarketsAMMContract.minBuyinAmount(),
                    speedMarketsAMMContract.maxBuyinAmount(),
                    speedMarketsAMMContract.minimalTimeToMaturity(),
                    speedMarketsAMMContract.maximalTimeToMaturity(),
                    speedMarketsAMMContract.maximumPriceDelay(),
                    speedMarketsAMMContract.currentRiskPerAsset(
                        ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.ETH)
                    ),
                    speedMarketsAMMContract.maxRiskPerAsset(ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.ETH)),
                    speedMarketsAMMContract.currentRiskPerAsset(
                        ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.BTC)
                    ),
                    speedMarketsAMMContract.maxRiskPerAsset(ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.BTC)),
                    speedMarketsAMMContract.lpFee(),
                    speedMarketsAMMContract.safeBoxImpact(),
                ]);

                ammSpeedMarkets.minBuyinAmount = bigNumberFormatter(minBuyinAmount);
                ammSpeedMarkets.maxBuyinAmount = bigNumberFormatter(maxBuyinAmount);
                ammSpeedMarkets.minimalTimeToMaturity = Number(minTimeToMaturity);
                ammSpeedMarkets.maximalTimeToMaturity = Number(maxTimeToMaturity);
                ammSpeedMarkets.maxPriceDelaySec = Number(maxPriceDelay);
                ammSpeedMarkets.risksPerAsset = [
                    {
                        currency: CRYPTO_CURRENCY_MAP.ETH,
                        current: bigNumberFormatter(currentRiskForETH),
                        max: bigNumberFormatter(maxRiskForETH),
                    },
                    {
                        currency: CRYPTO_CURRENCY_MAP.BTC,
                        current: bigNumberFormatter(currentRiskForBTC),
                        max: bigNumberFormatter(maxRiskForBTC),
                    },
                ];
                ammSpeedMarkets.lpFee = bigNumberFormatter(lpFee);
                ammSpeedMarkets.safeBoxImpact = bigNumberFormatter(safeBoxImpact);
            }

            return ammSpeedMarkets;
        },
        {
            ...options,
        }
    );
};

export default useAmmSpeedMarketsLimitsQuery;
