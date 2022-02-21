import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

export type RoyalePassData = {
    name: string;
    balance: number;
    price: number;
};

const useRoyalePassQuery = (walletAddress: string, options?: UseQueryOptions<RoyalePassData>) => {
    return useQuery<RoyalePassData>(
        QUERY_KEYS.Royale.RoyalePass(walletAddress),
        async () => {
            const { thalesRoyalePassContract } = snxJSConnector;
            return getFromContract(thalesRoyalePassContract, walletAddress);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

const getFromContract = async (royalePassContract: any, walletAddress: string): Promise<RoyalePassData> => {
    const [name, balance, price] = await Promise.all([
        royalePassContract.name(),
        royalePassContract.balanceOf(walletAddress),
        royalePassContract.price(),
    ]);

    return {
        name,
        balance: Number(balance),
        price: Number(ethers.utils.formatEther(price)),
    };
};

export default useRoyalePassQuery;
