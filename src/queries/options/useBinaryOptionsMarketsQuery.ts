import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import { NetworkId } from 'utils/network';

const useBinaryOptionsMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<OptionsMarkets>) => {
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets(networkId),
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
                minMaturity: Math.round(new Date(Date.now() + 3600 * 1000 * 24).getTime() / 1000),
            });

            return optionsMarkets;
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
