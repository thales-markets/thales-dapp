import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { OPTIONS_POSITIONS_MAP, SIDE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import { AmmSpeedMarketsLimits, OptionSide } from 'types/options';
import { bigNumberFormatter, coinFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

const MAX_BUYIN_COLLATERAL_CONVERSION_BUFFER = 10;

const useAmmSpeedMarketsLimitsQuery = (
    networkId: Network,
    walletAddress?: string,
    options?: UseQueryOptions<AmmSpeedMarketsLimits>
) => {
    return useQuery<AmmSpeedMarketsLimits>(
        QUERY_KEYS.BinaryOptions.SpeedMarketsLimits(networkId, walletAddress),
        async () => {
            const ammSpeedMarketsLimits: AmmSpeedMarketsLimits = {
                minBuyinAmount: 0,
                maxBuyinAmount: 0,
                minimalTimeToMaturity: 0,
                maximalTimeToMaturity: 0,
                maxPriceDelayForResolvingSec: 0,
                risksPerAsset: [],
                risksPerAssetAndDirection: [],
                lpFee: 0,
                safeBoxImpact: 0,
                whitelistedAddress: false,
            };
            const { speedMarketsAMMContract } = snxJSConnector;
            if (speedMarketsAMMContract) {
                const [
                    minBuyinAmount,
                    maxBuyinAmount,
                    minTimeToMaturity,
                    maxTimeToMaturity,
                    maxPriceDelayForResolving,
                    currentRiskForETH,
                    maxRiskForETH,
                    currentRiskForBTC,
                    maxRiskForBTC,
                    directionalRiskForETH,
                    directionalRiskForBTC,
                    lpFee,
                    safeBoxImpact,
                    whitelistedAddress,
                ] = await Promise.all([
                    speedMarketsAMMContract.minBuyinAmount(),
                    speedMarketsAMMContract.maxBuyinAmount(),
                    speedMarketsAMMContract.minimalTimeToMaturity(),
                    speedMarketsAMMContract.maximalTimeToMaturity(),
                    speedMarketsAMMContract.maximumPriceDelayForResolving(),
                    speedMarketsAMMContract.currentRiskPerAsset(
                        ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.ETH)
                    ),
                    speedMarketsAMMContract.maxRiskPerAsset(ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.ETH)),
                    speedMarketsAMMContract.currentRiskPerAsset(
                        ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.BTC)
                    ),
                    speedMarketsAMMContract.maxRiskPerAsset(ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.BTC)),
                    speedMarketsAMMContract.getDirectionalRiskPerAsset(
                        ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.ETH)
                    ),
                    speedMarketsAMMContract.getDirectionalRiskPerAsset(
                        ethers.utils.formatBytes32String(CRYPTO_CURRENCY_MAP.BTC)
                    ),
                    speedMarketsAMMContract.lpFee(),
                    speedMarketsAMMContract.safeBoxImpact(),
                    walletAddress
                        ? speedMarketsAMMContract.whitelistedAddresses(walletAddress)
                        : Promise.resolve(false),
                ]);

                ammSpeedMarketsLimits.minBuyinAmount = coinFormatter(minBuyinAmount, networkId);
                ammSpeedMarketsLimits.maxBuyinAmount =
                    coinFormatter(maxBuyinAmount, networkId) - MAX_BUYIN_COLLATERAL_CONVERSION_BUFFER;
                ammSpeedMarketsLimits.minimalTimeToMaturity = Number(minTimeToMaturity);
                ammSpeedMarketsLimits.maximalTimeToMaturity = Number(maxTimeToMaturity);
                ammSpeedMarketsLimits.maxPriceDelayForResolvingSec = Number(maxPriceDelayForResolving);
                ammSpeedMarketsLimits.risksPerAsset = [
                    {
                        currency: CRYPTO_CURRENCY_MAP.ETH,
                        current: coinFormatter(currentRiskForETH, networkId),
                        max: coinFormatter(maxRiskForETH, networkId),
                    },
                    {
                        currency: CRYPTO_CURRENCY_MAP.BTC,
                        current: coinFormatter(currentRiskForBTC, networkId),
                        max: coinFormatter(maxRiskForBTC, networkId),
                    },
                ];
                directionalRiskForETH.map((risk: any) => {
                    ammSpeedMarketsLimits.risksPerAssetAndDirection.push({
                        currency: CRYPTO_CURRENCY_MAP.ETH,
                        position: OPTIONS_POSITIONS_MAP[SIDE[risk.direction] as OptionSide] as Positions,
                        current: coinFormatter(risk.current, networkId),
                        max: coinFormatter(risk.max, networkId),
                    });
                });
                directionalRiskForBTC.map((risk: any) => {
                    ammSpeedMarketsLimits.risksPerAssetAndDirection.push({
                        currency: CRYPTO_CURRENCY_MAP.BTC,
                        position: OPTIONS_POSITIONS_MAP[SIDE[risk.direction] as OptionSide] as Positions,
                        current: coinFormatter(risk.current, networkId),
                        max: coinFormatter(risk.max, networkId),
                    });
                });
                ammSpeedMarketsLimits.lpFee = bigNumberFormatter(lpFee);
                ammSpeedMarketsLimits.safeBoxImpact = bigNumberFormatter(safeBoxImpact);
                ammSpeedMarketsLimits.whitelistedAddress = whitelistedAddress;
            }

            return ammSpeedMarketsLimits;
        },
        {
            ...options,
        }
    );
};

export default useAmmSpeedMarketsLimitsQuery;
