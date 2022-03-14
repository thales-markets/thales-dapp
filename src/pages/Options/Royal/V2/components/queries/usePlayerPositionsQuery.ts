import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import snxJSConnector from 'utils/snxJSConnector';

export type GraphPosition = {
    season: string;
    id: string;
    player: string;
    position: number;
    round: number;
    timestamp: number;
};

const usePlayerPositionsQuery = (
    selectedSeason: number,
    networkId: NetworkId,
    address: string,
    options?: UseQueryOptions<GraphPosition[]>
) => {
    return useQuery<GraphPosition[]>(
        QUERY_KEYS.Royale.PlayerPositions(networkId, selectedSeason, address),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const positions = await thalesData.binaryOptions.thalesRoyalePositions({
                    season: selectedSeason,
                    network: networkId,
                });
                return positions.filter((position: GraphPosition) => {
                    return position.player.toLowerCase() === address.toLowerCase();
                });
            }
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default usePlayerPositionsQuery;
