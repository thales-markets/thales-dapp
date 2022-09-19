import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { generalConfig } from 'config/general';

const useUsersDisplayNamesQuery = (options?: UseQueryOptions<Map<string, string>>) => {
    return useQuery<any>(
        QUERY_KEYS.User.DisplayNames(),
        async () => {
            const baseUrl = `${generalConfig.API_URL}/display-name/`;
            const response = await fetch(baseUrl);
            const result = await response.text();

            return new Map(JSON.parse(result).data);
        },
        options
    );
};

export default useUsersDisplayNamesQuery;
