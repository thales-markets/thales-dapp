import { useQuery, UseQueryOptions } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';

const useBinaryOptionsUserBidsMarketsQuery = (walletAddress: string, options?: UseQueryOptions<string[]>) => {
    return useQuery<string[]>(
        QUERY_KEYS.BinaryOptions.UserMarkets(walletAddress || ''),
        () => snxData.binaryOptions.marketsBidOn({ account: walletAddress }),
        options
    );
};

export default useBinaryOptionsUserBidsMarketsQuery;
