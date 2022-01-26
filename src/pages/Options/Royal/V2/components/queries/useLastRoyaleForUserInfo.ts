import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

type LatestRoyaleSeasonInfo = {
    season: number;
    seasonStarted: boolean;
    seasonFinished: boolean;
    signUpPeriod: Date;
    canStartNewSeason: boolean;
    buyInAmount: number;
};

const useLatestRoyaleForUserInfo = (options?: UseQueryOptions<LatestRoyaleSeasonInfo>) => {
    return useQuery<LatestRoyaleSeasonInfo>(
        QUERY_KEYS.Royale.LatestRoyaleDataForUserCard(),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(thalesRoyaleContract);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

const getFromContract = async (RoyaleContract: any): Promise<LatestRoyaleSeasonInfo> => {
    const season = Number(await RoyaleContract.season());
    const [
        seasonStarted,
        seasonFinished,
        signUpPeriod,
        canStartNewSeason,
        buyInAmount,
        royaleSeasonCreationTime,
    ] = await Promise.all([
        RoyaleContract.seasonStarted(season),
        RoyaleContract.seasonFinished(season),
        RoyaleContract.signUpPeriod(),
        RoyaleContract.canStartNewSeason(),
        RoyaleContract.buyInAmount(),
        RoyaleContract.seasonCreationTime(season),
    ]);
    return {
        season,
        canStartNewSeason,
        signUpPeriod: new Date((Number(royaleSeasonCreationTime) + Number(signUpPeriod)) * 1000),
        seasonStarted,
        seasonFinished,
        buyInAmount,
    };
};

export default useLatestRoyaleForUserInfo;
