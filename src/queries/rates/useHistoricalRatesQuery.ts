import { useQuery, UseQueryOptions } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey, SYNTHS_MAP, sUSD_EXCHANGE_RATE } from 'constants/currency';
import { Period, PERIOD_IN_HOURS } from 'constants/period';
import { getMinAndMaxRate, calculateRateChange, mockHistoricalRates } from '../../utils/rates';
import { HistoricalRatesUpdates } from '../../types/rates';

const useHistoricalRatesQuery = (
    currencyKey: CurrencyKey | null,
    minTimestamp: number,
    maxTimestamp: number,
    options?: UseQueryOptions<HistoricalRatesUpdates>
) => {
    return useQuery<HistoricalRatesUpdates>(
        QUERY_KEYS.Rates.HistoricalRates(currencyKey as string),
        async () => {
            if (currencyKey === SYNTHS_MAP.sUSD) {
                return {
                    rates: mockHistoricalRates(PERIOD_IN_HOURS[Period.ONE_MONTH], sUSD_EXCHANGE_RATE),
                    low: sUSD_EXCHANGE_RATE,
                    high: sUSD_EXCHANGE_RATE,
                    change: 0,
                };
            } else {
                const rates = await snxData.rate.updates({
                    synth: currencyKey,
                    maxTimestamp,
                    minTimestamp,
                    max: 6000,
                });

                const [low, high] = getMinAndMaxRate(rates);
                const change = calculateRateChange(rates);

                return {
                    rates: rates.reverse(),
                    low,
                    high,
                    change,
                };
            }
        },
        {
            enabled: currencyKey !== null,
            ...options,
        }
    );
};

export default useHistoricalRatesQuery;
