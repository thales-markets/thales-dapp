import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

type LatestRoyaleForUserInfo = {
    season: number;
    seasonStarted: boolean;
    seasonFinished: boolean;
    signUpPeriod: Date;
    canStartNewSeason: boolean;
    buyInAmount: number;
    currentRound: number;
};

const useLatestRoyaleForUserInfo = (selectedSeason: number, options?: UseQueryOptions<LatestRoyaleForUserInfo>) => {
    return useQuery<LatestRoyaleForUserInfo>(
        QUERY_KEYS.Royale.LatestRoyaleDataForUserCard(selectedSeason),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            let season = selectedSeason;
            if (season === 0) {
                const { thalesRoyaleContract } = snxJSConnector;
                if (thalesRoyaleContract) {
                    season = Number(await thalesRoyaleContract.season());
                }
            }

            return getFromContract(thalesRoyaleContract, season);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

const getFromContract = async (RoyaleContract: any, season: number): Promise<LatestRoyaleForUserInfo> => {
    const [
        seasonStarted,
        seasonFinished,
        signUpPeriod,
        canStartNewSeason,
        buyInAmount,
        royaleSeasonCreationTime,
        currentRound,
    ] = await Promise.all([
        RoyaleContract.seasonStarted(season),
        RoyaleContract.seasonFinished(season),
        RoyaleContract.signUpPeriod(),
        RoyaleContract.canStartNewSeason(),
        RoyaleContract.buyInAmount(),
        RoyaleContract.seasonCreationTime(season),
        RoyaleContract.roundInASeason(season),
    ]);
    return {
        season,
        canStartNewSeason,
        signUpPeriod: new Date((Number(royaleSeasonCreationTime) + Number(signUpPeriod)) * 1000),
        seasonStarted,
        seasonFinished,
        buyInAmount: Number(ethers.utils.formatEther(buyInAmount)),
        currentRound: Number(currentRound),
    };
};

export default useLatestRoyaleForUserInfo;
