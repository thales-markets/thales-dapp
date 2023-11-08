import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { parseBytes32String } from 'thales-utils';
import snxJSConnector from 'utils/snxJSConnector';
import { Network } from 'enums/network';
import { SynthsMap } from 'types/synthetix';
import { getSynthAsset, getSynthName } from 'utils/currency';

const useSynthsMapQuery = (networkId: Network, options?: UseQueryOptions<SynthsMap>) => {
    return useQuery<SynthsMap>(
        QUERY_KEYS.BinaryOptions.SynthsMap(networkId),
        async () => {
            const synthsMap: SynthsMap = {};
            if (snxJSConnector.priceFeedContract) {
                const currencies = await snxJSConnector.priceFeedContract.getCurrencies();
                currencies.forEach((currency: string) => {
                    const currencyName = parseBytes32String(currency);
                    synthsMap[currencyName] = {
                        name: currencyName,
                        asset: getSynthAsset(currencyName),
                        description: getSynthName(currencyName),
                    };
                });
            }

            return synthsMap;
        },
        options
    );
};

export default useSynthsMapQuery;
