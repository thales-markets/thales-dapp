import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';

const useEthBalanceQuery = (walletAddress: string, options?: UseQueryOptions<string>) => {
    return useQuery<string>(
        QUERY_KEYS.Royale.EthBalance(walletAddress),
        async () => {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const balance = await provider.getBalance(walletAddress);
            return Number(ethers.utils.formatEther(balance)).toFixed(4);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useEthBalanceQuery;
