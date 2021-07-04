import { useQuery, UseQueryOptions } from 'react-query';
import { get0xBaseURL } from 'utils/0x';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import { UserOrder } from 'types/options';

const useUserOrdersQuery = (
    networkId: NetworkId,
    walletAddress: string,
    options?: UseQueryOptions<{ records: UserOrder[] }>
) => {
    const baseUrl = `${get0xBaseURL(networkId)}sra/v4/`;
    return useQuery<{ records: UserOrder[] }>(
        QUERY_KEYS.User.Orders(walletAddress),
        async () => {
            const ordersUrl = `${baseUrl}orders?trader=${walletAddress}`;
            const response = await fetch(ordersUrl);

            return response.json();
        },
        options
    );
};

export default useUserOrdersQuery;
