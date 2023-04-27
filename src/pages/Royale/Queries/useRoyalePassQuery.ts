import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

export type RoyalePassData = {
    name: string;
    balance: number;
};

const useRoyalePassQuery = (walletAddress: string, options?: UseQueryOptions<RoyalePassData>) => {
    return useQuery<RoyalePassData>(
        QUERY_KEYS.Royale.RoyalePass(walletAddress),
        async () => {
            const { thalesRoyalePassContract } = snxJSConnector;
            return getFromContract(thalesRoyalePassContract, walletAddress);
        },
        {
            ...options,
        }
    );
};

const getFromContract = async (royalePassContract: any, walletAddress: string): Promise<RoyalePassData> => {
    const [name, balance] = await Promise.all([royalePassContract.name(), royalePassContract.balanceOf(walletAddress)]);
    return {
        name,
        balance: Number(balance),
    };
};

export default useRoyalePassQuery;
