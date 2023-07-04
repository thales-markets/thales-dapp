import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { generalConfig } from 'config/general';

interface Spender {
    address: string;
}

const suffix = '/approve/spender';

const useApproveSpender = (networkId: Network, options?: UseQueryOptions<Spender>) => {
    return useQuery<Spender>(
        QUERY_KEYS.Swap.Approve(networkId),
        async () => {
            const url = generalConfig.ONE_INCH_API_URL + networkId + suffix;
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return result;
        },
        options
    );
};
export default useApproveSpender;
