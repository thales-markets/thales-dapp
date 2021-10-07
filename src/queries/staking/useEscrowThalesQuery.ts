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
            try {
                const [
                    escrowedBalance,
                    claimable,
                    totalEscrowBalanceNotIncludedInStaking,
                    totalEscrowedRewards,
                ] = await Promise.all([
                    await (snxJSConnector as any).escrowThalesContract.totalAccountEscrowedAmount(walletAddress),
                    await (snxJSConnector as any).escrowThalesContract.claimable(walletAddress),
                    await (snxJSConnector as any).escrowThalesContract.totalEscrowBalanceNotIncludedInStaking(),
                    await (snxJSConnector as any).escrowThalesContract.totalEscrowedRewards(),
                ]);

                return {
                    escrowedBalance: bigNumberFormatter(escrowedBalance),
                    claimable: ethers.utils.formatEther(claimable),
                    totalEscrowBalanceNotIncludedInStaking: ethers.utils.formatEther(
                        totalEscrowBalanceNotIncludedInStaking
                    ),
                    totalEscrowedRewards: ethers.utils.formatEther(totalEscrowedRewards),
                };
            } catch {}

            return {
                escrowedBalance: 0,
                claimable: '0',
                totalEscrowBalanceNotIncludedInStaking: '0',
                totalEscrowedRewards: '0',
            };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useEscrowThalesQuery;
