import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { AMM_MAX_BUFFER_PERCENTAGE, RANGE_SIDE } from 'constants/options';
import { BigNumber } from 'ethers';

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
    options?: UseQueryOptions<RangeAmmMaxLimits>
) => {
    return useQuery<RangeAmmMaxLimits>(
        QUERY_KEYS.BinaryOptions.RangedAmmMaxLimits(marketAddress),
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

            const { rangedMarketAMMContract, binaryOptionsMarketDataContract } = snxJSConnector;
            if (rangedMarketAMMContract && binaryOptionsMarketDataContract) {
                const rangedAmmMarketData = await binaryOptionsMarketDataContract.getRangedAmmMarketData(marketAddress);

                const [maxBuyInPrice, maxBuyOutPrice] = await Promise.all([
                    rangedAmmMarketData.inBuyLiquidity > 0
                        ? rangedMarketAMMContract.buyFromAmmQuote(
                              marketAddress,
                              RANGE_SIDE['in'],
                              (rangedAmmMarketData.inBuyLiquidity as BigNumber)
                                  .mul(AMM_MAX_BUFFER_PERCENTAGE * 100)
                                  .div(100)
                          )
                        : 0,
                    rangedAmmMarketData.outBuyLiquidity > 0
                        ? rangedMarketAMMContract.buyFromAmmQuote(
                              marketAddress,
                              RANGE_SIDE['out'],
                              (rangedAmmMarketData.outBuyLiquidity as BigNumber)
                                  .mul(AMM_MAX_BUFFER_PERCENTAGE * 100)
                                  .div(100)
                          )
                        : 0,
                ]);

                ammMaxLimits.in.buyPrice = stableCoinFormatter(rangedAmmMarketData.inBuyPrice, networkId);
                ammMaxLimits.out.buyPrice = stableCoinFormatter(rangedAmmMarketData.outBuyPrice, networkId);
                ammMaxLimits.in.maxBuyPrice = stableCoinFormatter(maxBuyInPrice, networkId);
                ammMaxLimits.out.maxBuyPrice = stableCoinFormatter(maxBuyOutPrice, networkId);
                ammMaxLimits.in.sellPrice = stableCoinFormatter(rangedAmmMarketData.inSellPrice, networkId);
                ammMaxLimits.out.sellPrice = stableCoinFormatter(rangedAmmMarketData.outSellPrice, networkId);
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

            return ammMaxLimits;
        },
        {
            ...options,
        }
    );
};

export default useRangedAMMMaxLimitsQuery;
