import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';
import thalesData from 'thales-data';
import { NetworkId } from '@synthetixio/contracts-interface';

export type FooterData = {
    reward: number;
    round: number;
    playersAlive: string;
    season: number;
    seasonFinished: boolean;
    winners: number;
};

const useRoyaleFooterQuery = (networkId: NetworkId, options?: UseQueryOptions<FooterData>) => {
    return useQuery<FooterData>(
        QUERY_KEYS.Royale.FooterData(),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            return getFromContract(thalesRoyaleContract, networkId);
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

const getFromContract = async (RoyaleContract: any, networkId: NetworkId): Promise<FooterData> => {
    const season = Number(await RoyaleContract.season());
    const [round, reward, seasonFinished] = await Promise.all([
        RoyaleContract.roundInASeason(season),
        RoyaleContract.rewardPerSeason(season === 0 ? 1 : season),
        RoyaleContract.seasonFinished(season),
    ]);

    const totalPlayers = await RoyaleContract.signedUpPlayersCount(season);
    const totalPlayersPerRoundPerSeason =
        Number(round) > 1 ? await RoyaleContract.totalPlayersPerRoundPerSeason(season, round) : totalPlayers;

    let playersAlive = '';

    playersAlive = totalPlayersPerRoundPerSeason + '/' + totalPlayers;
    const numberOfPlayers = Number(totalPlayersPerRoundPerSeason) > 0 ? Number(totalPlayersPerRoundPerSeason) : 1;

    const data = await thalesData.binaryOptions.thalesRoyalePlayers({
        season,
        network: networkId,
    });

    let winners = 0;

    data.map((player: any) => {
        const isAlive = player.isAlive;
        const deathRound = player.deathRound;
        (isAlive && seasonFinished) || (Number(deathRound) === Number(round) && seasonFinished) ? winners++ : '';
    });

    return {
        round: Number(round),
        reward:
            season === 0
                ? Number(ethers.utils.formatEther(reward))
                : Number(ethers.utils.formatEther(reward)) / numberOfPlayers,
        playersAlive,
        season,
        seasonFinished,
        winners,
    };
};

export default useRoyaleFooterQuery;
