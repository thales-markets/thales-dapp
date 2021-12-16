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
    isMarketInAmmTrading: boolean;
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
            };
            const ammContract = snxJSConnector.ammContract;
            if (ammContract) {
                const [maxBuyLong, maxSellLong, maxBuyShort, maxSellShort, isMarketInAmmTrading] = await Promise.all([
                    ammContract.availableToBuyFromAMM(marketAddress, SIDE['long']),
                    ammContract.availableToSellToAMM(marketAddress, SIDE['long']),
                    ammContract.availableToBuyFromAMM(marketAddress, SIDE['short']),
                    ammContract.availableToSellToAMM(marketAddress, SIDE['short']),
                    ammContract.isMarketInAMMTrading(marketAddress),
                ]);

                ammMaxLimits.maxBuyLong = bigNumberFormatter(maxBuyLong);
                ammMaxLimits.maxSellLong = bigNumberFormatter(maxSellLong);
                ammMaxLimits.maxBuyShort = bigNumberFormatter(maxBuyShort);
                ammMaxLimits.maxSellShort = bigNumberFormatter(maxSellShort);
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
