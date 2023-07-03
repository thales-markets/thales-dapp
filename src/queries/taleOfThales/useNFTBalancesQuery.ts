import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import { Network } from 'enums/network';
import thalesData from 'thales-data';

const useNFTBalancesQuery = (
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<Record<number, boolean>>
) => {
    return useQuery<Record<number, boolean>>(
        QUERY_KEYS.TaleOfThales.NFTBalances(walletAddress, networkId),
        async () => {
            const NFTBalances = {} as Record<number, boolean>;
            const mintTransactions = await thalesData.binaryOptions.mintTransactions({
                minter: walletAddress,
                network: networkId,
            });
            mintTransactions.forEach((tx: any) => {
                NFTBalances[parseInt(tx.item.id, 16)] = true;
            });
            return NFTBalances;
        },
        {
            ...options,
        }
    );
};

export default useNFTBalancesQuery;
