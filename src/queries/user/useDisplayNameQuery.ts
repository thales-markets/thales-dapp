import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
export interface DisplayName {
    name: string;
}

const useDisplayNameQuery = (walletAddress: string, options?: UseQueryOptions<DisplayName>) => {
    return useQuery<DisplayName>(
        QUERY_KEYS.User.DisplayName(walletAddress),
        async () => {
            const baseUrl = 'https://api.thales.market/display-name/' + walletAddress.toLowerCase();
            const response = await fetch(baseUrl);
            const result = await response.text();

            return JSON.parse(result);
        },
        options
    );
};

export default useDisplayNameQuery;
