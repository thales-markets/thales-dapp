import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { NetworkId } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { truncateAddress } from 'utils/formatters/string';
import { generalConfig } from 'config/general';

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
    tokenId?: number;
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

            const royalePlayersDataUrl = `${generalConfig.API_URL}/royale-users/`;
            const royalePlayersDataResponse = await fetch(royalePlayersDataUrl);
            const royalePlayersDataResult = JSON.parse(await royalePlayersDataResponse.text());

            const royalePlayersDataMap = new Map<string, any>(royalePlayersDataResult);
            let data: any[];

            if (networkId === 10 && selectedSeason <= 5) {
                data = await thalesData.binaryOptions.thalesRoyalePlayers({
                    season,
                    network: networkId,
                });
            } else {
                data = await thalesData.binaryOptions.thalesRoyalePassportPlayers({
                    season,
                    network: networkId,
                });
            }

            const users: User[] = [];
            data.map((player: any) => {
                const isAlive = player.isAlive;
                const address = networkId === 10 && selectedSeason <= 5 ? player.address : player.owner;
                const number = player.number;
                const season = player.season;
                const deathRound = player.deathRound;

                const hasOwnerOrAddress =
                    networkId === 10 && selectedSeason <= 5
                        ? royalePlayersDataMap.has(player.address.toLowerCase())
                        : royalePlayersDataMap.has(player.owner.toLowerCase());
                if (hasOwnerOrAddress) {
                    const discordUser: any =
                        networkId === 10 && selectedSeason <= 5
                            ? royalePlayersDataMap.get(player.address.toLowerCase())
                            : royalePlayersDataMap.get(player.owner.toLowerCase());
                    const user = {
                        isAlive,
                        address,
                        number,
                        season,
                        deathRound,
                        tokenId: parseInt(player.id as any, 16),
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
                        tokenId: parseInt(player.id as any, 16),
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
