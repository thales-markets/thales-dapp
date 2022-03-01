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
    positionInTheFirstRound: number;
};

const useLatestRoyaleForUserInfo = (
    selectedSeason: number,
    walletAddress: string,
    options?: UseQueryOptions<LatestRoyaleForUserInfo>
) => {
    return useQuery<LatestRoyaleForUserInfo>(
        QUERY_KEYS.Royale.LatestRoyaleDataForUserCard(selectedSeason, walletAddress),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            let season = selectedSeason;
            if (season === 0) {
                const { thalesRoyaleContract } = snxJSConnector;
                if (thalesRoyaleContract) {
                    season = Number(await thalesRoyaleContract.season());
                }
            }

            return getFromContract(thalesRoyaleContract, season, walletAddress);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

const getFromContract = async (
    RoyaleContract: any,
    season: number,
    walletAddress: string
): Promise<LatestRoyaleForUserInfo> => {
    const [
        seasonStarted,
        seasonFinished,
        signUpPeriod,
        canStartNewSeason,
        buyInAmount,
        royaleSeasonCreationTime,
        positionInTheFirstRound,
    ] = await Promise.all([
        RoyaleContract.seasonStarted(season),
        RoyaleContract.seasonFinished(season),
        RoyaleContract.signUpPeriod(),
        RoyaleContract.canStartNewSeason(),
        RoyaleContract.buyInAmount(),
        RoyaleContract.seasonCreationTime(season),
        RoyaleContract.positionInARoundPerSeason(season, walletAddress, 1),
    ]);
    return {
        season,
        canStartNewSeason,
        signUpPeriod: new Date((Number(royaleSeasonCreationTime) + Number(signUpPeriod)) * 1000),
        seasonStarted,
        seasonFinished,
        buyInAmount: Number(ethers.utils.formatEther(buyInAmount)),
        positionInTheFirstRound: Number(positionInTheFirstRound),
    };
};

export default useLatestRoyaleForUserInfo;
