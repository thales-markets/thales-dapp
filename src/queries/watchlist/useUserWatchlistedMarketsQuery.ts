import { useQuery } from 'react-query';
import dotenv from 'dotenv';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

dotenv.config();

const useUserWatchlistedMarketsQuery = (walletAddress: string | null, networkId: NetworkId) => {
    if (walletAddress) {
        return useQuery(QUERY_KEYS.User.Watchlist(walletAddress, networkId), async () => {
            const baseUrl = process.env.REACT_APP_THALES_API_URL + '/watchlist/' + networkId;
            const response = await fetch(baseUrl + '/' + walletAddress);
            const result = await response.text();
            return result;
        });
    }
};
export default useUserWatchlistedMarketsQuery;
