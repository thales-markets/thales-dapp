import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import { Network } from 'enums/network';
import { MIN_MATURITY } from 'constants/options';

const useBinaryOptionsMarketsQuery = (networkId: Network, options?: UseQueryOptions<OptionsMarkets>) => {
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets(networkId),
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
                minMaturity: MIN_MATURITY,
            });

            return optionsMarkets;
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
