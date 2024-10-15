import { AMM_MAX_BUFFER_PERCENTAGE, RANGE_SIDE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { BigNumber } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import snxJSConnector from 'utils/snxJSConnector';
import { getContractForInteraction } from '../../../utils/options';

export type RangeAmmMaxLimits = {
    in: {
        maxBuy: number;
        maxSell: number;
        buyPrice: number;
        maxBuyPrice: number;
        sellPrice: number;
        priceImpact: number;
    };
    out: {
        maxBuy: number;
        maxSell: number;
        buyPrice: number;
        maxBuyPrice: number;
        sellPrice: number;
        priceImpact: number;
    };
};

const useRangedAMMMaxLimitsQuery = (
    marketAddress: string,
    networkId: number,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<RangeAmmMaxLimits>
) => {
    return useQuery<RangeAmmMaxLimits>(
        QUERY_KEYS.BinaryOptions.RangedAmmMaxLimits(marketAddress, isDeprecatedCurrency),
        async () => {
            const ammMaxLimits: RangeAmmMaxLimits = {
                in: {
                    maxBuy: 0,
                    maxSell: 0,
                    buyPrice: 0,
                    maxBuyPrice: 0,
                    sellPrice: 0,
                    priceImpact: 0,
                },
                out: {
                    maxBuy: 0,
                    maxSell: 0,
                    buyPrice: 0,
                    maxBuyPrice: 0,
                    sellPrice: 0,
                    priceImpact: 0,
                },
            };

            const {
                rangedMarketAMMContract,
                rangedMarketsAMMUSDCContract,
                binaryOptionsMarketDataContract,
                binaryOptionsMarketDataUSDCContract,
            } = snxJSConnector;
            const rangedMarketAMMContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                rangedMarketAMMContract,
                rangedMarketsAMMUSDCContract
            );
            const binaryOptionsMarketDataContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                binaryOptionsMarketDataContract,
                binaryOptionsMarketDataUSDCContract
            );

            if (rangedMarketAMMContractForInteraction && binaryOptionsMarketDataContractForInteraction) {
                const rangedAmmMarketData = await binaryOptionsMarketDataContractForInteraction.getRangedAmmMarketData(
                    marketAddress
                );

                const [maxBuyInPrice, maxBuyOutPrice] = await Promise.all([
                    rangedAmmMarketData.inBuyLiquidity > 0
                        ? rangedMarketAMMContractForInteraction.buyFromAmmQuote(
                              marketAddress,
                              RANGE_SIDE['in'],
                              (rangedAmmMarketData.inBuyLiquidity as BigNumber)
                                  .mul(AMM_MAX_BUFFER_PERCENTAGE * 100)
                                  .div(100)
                          )
                        : 0,
                    rangedAmmMarketData.outBuyLiquidity > 0
                        ? rangedMarketAMMContractForInteraction.buyFromAmmQuote(
                              marketAddress,
                              RANGE_SIDE['out'],
                              (rangedAmmMarketData.outBuyLiquidity as BigNumber)
                                  .mul(AMM_MAX_BUFFER_PERCENTAGE * 100)
                                  .div(100)
                          )
                        : 0,
                ]);

                ammMaxLimits.in.buyPrice = coinFormatter(
                    rangedAmmMarketData.inBuyPrice,
                    networkId,
                    undefined,
                    isDeprecatedCurrency
                );
                ammMaxLimits.out.buyPrice = coinFormatter(
                    rangedAmmMarketData.outBuyPrice,
                    networkId,
                    undefined,
                    isDeprecatedCurrency
                );
                ammMaxLimits.in.maxBuyPrice = coinFormatter(maxBuyInPrice, networkId, undefined, isDeprecatedCurrency);
                ammMaxLimits.out.maxBuyPrice = coinFormatter(
                    maxBuyOutPrice,
                    networkId,
                    undefined,
                    isDeprecatedCurrency
                );
                ammMaxLimits.in.sellPrice = coinFormatter(
                    rangedAmmMarketData.inSellPrice,
                    networkId,
                    undefined,
                    isDeprecatedCurrency
                );
                ammMaxLimits.out.sellPrice = coinFormatter(
                    rangedAmmMarketData.outSellPrice,
                    networkId,
                    undefined,
                    isDeprecatedCurrency
                );
                ammMaxLimits.in.maxBuy =
                    ammMaxLimits.in.buyPrice !== 0
                        ? bigNumberFormatter(rangedAmmMarketData.inBuyLiquidity) * AMM_MAX_BUFFER_PERCENTAGE
                        : 0;
                ammMaxLimits.in.maxSell =
                    ammMaxLimits.in.sellPrice !== 0
                        ? bigNumberFormatter(rangedAmmMarketData.inSellLiquidity) * AMM_MAX_BUFFER_PERCENTAGE
                        : 0;
                ammMaxLimits.out.maxBuy =
                    ammMaxLimits.out.buyPrice !== 0
                        ? bigNumberFormatter(rangedAmmMarketData.outBuyLiquidity) * AMM_MAX_BUFFER_PERCENTAGE
                        : 0;
                ammMaxLimits.out.maxSell =
                    ammMaxLimits.out.sellPrice !== 0
                        ? bigNumberFormatter(rangedAmmMarketData.outSellLiquidity) * AMM_MAX_BUFFER_PERCENTAGE
                        : 0;
                ammMaxLimits.in.priceImpact = bigNumberFormatter(rangedAmmMarketData.inPriceImpact);
                ammMaxLimits.out.priceImpact = bigNumberFormatter(rangedAmmMarketData.outPriceImpact);
            }

            console.log(ammMaxLimits, isDeprecatedCurrency);
            return ammMaxLimits;
        },
        {
            ...options,
        }
    );
};

export default useRangedAMMMaxLimitsQuery;
