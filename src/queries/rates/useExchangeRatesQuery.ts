import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import { bigNumberFormatter, parseBytes32String } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { getIsOVM, getIsPolygon, NetworkId } from 'utils/network';
export type Rates = Record<CurrencyKey, number>;

const useExchangeRatesQuery = (networkId: NetworkId, options?: UseQueryOptions<Rates>) => {
    return useQuery<Rates>(
        QUERY_KEYS.Rates.ExchangeRates(networkId),
        async () => {
            const isL2 = getIsOVM(networkId);
            const isPolygon = getIsPolygon(networkId);
            const exchangeRates: Rates = {};

            if (isL2 || isPolygon) {
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
            } else {
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
