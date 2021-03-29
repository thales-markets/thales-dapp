import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

const useBinaryOptionsUserBidsMarketsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<string[]>
) => {
    return useQuery<string[]>(
        QUERY_KEYS.BinaryOptions.UserMarkets(walletAddress || '', networkId),
        () => thalesData.binaryOptions.marketsBidOn({ account: walletAddress, network: networkId }),
        options
    );
};

export default useBinaryOptionsUserBidsMarketsQuery;
