import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useRetroAirdropQuery = (
    walletAddress: string,
    networkId: NetworkId,
    index: number | undefined,
    options?: UseQueryOptions<{ claimed: boolean }>
) => {
    return useQuery<{ claimed: boolean }>(
        QUERY_KEYS.WalletBalances.Airdrop(walletAddress, networkId),
        async () => {
            const claimed = !!bigNumberFormatter(
                (await (snxJSConnector as any).retroAirdropContract.claimed(index))[0]
            );
            return { claimed };
        },
        options
    );
};

export default useRetroAirdropQuery;
