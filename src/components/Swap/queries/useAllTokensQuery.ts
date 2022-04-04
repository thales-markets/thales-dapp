import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

dotenv.config();

export interface Token {
    address: string;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}

const baseUrl = 'https://api.1inch.exchange/v4.0/';
const suffix = '/tokens';

const useAllTokensQuery = (networkId: NetworkId, options?: UseQueryOptions<Token[]>) => {
    return useQuery<Token[]>(
        QUERY_KEYS.Swap.Tokens(networkId),
        async () => {
            const url = baseUrl + networkId + suffix;
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return Object.values(result.tokens);
        },
        options
    );
};
export default useAllTokensQuery;
