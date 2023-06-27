import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';

interface Spender {
    address: string;
}

const baseUrl = 'https://api.1inch.exchange/v4.0/';
const suffix = '/approve/spender';

const useApproveSpender = (networkId: NetworkId, options?: UseQueryOptions<Spender>) => {
    return useQuery<Spender>(
        QUERY_KEYS.Swap.Approve(networkId),
        async () => {
            const url = baseUrl + networkId + suffix;
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return result;
        },
        options
    );
};
export default useApproveSpender;
