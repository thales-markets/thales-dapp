import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

export interface BalanceQueryResponse {
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
                const [balance] = await Promise.all([snxJSConnector?.gelatoContract?.balanceOf(walletAddress)]);

                return { balance: bigNumberFormatter(balance) || 0 };
            } catch (e) {
                console.log(e);
            }
            return { balance: 0 };
        },
        options
    );
};

export default useGelatoUserBalanceQuery;
