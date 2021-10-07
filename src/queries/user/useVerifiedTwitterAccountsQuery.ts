import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';

const useVerifiedTwitterAccountsQuery = (options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.User.VerifiedTwitterAccounts(),
        async () => {
            const baseUrl = 'https://api.thales.market/verified-users';
            const response = await fetch(baseUrl);
            const result = new Set(JSON.parse(await response.text()));

            return result;
        },
        options
    );
};

export default useVerifiedTwitterAccountsQuery;
