import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';
import { parseBytes32String } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { NetworkId } from 'utils/network';
import { SynthsMap } from 'types/synthetix';

export type Rates = Record<CurrencyKey, number>;

const useSynthsMapQuery = (networkId: NetworkId, options?: UseQueryOptions<SynthsMap>) => {
    return useQuery<SynthsMap>(
        QUERY_KEYS.BinaryOptions.SynthsMap(networkId),
        async () => {
            const synthsMap: SynthsMap = {};
            if (snxJSConnector.priceFeedContract) {
                const currencies = await snxJSConnector.priceFeedContract.getCurrencies();
                currencies.forEach((currency: CurrencyKey) => {
                    const currencyName = parseBytes32String(currency);
                    synthsMap[currencyName] = {
                        asset: currencyName,
                        name: currencyName,
                        description: currencyName,
                    };
                });
            }

            console.log(synthsMap);

            return synthsMap;
        },
        options
    );
};

export default useSynthsMapQuery;
