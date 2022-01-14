import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';

type SeasonData = {
    season: number;
};

const useSeasonsQuery = (networkId: NetworkId, options?: UseQueryOptions<SeasonData[]>) => {
    return useQuery<SeasonData[]>(
        QUERY_KEYS.Royale.Seasons(networkId),
        async () => {
            console.log('Seasons Query');
            const data = await thalesData.binaryOptions.thalesRoyaleSeasons({ network: networkId });
            const sortedSeasons = data.sort((a: any, b: any) => (a.round > b.round ? 1 : -1));
            return sortedSeasons;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useSeasonsQuery;
