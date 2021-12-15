import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { SIDE } from 'constants/options';

export type AmmMaxLimits = {
    maxBuyLong: number;
    maxSellLong: number;
    maxBuyShort: number;
    maxSellShort: number;
};

const useAmmMaxLimitsQuery = (marketAddress: string, options?: UseQueryOptions<AmmMaxLimits>) => {
    return useQuery<AmmMaxLimits>(
        QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress),
        async () => {
            const exchangeRates: AmmMaxLimits = {
                maxBuyLong: 0,
                maxSellLong: 0,
                maxBuyShort: 0,
                maxSellShort: 0,
            };
            const ammContract = snxJSConnector.ammContract;
            if (ammContract) {
                const [maxBuyLong, maxSellLong, maxBuyShort, maxSellShort] = await Promise.all([
                    ammContract.availableToBuyFromAMM(marketAddress, SIDE['long']),
                    ammContract.availableToSellToAMM(marketAddress, SIDE['long']),
                    ammContract.availableToBuyFromAMM(marketAddress, SIDE['short']),
                    ammContract.availableToSellToAMM(marketAddress, SIDE['short']),
                ]);

                exchangeRates.maxBuyLong = bigNumberFormatter(maxBuyLong);
                exchangeRates.maxSellLong = bigNumberFormatter(maxSellLong);
                exchangeRates.maxBuyShort = bigNumberFormatter(maxBuyShort);
                exchangeRates.maxSellShort = bigNumberFormatter(maxSellShort);
            }

            return exchangeRates;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useAmmMaxLimitsQuery;
