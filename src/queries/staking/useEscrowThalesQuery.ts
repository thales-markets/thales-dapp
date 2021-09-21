import { useQuery, UseQueryOptions } from 'react-query';
import { ethers } from 'ethers';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useEscrowThalesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<{ escrowedBalance: number; claimable: string }>
) => {
    return useQuery<{ escrowedBalance: number; claimable: string }>(
        QUERY_KEYS.Staking.Escrow(walletAddress, networkId),
        async () => {
            try {
                const [escrowedBalance, claimable] = await Promise.all([
                    await (snxJSConnector as any).escrowThalesContract.totalAccountEscrowedAmount(walletAddress),
                    await (snxJSConnector as any).escrowThalesContract.claimable(walletAddress),
                ]);

                return {
                    escrowedBalance: bigNumberFormatter(escrowedBalance),
                    claimable: ethers.utils.formatEther(claimable),
                };
            } catch {}

            return {
                escrowedBalance: 0,
                claimable: '0',
            };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useEscrowThalesQuery;
