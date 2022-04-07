import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { parseBytes32String } from 'utils/formatters/ethers';

export type RoyaleArenaData = {
    roundChoosingLength: number;
    roundInASeasonStartTime: Date;
    roundInASeasonEndTime: Date;
    roundInASeason: number;
    canCloseRound: boolean;
    isPlayerAlive: boolean;
    seasonFinished: boolean;
    rewardCollectedPerSeason: boolean;
    rounds: number;
    token: string;
    targetPrice: string;
    position: number;
};

const useRoyaleArenaContractQuery = (season: number, tokenId: string, options?: UseQueryOptions<RoyaleArenaData>) => {
    return useQuery<RoyaleArenaData>(
        QUERY_KEYS.Royale.RoyaleArenaContract(season, tokenId),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(thalesRoyaleContract, season, tokenId);
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
    tokenId: string | null
): Promise<RoyaleArenaData> => {
    const roundInASeason = await RoyaleContract.roundInASeason(season);
    const [
        isPlayerAlive,
        roundInASeasonStartTime,
        roundInASeasonEndTime,
        roundChoosingLength,
        canCloseRound,
        seasonFinished,
        rewardCollectedPerSeason,
        rounds,
        token,
        targetPrice,
        position,
    ] = await Promise.all([
        RoyaleContract.isTokenAliveInASpecificSeason(tokenId, season),
        RoyaleContract.roundInASeasonStartTime(season),
        RoyaleContract.roundInSeasonEndTime(season),
        RoyaleContract.roundChoosingLength(),
        RoyaleContract.canCloseRound(),
        RoyaleContract.seasonFinished(season),
        RoyaleContract.tokenRewardCollectedPerSeason(tokenId),
        RoyaleContract.rounds(),
        RoyaleContract.oracleKeyPerSeason(season),
        RoyaleContract.targetPricePerRoundPerSeason(season, roundInASeason),
        RoyaleContract.tokenPositionInARoundPerSeason(tokenId, roundInASeason),
    ]);

    return {
        roundChoosingLength: Number(roundChoosingLength),
        roundInASeasonStartTime: new Date(Number(roundInASeasonStartTime) * 1000),
        roundInASeasonEndTime: new Date(Number(roundInASeasonEndTime) * 1000),
        roundInASeason: Number(roundInASeason),
        canCloseRound,
        isPlayerAlive,
        seasonFinished,
        rewardCollectedPerSeason,
        rounds: Number(rounds),
        token: parseBytes32String(token),
        targetPrice: ethers.utils.formatEther(targetPrice),
        position: Number(position),
    };
};

export default useRoyaleArenaContractQuery;
