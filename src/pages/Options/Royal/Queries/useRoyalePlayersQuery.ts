import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { NetworkId } from '@synthetixio/contracts-interface';

export enum UserStatus {
    RDY,
    NOTVERIFIED,
    NOTSIGNED,
}

export type User = {
    isAlive: boolean;
    address: string;
    number: number;
    name: string;
    avatar: string;
    status: UserStatus;
    season: number;
    deathRound?: string;
};

const useRoyalePlayersQuery = (networkId: NetworkId, selectedSeason: number, options?: UseQueryOptions<User[]>) => {
    return useQuery<User[]>(
        QUERY_KEYS.Royale.Players(),
        async () => {
            const baseUrl = 'https://api.thales.market/thales-royale/';
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            const map = new Map(result);
            const data = await thalesData.binaryOptions.thalesRoyalePlayers({
                season: selectedSeason,
                network: networkId,
            });
            const verified: User[] = [];
            const unverified: User[] = [];
            const unasigned: User[] = [];
            data.map((player: any) => {
                const isAlive = player.isAlive;
                const address = player.address;
                const number = player.number;
                const season = player.season;
                const deathRound = player.deathRound;

                if (map.has(player.address.toLowerCase())) {
                    const discordUser: any = map.get(player.address.toLowerCase());
                    const user = {
                        isAlive,
                        address,
                        number,
                        season,
                        deathRound,
                        name: discordUser.name,
                        avatar: discordUser.avatar,
                        status: UserStatus.RDY,
                    };
                    verified.push(user);
                    map.delete(player.address.toLowerCase());
                } else {
                    const user = {
                        isAlive,
                        address,
                        deathRound,
                        name: '',
                        number,
                        season,
                        avatar: '',
                        status: UserStatus.NOTVERIFIED,
                    };
                    unverified.push(user);
                }
            });
            Array.from(map).map((player: any) => {
                const user = {
                    isAlive: true,
                    address: player[0],
                    number: 0,
                    season: player[1].season,
                    name: player[1].name,
                    avatar: player[1].avatar,
                    status: UserStatus.NOTSIGNED,
                };
                unasigned.push(user);
            });
            return [...verified, ...unasigned, ...unverified];
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useRoyalePlayersQuery;
