import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

const useLatestSeasonQuery = (options?: UseQueryOptions<number>) => {
    return useQuery<number>(
        QUERY_KEYS.Royale.LatestSeason(),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const season = Number(await thalesRoyaleContract.season());
                return season;
            }
            return 0;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useLatestSeasonQuery;
