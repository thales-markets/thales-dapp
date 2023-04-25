import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';

const useAvailableAssetsQuery = (options?: UseQueryOptions) => {
    return useQuery(
        QUERY_KEYS.BinaryOptions.AvailableAssets(),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAvailableAssets();
            console.log(result);
            return result;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useAvailableAssetsQuery;
