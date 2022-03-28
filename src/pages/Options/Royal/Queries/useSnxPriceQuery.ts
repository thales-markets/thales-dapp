import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import snxJSConnector from 'utils/snxJSConnector';

const useSnxPriceQuery = (options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.Royale.SnxPrice(),
        async () => {
            const { priceFeedContract } = snxJSConnector;

            if (priceFeedContract) {
                const currencies = await priceFeedContract.getCurrencies();

                return ethers.utils.formatEther(await priceFeedContract.rateForCurrency(currencies[3]));
            }
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useSnxPriceQuery;
