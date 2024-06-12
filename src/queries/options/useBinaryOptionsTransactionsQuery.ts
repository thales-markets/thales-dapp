import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionsTransactions } from 'types/options';

const useBinaryOptionsTransactionsQuery = (
    marketAddress: string,
    networkId: number,
    options?: UseQueryOptions<OptionsTransactions>
) => {
    return useQuery<OptionsTransactions>(
        QUERY_KEYS.BinaryOptions.MarketTransactions(marketAddress),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.OptionTransactions}/${networkId}?market=${marketAddress}`
                );

                if (!response?.data) return [];

                return response.data as OptionsTransactions;
            } catch (e) {
                console.log('Error ', e);
                return [];
            }
        },
        {
            ...options,
        }
    );
};

export default useBinaryOptionsTransactionsQuery;
