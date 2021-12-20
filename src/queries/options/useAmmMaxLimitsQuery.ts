import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { SIDE } from 'constants/options';
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
};

const useAmmMaxLimitsQuery = (marketAddress: string, options?: UseQueryOptions<AmmMaxLimits>) => {
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
                ]);

                ammMaxLimits.maxBuyLong = bigNumberFormatter(maxBuyLong);
                ammMaxLimits.maxSellLong = bigNumberFormatter(maxSellLong);
                ammMaxLimits.maxBuyShort = bigNumberFormatter(maxBuyShort);
                ammMaxLimits.maxSellShort = bigNumberFormatter(maxSellShort);
                ammMaxLimits.buyLongPrice = bigNumberFormatter(buyLongPrice);
                ammMaxLimits.buyShortPrice = bigNumberFormatter(buyShortPrice);
                ammMaxLimits.sellLongPrice = bigNumberFormatter(sellLongPrice);
                ammMaxLimits.sellShortPrice = bigNumberFormatter(sellShortPrice);
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
