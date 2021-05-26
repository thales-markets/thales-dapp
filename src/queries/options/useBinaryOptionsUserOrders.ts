import { useQuery, UseQueryOptions } from 'react-query';
import { get0xBaseURL } from 'utils/0x';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarketInfo } from 'types/options';

const useBinaryOptionsUserOrders = (
    networkId: NetworkId,
    walletAddress: string,
    options?: UseQueryOptions<OptionsMarketInfo>
) => {
    const baseUrl = `${get0xBaseURL(networkId)}sra/v4/`;
    return useQuery<any>(
        QUERY_KEYS.User.Orders(walletAddress),
        async () => {
            const ordersUrl = `${baseUrl}orders?trader=${walletAddress}`;
            const response = await fetch(ordersUrl);

            return response.json();
        },
        options
    );
};

export default useBinaryOptionsUserOrders;
