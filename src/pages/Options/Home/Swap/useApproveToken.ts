import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import { BigNumber } from '@ethersproject/bignumber';

dotenv.config();

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

const baseUrl = 'https://api.1inch.exchange/v4.0/';
const suffix = '/approve/transaction?';

const useApproveToken = (
    networkId: NetworkId,
    fromToken: Token,
    amount: BigNumber,
    options?: UseQueryOptions<Preview>
) => {
    return useQuery<Preview>(
        QUERY_KEYS.Swap.Approve(networkId),
        async () => {
            let url = baseUrl + networkId + suffix;
            const fromUrl = 'tokenAddress=' + fromToken.address;
            const amountUrl = '&amount=' + amount;
            url = url + fromUrl + amountUrl;
            const response = await fetch(url);
            const result = JSON.parse(await response.text());
            return result;
        },
        options
    );
};
export default useApproveToken;
