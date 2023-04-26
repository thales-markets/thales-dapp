import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { uniq } from 'lodash';

const useAvailableAssetsQuery = (options?: UseQueryOptions<string[]>) => {
    return useQuery<string[]>(
        QUERY_KEYS.BinaryOptions.AvailableAssets(),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAvailableAssets();
            console.log(result);
            return uniq(result).map((data: any) => {
                return parseBytes32String(data);
            });
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useAvailableAssetsQuery;
