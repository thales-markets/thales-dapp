import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { MIN_SCEW_IMPACT, SIDE } from 'constants/options';
import { ethers } from 'ethers';

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
            };
            const ammContract = snxJSConnector.ammContract;
            if (ammContract) {
                const parsedAmount = ethers.utils.parseEther('1');
                const [
                    maxBuyLong,
                    maxSellLong,
                    maxBuyShort,
                    maxSellShort,
                    isMarketInAmmTrading,
                    buyLongPrice,
                    buyShortPrice,
                    sellLongPrice,
                    sellShortPrice,
                    buyLongPriceImpact,
                    buyShortPriceImpact,
                    sellLongPriceImpact,
                    sellShortPriceImpact,
                ] = await Promise.all([
                    ammContract.availableToBuyFromAMM(marketAddress, SIDE['long']),
                    ammContract.availableToSellToAMM(marketAddress, SIDE['long']),
                    ammContract.availableToBuyFromAMM(marketAddress, SIDE['short']),
                    ammContract.availableToSellToAMM(marketAddress, SIDE['short']),
                    ammContract.isMarketInAMMTrading(marketAddress),
                    ammContract.buyFromAmmQuote(marketAddress, SIDE['long'], parsedAmount),
                    ammContract.buyFromAmmQuote(marketAddress, SIDE['short'], parsedAmount),
                    ammContract.sellToAmmQuote(marketAddress, SIDE['long'], parsedAmount),
                    ammContract.sellToAmmQuote(marketAddress, SIDE['short'], parsedAmount),
                    ammContract.buyPriceImpact(marketAddress, SIDE['long'], parsedAmount),
                    ammContract.buyPriceImpact(marketAddress, SIDE['short'], parsedAmount),
                    ammContract.sellPriceImpact(marketAddress, SIDE['long'], parsedAmount),
                    ammContract.sellPriceImpact(marketAddress, SIDE['short'], parsedAmount),
                ]);

                ammMaxLimits.maxBuyLong = bigNumberFormatter(maxBuyLong);
                ammMaxLimits.maxSellLong = bigNumberFormatter(maxSellLong);
                ammMaxLimits.maxBuyShort = bigNumberFormatter(maxBuyShort);
                ammMaxLimits.maxSellShort = bigNumberFormatter(maxSellShort);
                ammMaxLimits.buyLongPrice = stableCoinFormatter(buyLongPrice, networkId);
                ammMaxLimits.buyShortPrice = stableCoinFormatter(buyShortPrice, networkId);
                ammMaxLimits.sellLongPrice = stableCoinFormatter(sellLongPrice, networkId);
                ammMaxLimits.sellShortPrice = stableCoinFormatter(sellShortPrice, networkId);
                ammMaxLimits.buyLongPriceImpact = bigNumberFormatter(buyLongPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.buyShortPriceImpact = bigNumberFormatter(buyShortPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.sellLongPriceImpact = bigNumberFormatter(sellLongPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.sellShortPriceImpact = bigNumberFormatter(sellShortPriceImpact) - MIN_SCEW_IMPACT;
                ammMaxLimits.isMarketInAmmTrading = isMarketInAmmTrading;
            }

            return ammMaxLimits;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useAmmMaxLimitsQuery;
