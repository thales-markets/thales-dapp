import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { uniq } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';
import { getCurrencyPriority } from 'utils/currency';
import snxJSConnector from 'utils/snxJSConnector';
import { getContractForInteraction } from '../../utils/options';

const useAvailableAssetsQuery = (
    networkId: Network,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<string[]>
) => {
    return useQuery<string[]>(
        QUERY_KEYS.BinaryOptions.AvailableAssets(networkId, isDeprecatedCurrency),
        async () => {
            const { binaryOptionsMarketDataContract, binaryOptionsMarketDataUSDCContract } = snxJSConnector;
            const binaryOptionsMarketDataContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                binaryOptionsMarketDataContract,
                binaryOptionsMarketDataUSDCContract
            );

            const result = await binaryOptionsMarketDataContractForInteraction?.getAvailableAssets();
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
