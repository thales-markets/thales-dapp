import { Currency } from '@socket.tech/plugin';
import QUERY_KEYS from 'constants/queryKeys';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { aurora, avalanche, bsc, fantom, gnosis } from 'wagmi/chains';

interface TokenListOutput {
    success: boolean;
    result: Currency[];
}

export const SOURCE_NETWORK_IDS = [
    Network.Mainnet,
    Network.OptimismMainnet,
    bsc.id,
    gnosis.id,
    Network.PolygonMainnet,
    fantom.id,
    Network.ZkSync,
    Network.Base,
    avalanche.id,
    Network.Arbitrum,
    aurora.id,
];

// Check docs on: https://docs.socket.tech/socket-api/versioning
const baseUrl = 'https://api.socket.tech/v2/token-lists/from-token-list';
const queryParamFromChainId = '?fromChainId=';
const queryParamToChainId = '&toChainId=';
const queryParamShortList = '&isShortList=true';

const useAllSourceTokensQuery = (apiKey: string, toNetworkId: number, options?: UseQueryOptions<Currency[]>) => {
    return useQuery<Currency[]>(
        QUERY_KEYS.Bungee.Tokens(),
        async () => {
            const promises: any[] = [];
            const headers = { accept: 'application/json', 'API-KEY': apiKey };

            SOURCE_NETWORK_IDS.forEach((networkId: number) => {
                const url =
                    baseUrl +
                    queryParamFromChainId +
                    networkId +
                    queryParamToChainId +
                    toNetworkId +
                    queryParamShortList;

                promises.push(fetch(url, { headers }));
            });

            const responses = await Promise.all(promises);

            const results: Currency[] = [];
            for (const response of responses) {
                const body: TokenListOutput = JSON.parse(await response.text());
                results.push(...body.result);
            }

            return results;
        },
        options
    );
};
export default useAllSourceTokensQuery;
