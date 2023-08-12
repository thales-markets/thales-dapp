import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { BigNumber } from '@ethersproject/bignumber';
import { Network } from 'enums/network';
import { generalConfig } from 'config/general';

interface Preview {
    toToken: Token;
    fromToken: Token;
    fromTokenAmount: string;
    toTokenAmount: string;
    estimatedGas: number;
    protocols: [];
}

interface Token {
    address: string;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}

const suffix = '/quote?';

const useQuoteTokensQuery = (
    networkId: Network,
    fromToken: Token,
    toToken: Token,
    amount: BigNumber,
    protocols?: string[], // if empty string all liquidity protocols will be used
    options?: UseQueryOptions<Preview>
) => {
    return useQuery<Preview>(
        QUERY_KEYS.Swap.Quote(networkId, amount),
        async () => {
            let url = generalConfig.ONE_INCH_API_URL + networkId + suffix;
            const fromUrl = 'fromTokenAddress=' + fromToken.address;
            const toUrl = '&toTokenAddress=' + toToken.address;
            const amountUrl = '&amount=' + amount;
            const protocolsUrl = protocols?.length ? '&protocols=' + protocols?.toString() : '';
            url = url + fromUrl + toUrl + amountUrl + protocolsUrl;
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return result;
        },
        options
    );
};
export default useQuoteTokensQuery;
