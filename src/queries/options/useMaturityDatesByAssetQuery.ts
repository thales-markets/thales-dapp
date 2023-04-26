import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

const useMaturityDatesByAssetQueryQuery = (asset: string, options?: UseQueryOptions) => {
    return useQuery(
        QUERY_KEYS.BinaryOptions.MaturityDatesByAsset(asset),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMaturityDates(
                ethers.utils.formatBytes32String(asset)
            );
            console.log(result);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMaturityDatesByAssetQueryQuery;
