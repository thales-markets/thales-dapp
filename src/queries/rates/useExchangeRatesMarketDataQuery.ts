import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { OptionsMarkets } from 'types/options';
import { NetworkId } from 'utils/network';
import { uniqBy } from 'lodash';

export type Rates = Record<CurrencyKey, number>;

const useExchangeRatesMarketDataQuery = (
    networkId: NetworkId,
    markets: OptionsMarkets,
    options?: UseQueryOptions<Rates>
) => {
    return useQuery<Rates>(
        QUERY_KEYS.Rates.ExchangeRatesMarketData(networkId),
        async () => {
            const filteredMarkets = uniqBy(markets, (market) => market.address).map((market) => ({
                currencyKey: market.currencyKey,
                address: market.address,
            }));

            const marketData: any = await Promise.all(
                filteredMarkets.map((market) =>
                    (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketData(market.address)
                )
            );

            const exchangeRates: Rates = {};

            filteredMarkets.forEach((market, idx: number) => {
                exchangeRates[market.currencyKey] = bigNumberFormatter(marketData[idx].oraclePrice);
            });

            return exchangeRates;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useExchangeRatesMarketDataQuery;
