import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';

const useBinaryOptionsUserTransactionsQuery = (
    marketAddress: string,
    walletAddress: string,
    networkId: number,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.UserTransactions(marketAddress, walletAddress),
        () =>
            thalesData.binaryOptions.optionTransactions({
                market: marketAddress,
                account: walletAddress,
                network: networkId,
            }),
        {
            ...options,
        }
    );
};

export default useBinaryOptionsUserTransactionsQuery;
