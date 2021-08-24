import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useOngoingAirdropQuery = (
    walletAddress: string,
    networkId: NetworkId,
    index: number | undefined,
    options?: UseQueryOptions<{ claimed: boolean }>
) => {
    return useQuery<{ claimed: boolean }>(
        QUERY_KEYS.WalletBalances.OngoingAirdrop(walletAddress, networkId),
        async () => {
            const claimed1 = await (snxJSConnector as any).ongoingAirdropContract.claimed(index);
            const claimed = !!bigNumberFormatter(claimed1[0]);
            return { claimed };
        },
        options
    );
};

export default useOngoingAirdropQuery;
