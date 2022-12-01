import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import snxJSConnector from 'utils/snxJSConnector';

const useEthBalanceQuery = (walletAddress: string, options?: UseQueryOptions<string>) => {
    return useQuery<string>(
        QUERY_KEYS.User.EthBalance(walletAddress),
        async () => {
            const provider = (snxJSConnector as any).provider;
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
