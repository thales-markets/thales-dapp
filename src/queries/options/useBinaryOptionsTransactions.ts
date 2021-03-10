import { useQuery } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';

const useBinaryOptionsTransactions = (marketAddress: string) => {
    return useQuery<OptionsTransactions>(QUERY_KEYS.BinaryOptions.RecentTransactions(marketAddress), () =>
        snxData.binaryOptions.optionTransactions({ market: marketAddress })
    );
};

export default useBinaryOptionsTransactions;
