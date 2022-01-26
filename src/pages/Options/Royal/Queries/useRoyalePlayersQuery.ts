import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { NetworkId } from '@synthetixio/contracts-interface';
import snxJSConnector from 'utils/snxJSConnector';
import { truncateAddress } from 'utils/formatters/string';

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
const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;

const useRoyalePlayersQuery = (networkId: NetworkId, selectedSeason: number, options?: UseQueryOptions<User[]>) => {
    return useQuery<User[]>(
        QUERY_KEYS.Royale.Players(),
        async () => {
            let season = selectedSeason;
            if (season === 0) {
                const { thalesRoyaleContract } = snxJSConnector;
                if (thalesRoyaleContract) {
                    season = Number(await thalesRoyaleContract.season());
                }
            }

            const royalePlayersDataUrl = 'https://api.thales.market/royale-users/';
            const royalePlayersDataResponse = await fetch(royalePlayersDataUrl);
            const royalePlayersDataResult = JSON.parse(await royalePlayersDataResponse.text());

            const royalePlayersDataMap = new Map<string, any>(royalePlayersDataResult);

            const data = await thalesData.binaryOptions.thalesRoyalePlayers({
                season,
                network: networkId,
            });

            const users: User[] = [];

            data.map((player: any) => {
                const isAlive = player.isAlive;
                const address = player.address;
                const number = player.number;
                const season = player.season;
                const deathRound = player.deathRound;

                if (royalePlayersDataMap.has(player.address.toLowerCase())) {
                    const discordUser: any = royalePlayersDataMap.get(player.address.toLowerCase());
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
                    users.push(user);
                } else {
                    const user = {
                        isAlive,
                        address,
                        number,
                        season,
                        deathRound,
                        name:
                            truncateAddress(
                                address as any,
                                truncateAddressNumberOfCharacters,
                                truncateAddressNumberOfCharacters
                            ) ?? address,
                        avatar: '',
                        status: UserStatus.RDY,
                    };
                    users.push(user);
                }
            });

            return users;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useRoyalePlayersQuery;
