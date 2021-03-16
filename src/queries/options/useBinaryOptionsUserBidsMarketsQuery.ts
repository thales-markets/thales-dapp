import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';

const useBinaryOptionsUserBidsMarketsQuery = (
    walletAddress: string,
    networkId: number,
    options?: UseQueryOptions<string[]>
) => {
    return useQuery<string[]>(
        QUERY_KEYS.BinaryOptions.UserMarkets(walletAddress || ''),
        () => thalesData.binaryOptions.marketsBidOn({ account: walletAddress, network: networkId }),
        options
    );
};

export default useBinaryOptionsUserBidsMarketsQuery;
