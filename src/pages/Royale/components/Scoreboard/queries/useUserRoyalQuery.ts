import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import { truncateAddress } from 'utils/formatters/string';
import { NetworkId } from 'utils/network';

enum UserStatus {
    RDY,
    NOTVERIFIED,
    NOTSIGNED,
}

type User = {
    isAlive: boolean;
    address: string;
    number: number;
    name: string;
    avatar: string;
    status: UserStatus;
    season: number;
    deathRound?: string;
    defaultPosition?: number;
};

export const AnonimUser: User = {
    isAlive: false,
    address: '',
    number: 0,
    name: '',
    avatar: '',
    status: UserStatus.NOTSIGNED,
    season: 0,
    deathRound: '',
};

const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;

const BASE_URL = 'https://api.thales.market/royale-user/';
// const gruja = '0x36688C92700618f1D676698220F1AF44492811FE';

const useUserRoyalQuery = (
    walletAddress: string,
    networkId: NetworkId,
    selectedSeason: number,
    options?: UseQueryOptions<User>
) => {
    return useQuery<User>(
        QUERY_KEYS.Royale.User(walletAddress),
        async () => {
            if (walletAddress) {
                const royalePlayersDataUrl = BASE_URL + walletAddress;
                const royalePlayersDataResponse = await fetch(royalePlayersDataUrl);
                const royalePlayersDataResult = JSON.parse(await royalePlayersDataResponse.text());
                const royalePlayerFromGraph = await thalesData.binaryOptions.thalesRoyalePassportPlayers({
                    season: selectedSeason,
                    network: networkId,
                    address: walletAddress,
                });
                if (royalePlayerFromGraph.length > 0) {
                    const userFromGraph = royalePlayerFromGraph[0];
                    const user: User = {
                        isAlive: userFromGraph.isAlive,
                        address: walletAddress,
                        number: userFromGraph.number,
                        avatar: royalePlayersDataResult.user?.avatar ?? '',
                        name:
                            royalePlayersDataResult.user?.name ??
                            truncateAddress(
                                walletAddress as any,
                                truncateAddressNumberOfCharacters,
                                truncateAddressNumberOfCharacters
                            ),
                        status: UserStatus.RDY,
                        season: selectedSeason,
                        deathRound: userFromGraph.deathRound,
                        defaultPosition: userFromGraph.defaultPosition,
                    };
                    return user;
                } else {
                    const user: User = {
                        isAlive: false,
                        address: walletAddress,
                        number: 0,
                        avatar: royalePlayersDataResult.user.avatar,
                        name: royalePlayersDataResult.user.name,
                        status: UserStatus.NOTSIGNED,
                        season: selectedSeason,
                        deathRound: '',
                        defaultPosition: 0,
                    };
                    return user;
                }
            }
            return AnonimUser;
        },

        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useUserRoyalQuery;
