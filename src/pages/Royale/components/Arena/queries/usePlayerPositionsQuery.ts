import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';

export type GraphPosition = {
    position: number;
    round: number;
};

const usePlayerPositionsQuery = (
    selectedSeason: number,
    networkId: NetworkId,
    tokenId: string,
    options?: UseQueryOptions<GraphPosition[]>
) => {
    return useQuery<any>(
        QUERY_KEYS.Royale.PlayerPositions(networkId, selectedSeason, tokenId),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const positions = await thalesRoyaleContract.getTokenPositions(tokenId);
                const result: GraphPosition[] = [];
                positions.map((position: any) => result.push({ round: position.round, position: position.position }));
                return result;
            }
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default usePlayerPositionsQuery;
