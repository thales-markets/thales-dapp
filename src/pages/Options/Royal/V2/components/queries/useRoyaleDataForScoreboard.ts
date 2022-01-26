import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

type LatestRoyaleSeasonInfo = {
    seasonFinished: boolean;
    round: number;
    allSeasons: number[];
};

const useRoyaleDataForScoreboard = (selectedSeason: number, options?: UseQueryOptions<LatestRoyaleSeasonInfo>) => {
    return useQuery<LatestRoyaleSeasonInfo>(
        QUERY_KEYS.Royale.RoyaleDataForScoreboard(selectedSeason),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(selectedSeason, thalesRoyaleContract);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

const getFromContract = async (selectedSeason: number, RoyaleContract: any): Promise<LatestRoyaleSeasonInfo> => {
    const [season, seasonFinished, round] = await Promise.all([
        RoyaleContract.season(),
        RoyaleContract.seasonFinished(selectedSeason),
        RoyaleContract.roundInASeason(selectedSeason),
    ]);
    const allSeasons = [];
    for (let j = 1; j <= Number(season); j++) {
        allSeasons.push(j);
    }
    return {
        seasonFinished,
        round,
        allSeasons,
    };
};

export default useRoyaleDataForScoreboard;
