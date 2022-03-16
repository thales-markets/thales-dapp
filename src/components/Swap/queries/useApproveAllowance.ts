import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';

dotenv.config();

interface Allowance {
    allowance: number;
}

interface Token {
    address: string;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}

const baseUrl = 'https://api.1inch.exchange/v4.0/';
const suffix = '/approve/allowance?';

const useApproveAllowance = (
    networkId: NetworkId,
    fromToken: Token,
    walletAddress: string,
    options?: UseQueryOptions<Allowance>
) => {
    return useQuery<Allowance>(
        QUERY_KEYS.Swap.Approve(networkId),
        async () => {
            let url = baseUrl + networkId + suffix;
            const fromUrl = 'tokenAddress=' + fromToken.address;
            const addressUrl = '&walletAddress=' + walletAddress;
            url = url + fromUrl + addressUrl;
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return result;
        },
        options
    );
};
export default useApproveAllowance;
