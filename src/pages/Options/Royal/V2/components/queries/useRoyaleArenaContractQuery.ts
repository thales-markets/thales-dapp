import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { parseBytes32String } from '../../../../../../utils/formatters/ethers';

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

const useRoyaleArenaContractQuery = (season: number, address: string, options?: UseQueryOptions<RoyaleArenaData>) => {
    return useQuery<RoyaleArenaData>(
        QUERY_KEYS.Royale.RoyaleArenaContract(season, address),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(thalesRoyaleContract, season, address);
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
    address: string | null
): Promise<RoyaleArenaData> => {
    const roundInASeason = await RoyaleContract.roundInASeason(season);
    const [
        roundInASeasonStartTime,
        roundInASeasonEndTime,
        roundChoosingLength,
        canCloseRound,
        isPlayerAlive,
        seasonFinished,
        rewardCollectedPerSeason,
        rounds,
        token,
        targetPrice,
        position,
    ] = await Promise.all([
        RoyaleContract.roundInASeasonStartTime(season),
        RoyaleContract.roundInSeasonEndTime(season),
        RoyaleContract.roundChoosingLength(),
        RoyaleContract.canCloseRound(),
        RoyaleContract.isPlayerAliveInASpecificSeason(address, season),
        RoyaleContract.seasonFinished(season),
        RoyaleContract.rewardCollectedPerSeason(season, address),
        RoyaleContract.rounds(),
        RoyaleContract.oracleKey(),
        RoyaleContract.targetPricePerRoundPerSeason(season, roundInASeason),
        RoyaleContract.positionInARoundPerSeason(season, address, roundInASeason),
    ]);
    console.log('', season, roundInASeason, Number(position));
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
