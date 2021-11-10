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
            const snxRate = await snxJSConnector.snxJS?.contracts.ExchangeRates.rateForCurrency(
                snxJSConnector.snxJS?.toBytes32('SNX')
            );
            const kncRate = await snxJSConnector.snxJS?.contracts.ExchangeRates.rateForCurrency(
                snxJSConnector.snxJS?.toBytes32('KNC')
            );
            exchangeRates['SNX'] = bigNumberFormatter(snxRate);
            exchangeRates['KNC'] = bigNumberFormatter(kncRate);

            const [synths, rates] = await (snxJSConnector as any).snxJS?.contracts.SynthUtil.synthsRates();

            synths.forEach((synth: CurrencyKey, idx: number) => {
                const synthName = parseBytes32String(synth);
                exchangeRates[synthName] = bigNumberFormatter(rates[idx]);
            });

            return exchangeRates;
        },
        {
            refetchInterval: 1000,
            ...options,
        }
    );
};

export default useExchangeRatesQuery;
