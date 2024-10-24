import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';
import { getContractForInteraction } from '../../utils/options';

const useMaturityDatesByAssetQueryQuery = (
    asset: string,
    networkId: Network,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<number[]>
) => {
    return useQuery<number[]>(
        QUERY_KEYS.BinaryOptions.MaturityDatesByAsset(asset, networkId, isDeprecatedCurrency),
        async () => {
            const { binaryOptionsMarketDataContract, binaryOptionsMarketDataUSDCContract } = snxJSConnector;
            const binaryOptionsMarketDataContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                binaryOptionsMarketDataContract,
                binaryOptionsMarketDataUSDCContract
            );

            const result = await binaryOptionsMarketDataContractForInteraction?.getMaturityDates(
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
