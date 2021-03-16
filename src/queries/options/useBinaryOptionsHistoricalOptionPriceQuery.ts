import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';
import { calculateTimestampForPeriod } from 'utils/rates';
import { PERIOD_IN_HOURS, Period } from 'constants/period';

const useBinaryOptionsHistoricalOptionPriceQuery = (
    marketAddress: string,
    period: Period = Period.ONE_DAY,
    networkId: number,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    const periodInHours = PERIOD_IN_HOURS[period];

    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.OptionPrices(marketAddress, period),
        () =>
            thalesData.binaryOptions.historicalOptionPrice({
                market: marketAddress,
                maxTimestamp: Math.trunc(Date.now() / 1000),
                minTimestamp: calculateTimestampForPeriod(periodInHours),
                network: networkId,
            }),
        options
    );
};

export default useBinaryOptionsHistoricalOptionPriceQuery;
