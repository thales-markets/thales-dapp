import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import { generalConfig } from 'config/general';

interface Watchlist {
    data: string[];
}

const useUserWatchlistedMarketsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<Watchlist>
) => {
    return useQuery<Watchlist>(
        QUERY_KEYS.User.Watchlist(walletAddress, networkId),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/watchlist/${networkId}`;
            const response = await fetch(baseUrl + '/' + walletAddress);
            const result = await response.text();

            return JSON.parse(result);
        },
        options
    );
};
export default useUserWatchlistedMarketsQuery;
