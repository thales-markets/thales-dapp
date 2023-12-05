import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { Network } from 'enums/network';
import { BALANCE_THRESHOLD } from 'constants/token';
import { bigNumberFormatter } from 'thales-utils';

const useThalesBalanceQuery = (
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<{ balance: number }>
) => {
    return useQuery<{ balance: number }>(
        QUERY_KEYS.WalletBalances.Thales(walletAddress, networkId),
        async () => {
            if ((snxJSConnector as any).thalesTokenContract) {
                const balance = bigNumberFormatter(
                    await (snxJSConnector as any).thalesTokenContract.balanceOf(walletAddress)
                );
                return { balance: balance < BALANCE_THRESHOLD ? 0 : balance };
            }
            return { balance: 0 };
        },
        {
            ...options,
        }
    );
};

export default useThalesBalanceQuery;
