import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import { NetworkId } from 'utils/network';

export type RoyalePass = {
    id: number;
};

const useRoyalePassIdQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<RoyalePass>) => {
    return useQuery<RoyalePass>(
        QUERY_KEYS.Royale.RoyalePassId(walletAddress, networkId),
        async () => {
            const passes = await thalesData.binaryOptions.thalesRoyalePasses({
                address: walletAddress,
                network: networkId,
            });
            return {
                id: Number(passes[0].id),
            };
        },
        {
            refetchInterval: 3000,
            ...options,
        }
    );
};

export default useRoyalePassIdQuery;
