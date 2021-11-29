import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import priceFeed from 'utils/contracts/priceFeed';

const useEthPriceQuery = (priceFeedContractAddress: string, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.Royale.EthPrice(priceFeedContractAddress),
        async () => {
            console.log('Price Query', priceFeedContractAddress);
            if (!priceFeedContractAddress) return;
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const priceFeedContract = new ethers.Contract(priceFeedContractAddress, priceFeed.abi, provider);
            const currencies = await priceFeedContract.getCurrencies();
            return ethers.utils.formatEther(await priceFeedContract.rateForCurrency(currencies[2]));
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useEthPriceQuery;
