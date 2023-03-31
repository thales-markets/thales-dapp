import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import { NetworkId } from 'utils/network';

const useBinaryOptionsMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<OptionsMarkets>) => {
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets(networkId),
        async () => {
            const today = new Date();
            const tomorrow = Math.round(new Date(new Date().setDate(today.getDate() + 1)).getTime() / 1000);
            console.log('tomorrow: ', tomorrow);
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
                minMaturity: tomorrow,
            });
            console.log(optionsMarkets);

            return optionsMarkets;
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
