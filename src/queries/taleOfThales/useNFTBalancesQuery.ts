import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

const useNFTBalancesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<Record<number, boolean>>
) => {
    return useQuery(
        QUERY_KEYS.TaleOfThales.NFTBalances(walletAddress, networkId),
        async () => {
            const NFTBalances = {} as Record<number, boolean>;
            const mintTransactions = await thalesData.binaryOptions.mintTransactions({
                minter: walletAddress,
                network: networkId,
            });
            mintTransactions.forEach((tx: any) => {
                NFTBalances[parseInt(tx.item.id.replace('0x', ''), 16)] = true;
            });
            return NFTBalances;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useNFTBalancesQuery;
