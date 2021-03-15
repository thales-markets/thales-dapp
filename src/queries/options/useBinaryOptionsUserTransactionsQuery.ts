import { useQuery, UseQueryOptions } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';

const useBinaryOptionsUserTransactionsQuery = (
    marketAddress: string,
    walletAddress: string,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.UserTransactions(marketAddress, walletAddress),
        () => snxData.binaryOptions.optionTransactions({ market: marketAddress, account: walletAddress }),
        options
    );
};

export default useBinaryOptionsUserTransactionsQuery;
