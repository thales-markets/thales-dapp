import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { ethers } from 'ethers';

const useThalesBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<{ balance: string }>
) => {
    return useQuery<{ balance: string }>(
        QUERY_KEYS.WalletBalances.Thales(walletAddress, networkId),
        async () => {
            const balance = ethers.utils.formatEther(
                await (snxJSConnector as any).thalesTokenContract.balanceOf(walletAddress)
            );
            return { balance };
        },
        options
    );
};

export default useThalesBalanceQuery;
