import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { generalConfig } from 'config/general';

export interface DisplayName {
    user: {
        name: string;
        avatar: string;
    };
}

const BASE_URL = `${generalConfig.API_URL}/royale-user/`;

const useDisplayNameQuery = (walletAddress: string, options?: UseQueryOptions<DisplayName>) => {
    return useQuery<DisplayName>(
        QUERY_KEYS.User.DisplayName(walletAddress),
        async () => {
            const baseUrl = BASE_URL + walletAddress.toLowerCase();
            const response = await fetch(baseUrl);
            const result = await response.text();
            if (result === '{}') {
                return {
                    user: {
                        name: '',
                        avatar: '',
                    },
                };
            }

            return JSON.parse(result);
        },
        options
    );
};

export default useDisplayNameQuery;
