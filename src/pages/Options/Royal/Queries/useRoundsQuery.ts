import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';

type RoundData = {
    round: number;
    season: number;
    result?: number;
    strikePrice?: number;
    finalPrice?: number;
    eliminatedPerRoundPerSeason: string;
    totalPlayersPerRoundPerSeason: string;
};

const useRoundsQuery = (selectedSeason: number, networkId: NetworkId, options?: UseQueryOptions<RoundData[]>) => {
    return useQuery<RoundData[]>(
        QUERY_KEYS.Royale.Rounds(networkId, selectedSeason),
        async () => {
            if (selectedSeason === 0) return [];
            const data = await thalesData.binaryOptions.thalesRoyaleRounds({
                season: selectedSeason,
                network: networkId,
            });
            const sortedRounds = data.sort((a: any, b: any) => (a.round > b.round ? 1 : -1));
            return sortedRounds;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useRoundsQuery;
