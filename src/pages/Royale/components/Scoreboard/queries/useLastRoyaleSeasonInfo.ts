import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

type LatestRoyaleSeasonInfo = {
    season: number;
    rounds: number;
    seasonStarted: boolean;
    seasonFinished: boolean;
    roundInASeason: number;
    roundChoosingLength: number;
    roundInASeasonStartTime: Date;
    roundInASeasonEndTime: Date;
    royaleSeasonCreationTime: Date;
    royaleSeasonEndTime: Date;
    signUpPeriod: Date;
    canStartRoyale: boolean;
    canStartNewSeason: boolean;
    pauseBetweenSeasonsTime: number;
};

const useLatestRoyaleSeasonInfo = (options?: UseQueryOptions<LatestRoyaleSeasonInfo>) => {
    return useQuery<LatestRoyaleSeasonInfo>(
        QUERY_KEYS.Royale.LatestRoyaleData(),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(thalesRoyaleContract);
        },
        {
            ...options,
        }
    );
};

const getFromContract = async (RoyaleContract: any): Promise<LatestRoyaleSeasonInfo> => {
    const season = Number(await RoyaleContract.season());
    const [
        roundInASeason,
        rounds,
        roundChoosingLength,
        roundInASeasonStartTime,
        roundInASeasonEndTime,
        royaleSeasonCreationTime,
        royaleSeasonEndTime,
        signUpPeriod,
        canStartRoyale,
        canStartNewSeason,
        pauseBetweenSeasonsTime,
        seasonStarted,
        seasonFinished,
    ] = await Promise.all([
        RoyaleContract.roundInASeason(season),
        RoyaleContract.rounds(),
        RoyaleContract.roundChoosingLength(),
        RoyaleContract.roundInASeasonStartTime(season),
        RoyaleContract.roundInSeasonEndTime(season),
        RoyaleContract.seasonCreationTime(season),
        RoyaleContract.royaleSeasonEndTime(season),
        RoyaleContract.signUpPeriod(),
        RoyaleContract.canStartRoyale(),
        RoyaleContract.canStartNewSeason(),
        RoyaleContract.pauseBetweenSeasonsTime(),
        RoyaleContract.seasonStarted(season),
        RoyaleContract.seasonFinished(season),
    ]);

    return {
        season,
        rounds,
        roundInASeason: Number(roundInASeason),
        roundChoosingLength: Number(roundChoosingLength),
        roundInASeasonStartTime: new Date(Number(roundInASeasonStartTime) * 1000),
        roundInASeasonEndTime: new Date(Number(roundInASeasonEndTime) * 1000),
        royaleSeasonCreationTime: new Date(Number(royaleSeasonCreationTime) * 1000),
        royaleSeasonEndTime: new Date(Number(royaleSeasonEndTime) * 1000),
        signUpPeriod: new Date((Number(royaleSeasonCreationTime) + Number(signUpPeriod)) * 1000),
        canStartRoyale,
        canStartNewSeason,
        pauseBetweenSeasonsTime: Number(pauseBetweenSeasonsTime),
        seasonStarted,
        seasonFinished,
    };
};

export default useLatestRoyaleSeasonInfo;
