import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import { UserOrders } from 'types/options';
import { getUserOrders } from 'utils/1inch';

const useUserOrdersQuery = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<UserOrders>) => {
    return useQuery<UserOrders>(
        QUERY_KEYS.User.Orders(walletAddress, networkId),
        async () => {
            const orders = getUserOrders(networkId, walletAddress);

            return orders;
        },
        options
    );
};

export default useUserOrdersQuery;
