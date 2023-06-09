import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { uniq } from 'lodash';
import { NetworkId } from 'utils/network';
import { getCurrencyPriority } from 'utils/currency';

const useAvailableAssetsQuery = (networkId: NetworkId, options?: UseQueryOptions<string[]>) => {
    return useQuery<string[]>(
        QUERY_KEYS.BinaryOptions.AvailableAssets(networkId),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAvailableAssets();
            return uniq(result)
                .map((data: any) => parseBytes32String(data))
                .sort((a, b) => getCurrencyPriority(a) - getCurrencyPriority(b));
        },
        {
            ...options,
        }
    );
};

export default useAvailableAssetsQuery;
