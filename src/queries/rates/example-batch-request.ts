import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { OptionsMarkets } from 'types/options';
import { NetworkId } from 'utils/network';
import { uniqBy } from 'lodash';
import Web3 from 'web3';
import binaryOptionsMarketDataContract from 'utils/contracts/binaryOptionsMarketDataContract';

type Rates = Record<CurrencyKey, number>;

export const batchRequest = (networkId: NetworkId, markets: OptionsMarkets, options?: UseQueryOptions<Rates>) => {
    return useQuery<Rates>(
        QUERY_KEYS.Rates.ExchangeRatesMarketData(networkId),
        async () => {
            const filteredMarkets = uniqBy(markets, (market) => market.currencyKey).map((market) => {
                return {
                    currencyKey: market.currencyKey,
                    address: market.address,
                };
            });

            const web3 = new Web3(window.ethereum as any);
            const batch = new web3.BatchRequest();

            const contract = new web3.eth.Contract(
                binaryOptionsMarketDataContract.abi as any,
                binaryOptionsMarketDataContract.addresses[networkId]
            );

            const exchangeRates: Rates = {};

            filteredMarkets.map((market) => {
                batch.add(
                    contract.methods.getMarketData(market.address).call.request({}, (_a: any, data: any) => {
                        exchangeRates[market.currencyKey] = bigNumberFormatter(data.oraclePriceAndTimestamp.price);
                    })
                );
            });

            batch.execute();

            return exchangeRates;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};
