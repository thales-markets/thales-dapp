import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { generalConfig } from 'config/general';

const useVerifiedTwitterAccountsQuery = (options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.User.VerifiedTwitterAccounts(),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/verified-users`;
            const response = await fetch(baseUrl);
            const result = new Set(JSON.parse(await response.text()));

            return result;
        },
        options
    );
};

export default useVerifiedTwitterAccountsQuery;
