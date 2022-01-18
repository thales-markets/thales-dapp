import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import snxJSConnector from 'utils/snxJSConnector';

const useEthPriceQuery = (priceFeedContractAddress: string, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.Royale.EthPrice(priceFeedContractAddress),
        async () => {
            console.log('Price Query', priceFeedContractAddress);
            if (!priceFeedContractAddress) return;
            const { priceFeedContract } = snxJSConnector;

            if (priceFeedContract) {
                const currencies = await priceFeedContract.getCurrencies();
                return ethers.utils.formatEther(await priceFeedContract.rateForCurrency(currencies[1]));
            }
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useEthPriceQuery;
