import { useQuery } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';

const useBinaryOptionsUserTransactions = (marketAddress: string, walletAddress: string) => {
    return useQuery<OptionsTransactions>(QUERY_KEYS.BinaryOptions.UserTransactions(marketAddress, walletAddress), () =>
        snxData.binaryOptions.optionTransactions({ market: marketAddress, account: walletAddress })
    );
};

export default useBinaryOptionsUserTransactions;
