import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import thalesData from 'thales-data';

export type GraphPosition = {
    season: string;
    id: string;
    tokenPlayer: string;
    position: number;
    round: number;
    timestamp: number;
};

const usePlayerPositionsQuery = (
    selectedSeason: number,
    networkId: NetworkId,
    tokenId: string,
    options?: UseQueryOptions<GraphPosition[]>
) => {
    return useQuery<GraphPosition[]>(
        QUERY_KEYS.Royale.PlayerPositions(networkId, selectedSeason, tokenId),
        async () => {
            if (tokenId === '') return [];
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const positions = await thalesData.binaryOptions.thalesRoyalePassportPositions({
                    tokenPlayer: tokenId,
                    network: networkId,
                    season: selectedSeason,
                });
                return positions;
            }
        },
        {
            ...options,
        }
    );
};

export default usePlayerPositionsQuery;
