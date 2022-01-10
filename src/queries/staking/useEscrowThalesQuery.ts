import { useQuery, UseQueryOptions } from 'react-query';
import { ethers } from 'ethers';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

type EscrowThalesQueryResponse = {
    escrowedBalance: number;
    claimable: string;
    totalEscrowBalanceNotIncludedInStaking: string;
    totalEscrowedRewards: string;
};

const useEscrowThalesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<EscrowThalesQueryResponse>
) => {
    return useQuery<EscrowThalesQueryResponse>(
        QUERY_KEYS.Staking.Escrow(walletAddress, networkId),
        async () => {
            const escrow = {
                escrowedBalance: 0,
                claimable: '0',
                totalEscrowBalanceNotIncludedInStaking: '0',
                totalEscrowedRewards: '0',
            };

            try {
                const [totalEscrowBalanceNotIncludedInStaking, totalEscrowedRewards] = await Promise.all([
                    (snxJSConnector as any).escrowThalesContract.totalEscrowBalanceNotIncludedInStaking(),
                    (snxJSConnector as any).escrowThalesContract.totalEscrowedRewards(),
                ]);

                escrow.totalEscrowBalanceNotIncludedInStaking = ethers.utils.formatEther(
                    totalEscrowBalanceNotIncludedInStaking
                );
                escrow.totalEscrowedRewards = ethers.utils.formatEther(totalEscrowedRewards);

                if (walletAddress !== '') {
                    const [escrowedBalance, claimable] = await Promise.all([
                        (snxJSConnector as any).escrowThalesContract.totalAccountEscrowedAmount(walletAddress),
                        (snxJSConnector as any).escrowThalesContract.claimable(walletAddress),
                    ]);

                    escrow.escrowedBalance = bigNumberFormatter(escrowedBalance);
                    escrow.claimable = ethers.utils.formatEther(claimable);
                }
            } catch {}

            return escrow;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useEscrowThalesQuery;
