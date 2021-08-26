import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useThalesBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<{ balance: number }>
) => {
    return useQuery<{ balance: number }>(
        QUERY_KEYS.WalletBalances.Thales(walletAddress, networkId),
        async () => {
            const balance = bigNumberFormatter(
                await (snxJSConnector as any).thalesTokenContract.balanceOf(walletAddress)
            );

            return { balance };
        },
        options
    );
};

export default useThalesBalanceQuery;
