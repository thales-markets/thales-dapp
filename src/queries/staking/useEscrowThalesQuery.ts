import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useEscrowThalesQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<{ escrowedBalance: number; claimable: number }>
) => {
    return useQuery<{ escrowedBalance: number; claimable: number }>(
        QUERY_KEYS.Staking.Escrow(walletAddress, networkId),
        async () => {
            let escrowedBalance = 0;
            let claimable = 0;

            try {
                escrowedBalance = bigNumberFormatter(
                    await (snxJSConnector as any).escrowThalesContract.getEscrowedBalance(walletAddress)
                );
                claimable = bigNumberFormatter(
                    await (snxJSConnector as any).escrowThalesContract.claimable(walletAddress)
                );
            } catch (e) {
                console.error(e);
            }

            return { escrowedBalance, claimable };
        },
        options
    );
};

export default useEscrowThalesQuery;
