import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

export type FooterData = {
    reward: number;
    rewardPerWinnerPerSeason: number;
    round: number;
    playersAlive: string;
    season: number;
    seasonFinished: boolean;
};

const useRoyaleFooterQuery = (selectedSeason: number, options?: UseQueryOptions<FooterData>) => {
    return useQuery<FooterData>(
        QUERY_KEYS.Royale.FooterData(selectedSeason),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(thalesRoyaleContract, selectedSeason);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

const getFromContract = async (RoyaleContract: any, selectedSeason: number): Promise<FooterData> => {
    const seasonContract = Number(await RoyaleContract.season());
    const season = selectedSeason === seasonContract ? seasonContract : selectedSeason;
    const [round, reward, rewardPerWinnerPerSeason, seasonFinished] = await Promise.all([
        RoyaleContract.roundInASeason(season),
        RoyaleContract.rewardPerSeason(season === 0 ? 1 : season),
        RoyaleContract.rewardPerWinnerPerSeason(season === 0 ? 1 : season),
        RoyaleContract.seasonFinished(season),
    ]);

    const totalPlayers = await RoyaleContract.signedUpPlayersCount(season);
    const totalPlayersPerRoundPerSeason =
        Number(round) > 1 ? await RoyaleContract.totalPlayersPerRoundPerSeason(season, round) : totalPlayers;

    let playersAlive = '';

    playersAlive = totalPlayersPerRoundPerSeason + '/' + totalPlayers;
    const numberOfPlayers = Number(totalPlayersPerRoundPerSeason) > 0 ? Number(totalPlayersPerRoundPerSeason) : 1;

    return {
        round: Number(round),
        reward:
            season === 0
                ? Number(ethers.utils.formatEther(reward))
                : Number(ethers.utils.formatEther(reward)) / numberOfPlayers,
        rewardPerWinnerPerSeason: Number(ethers.utils.formatEther(rewardPerWinnerPerSeason)),
        playersAlive,
        season,
        seasonFinished,
    };
};

export default useRoyaleFooterQuery;
