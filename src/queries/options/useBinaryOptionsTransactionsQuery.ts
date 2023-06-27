import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';

const useBinaryOptionsTransactionsQuery = (
    marketAddress: string,
    networkId: number,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.MarketTransactions(marketAddress),
        () => thalesData.binaryOptions.optionTransactions({ market: marketAddress, network: networkId }),
        {
            ...options,
        }
    );
};

export default useBinaryOptionsTransactionsQuery;
