import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

export type FooterData = {
    reward: number;
    round: number;
    playersAlive: string;
    season: number;
};

const useRoyaleFooterQuery = (options?: UseQueryOptions<FooterData>) => {
    return useQuery<FooterData>(
        QUERY_KEYS.Royale.FooterData(),
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

const getFromContract = async (RoyaleContract: any): Promise<FooterData> => {
    const season = Number(await RoyaleContract.season());
    const [round, reward] = await Promise.all([
        RoyaleContract.roundInASeason(season),
        RoyaleContract.rewardPerSeason(season === 0 ? 1 : season),
        RoyaleContract.seasonFinished(season),
    ]);

    const totalPlayers = await RoyaleContract.signedUpPlayersCount(season);
    const totalPlayersPerRoundPerSeason =
        Number(round) > 1 ? await RoyaleContract.totalPlayersPerRoundPerSeason(season, round) : totalPlayers;

    let playersAlive = '';

    playersAlive = totalPlayersPerRoundPerSeason + '/' + totalPlayers;

    return {
        round: Number(round),
        reward:
            season === 0
                ? Number(ethers.utils.formatEther(reward))
                : Number(ethers.utils.formatEther(reward)) / Number(totalPlayersPerRoundPerSeason),
        playersAlive,
        season,
    };
};

export default useRoyaleFooterQuery;
