import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';

const useBinaryOptionsHistoricalOptionPriceQuery = (
    marketAddress: string,
    networkId: number,
    minTimestamp: number,
    maxTimestamp: number,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.OptionPrices(marketAddress),
        () =>
            thalesData.binaryOptions.historicalOptionPrice({
                market: marketAddress,
                maxTimestamp,
                minTimestamp,
                network: networkId,
                max: 6000,
            }),
        options
    );
};

export default useBinaryOptionsHistoricalOptionPriceQuery;
