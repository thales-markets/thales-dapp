import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import snxJSConnector from 'utils/snxJSConnector';

const useRoyaleAssetPriceQuery = (royaleAsset: string, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.Royale.RoyaleAssetPriceQuery(royaleAsset),
        async () => {
            const { priceFeedContract } = snxJSConnector;

            if (priceFeedContract) {
                return ethers.utils.formatEther(
                    await priceFeedContract.rateForCurrency(ethers.utils.formatBytes32String(royaleAsset))
                );
            }
        },
        {
            ...options,
        }
    );
};

export default useRoyaleAssetPriceQuery;
