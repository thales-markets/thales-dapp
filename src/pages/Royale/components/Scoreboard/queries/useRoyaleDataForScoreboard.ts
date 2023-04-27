import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

type LatestRoyaleSeasonInfo = {
    seasonStarted: boolean;
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
            ...options,
        }
    );
};

const getFromContract = async (selectedSeason: number, RoyaleContract: any): Promise<LatestRoyaleSeasonInfo> => {
    const [season, seasonStarted, seasonFinished, round] = await Promise.all([
        RoyaleContract.season(),
        RoyaleContract.seasonStarted(selectedSeason),
        RoyaleContract.seasonFinished(selectedSeason),
        RoyaleContract.roundInASeason(selectedSeason),
    ]);
    const allSeasons = [];
    for (let j = 1; j <= Number(season); j++) {
        allSeasons.push(j);
    }
    return {
        seasonStarted,
        seasonFinished,
        round,
        allSeasons,
    };
};

export default useRoyaleDataForScoreboard;
