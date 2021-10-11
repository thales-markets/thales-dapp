import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
export interface TwitterAccounts {
    twitter: [{ createdAt: string; avatar: string; name: string; twitter: string }];
}

const useTwitterAccountQuery = (options?: UseQueryOptions<TwitterAccounts>) => {
    return useQuery<TwitterAccounts>(
        QUERY_KEYS.User.TwitterAccounts(),
        async () => {
            const baseUrl = 'https://api.thales.market/twitter/';
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());

            return result;
        },
        options
    );
};

export default useTwitterAccountQuery;
