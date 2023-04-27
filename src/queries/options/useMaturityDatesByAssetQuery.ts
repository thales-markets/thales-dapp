import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

const useMaturityDatesByAssetQueryQuery = (asset: string, options?: UseQueryOptions<Date[]>) => {
    return useQuery<Date[]>(
        QUERY_KEYS.BinaryOptions.MaturityDatesByAsset(asset),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMaturityDates(
                ethers.utils.formatBytes32String(asset)
            );

            const resultSet = new Set<Date>();

            result.map((date: any) => {
                if (Number(date) > 0) resultSet.add(new Date(Number(date) * 1000));
            });

            return Array.from(resultSet);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMaturityDatesByAssetQueryQuery;
