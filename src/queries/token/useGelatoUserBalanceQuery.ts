import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/token';

interface BalanceQueryResponse {
    balance: number;
}

const useGelatoUserBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<BalanceQueryResponse>
) => {
    return useQuery<BalanceQueryResponse>(
        QUERY_KEYS.Token.GelatoBalance(walletAddress, networkId),
        async () => {
            try {
                const balance = await snxJSConnector?.gelatoContract?.balanceOf(walletAddress);

                return {
                    balance: (bigNumberFormatter(balance) < BALANCE_THRESHOLD ? 0 : bigNumberFormatter(balance)) || 0,
                };
            } catch (e) {
                console.log(e);
            }
            return { balance: 0 };
        },
        {
            ...options,
        }
    );
};

export default useGelatoUserBalanceQuery;
