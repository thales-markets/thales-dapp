import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

const useMaturityDatesByAssetQueryQuery = (asset: string, options?: UseQueryOptions<number[]>) => {
    return useQuery<number[]>(
        QUERY_KEYS.BinaryOptions.MaturityDatesByAsset(asset),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMaturityDates(
                ethers.utils.formatBytes32String(asset)
            );

            const resultSet = new Set<number>();

            result.map((date: any) => {
                if (Number(date) > 0) resultSet.add(Number(date) * 1000);
            });

            return Array.from(resultSet).sort((a, b) => a - b);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMaturityDatesByAssetQueryQuery;