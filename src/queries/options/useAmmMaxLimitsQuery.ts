import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { AMM_MAX_BUFFER_PERCENTAGE, MIN_SCEW_IMPACT } from 'constants/options';

export type AmmMaxLimits = {
    maxBuyLong: number;
    maxSellLong: number;
    maxBuyShort: number;
    maxSellShort: number;
    isMarketInAmmTrading: boolean;
    buyLongPrice: number;
    buyShortPrice: number;
    sellLongPrice: number;
    sellShortPrice: number;
    buyLongPriceImpact: number;
    buyShortPriceImpact: number;
    sellLongPriceImpact: number;
    sellShortPriceImpact: number;
    iv: number;
};

const useAmmMaxLimitsQuery = (marketAddress: string, networkId: number, options?: UseQueryOptions<AmmMaxLimits>) => {
    return useQuery<AmmMaxLimits>(
        QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress),
        async () => {
            const ammMaxLimits: AmmMaxLimits = {
                maxBuyLong: 0,
                maxSellLong: 0,
                maxBuyShort: 0,
                maxSellShort: 0,
                isMarketInAmmTrading: false,
                buyLongPrice: 0,
                buyShortPrice: 0,
                sellLongPrice: 0,
                sellShortPrice: 0,
                buyLongPriceImpact: 0,
                buyShortPriceImpact: 0,
                sellLongPriceImpact: 0,
                sellShortPriceImpact: 0,
                iv: 0,
            };
            const binaryOptionsMarketDataContract = snxJSConnector.binaryOptionsMarketDataContract;
            if (binaryOptionsMarketDataContract) {
                const ammMarketData = await binaryOptionsMarketDataContract.getAmmMarketData(marketAddress);

                ammMaxLimits.maxBuyLong = bigNumberFormatter(ammMarketData.upBuyLiquidity) * AMM_MAX_BUFFER_PERCENTAGE;
                ammMaxLimits.maxSellLong =
                    bigNumberFormatter(ammMarketData.upSellLiquidity) * AMM_MAX_BUFFER_PERCENTAGE;
                ammMaxLimits.maxBuyShort =
                    bigNumberFormatter(ammMarketData.downBuyLiquidity) * AMM_MAX_BUFFER_PERCENTAGE;
                ammMaxLimits.maxSellShort =
                    bigNumberFormatter(ammMarketData.downSellLiquidity) * AMM_MAX_BUFFER_PERCENTAGE;
                ammMaxLimits.buyLongPrice = stableCoinFormatter(ammMarketData.upBuyPrice, networkId);
                ammMaxLimits.buyShortPrice = stableCoinFormatter(ammMarketData.downBuyPrice, networkId);
                ammMaxLimits.sellLongPrice = stableCoinFormatter(ammMarketData.upSellPrice, networkId);
                ammMaxLimits.sellShortPrice = stableCoinFormatter(ammMarketData.downSellPrice, networkId);
                ammMaxLimits.buyLongPriceImpact = bigNumberFormatter(ammMarketData.upBuyPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.buyShortPriceImpact =
                    bigNumberFormatter(ammMarketData.downBuyPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.sellLongPriceImpact =
                    bigNumberFormatter(ammMarketData.upSellPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.sellShortPriceImpact =
                    bigNumberFormatter(ammMarketData.downSellPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.iv = bigNumberFormatter(ammMarketData.iv);
                ammMaxLimits.isMarketInAmmTrading = ammMarketData.isMarketInAMMTrading;
            }

            return ammMaxLimits;
        },
        {
            ...options,
        }
    );
};

export default useAmmMaxLimitsQuery;
