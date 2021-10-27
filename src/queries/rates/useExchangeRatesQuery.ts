import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import { bigNumberFormatter, parseBytes32String } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

export type Rates = Record<CurrencyKey, number>;

const useExchangeRatesQuery = (options?: UseQueryOptions<Rates>) => {
    return useQuery<Rates>(
        QUERY_KEYS.Rates.ExchangeRates,
        async () => {
            const exchangeRates: Rates = {};
            if (snxJSConnector.priceFeedContract) {
                const [currencies, rates] = await Promise.all([
                    snxJSConnector.priceFeedContract.getCurrencies(),
                    snxJSConnector.priceFeedContract.getRates(),
                ]);
                currencies.forEach((currency: CurrencyKey, idx: number) => {
                    const currencyName = parseBytes32String(currency);
                    exchangeRates[currencyName] = bigNumberFormatter(rates[idx]);
                    exchangeRates[`s${currencyName}`] = bigNumberFormatter(rates[idx]);
                });
            }

            return exchangeRates;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useExchangeRatesQuery;
