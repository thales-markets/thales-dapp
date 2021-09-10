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
            let escrowedBalance = 0;
            let claimable = '0';

            try {
                escrowedBalance = bigNumberFormatter(
                    await (snxJSConnector as any).escrowThalesContract.totalAccountEscrowedAmount(walletAddress)
                );

                claimable = ethers.utils.formatEther(
                    await (snxJSConnector as any).escrowThalesContract.claimable(walletAddress)
                );
            } catch (e) {
                console.error(e);
            }

            return { escrowedBalance, claimable };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useEscrowThalesQuery;
