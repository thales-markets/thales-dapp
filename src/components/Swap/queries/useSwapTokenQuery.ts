import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import { BigNumber } from '@ethersproject/bignumber';

dotenv.config();

interface Swap {
    toToken: Token;
    fromToken: Token;
    fromTokenAmount: string;
    fromAddress: string;
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

const baseUrl = 'https://api.1inch.exchange/v4.0/';
const suffix = '/swap?';

const useSwapTokenQuery = (
    networkId: NetworkId,
    fromToken: Token,
    toToken: Token,
    fromAddress: string,
    amount: BigNumber,
    options?: UseQueryOptions<Swap>
) => {
    return useQuery<Swap>(
        QUERY_KEYS.Swap.Swap(networkId),
        async () => {
            let url = baseUrl + networkId + suffix;
            const fromUrl = 'fromTokenAddress=' + fromToken.address;
            const toUrl = '&toTokenAddress=' + toToken.address;
            const fromAddUrl = '&fromAddress=' + fromAddress;
            const slippage = '&slippage=1';

            const amountUrl = '&amount=' + amount;
            url = url + fromUrl + toUrl + amountUrl + fromAddUrl + slippage;
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return result;
        },
        options
    );
};
export default useSwapTokenQuery;
