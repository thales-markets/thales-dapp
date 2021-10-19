import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
export interface TwitterAccount {
    createdAt: string;
    avatar: string;
    name: string;
    twitter: string;
}

const useTwitterAccountQuery = (walletAddress: string, options?: UseQueryOptions<TwitterAccount>) => {
    return useQuery<TwitterAccount>(
        QUERY_KEYS.User.TwitterAccount(walletAddress),
        async () => {
            const baseUrl = 'https://api.thales.market/twitter/' + walletAddress.toLowerCase();
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());

            return result;
        },
        options
    );
};

export default useTwitterAccountQuery;
