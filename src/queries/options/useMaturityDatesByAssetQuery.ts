import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { NetworkId } from 'utils/network';

const useMaturityDatesByAssetQueryQuery = (
    asset: string,
    networkId: NetworkId,
    options?: UseQueryOptions<number[]>
) => {
    return useQuery<number[]>(
        QUERY_KEYS.BinaryOptions.MaturityDatesByAsset(asset, networkId),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMaturityDates(
                ethers.utils.formatBytes32String(asset)
            );

            const resultSet = new Set<number>();

            const today = new Date();
            const tomorrow = Math.round(new Date(new Date().setDate(today.getDate() + 1)).getTime() / 1000);

            result.map((date: any) => {
                if (Number(date) > 0 && Number(date) > tomorrow) resultSet.add(Number(date) * 1000);
            });

            return Array.from(resultSet).sort((a, b) => a - b);
        },
        {
            ...options,
        }
    );
};

export default useMaturityDatesByAssetQueryQuery;
