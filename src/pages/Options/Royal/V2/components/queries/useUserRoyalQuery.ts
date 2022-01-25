import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';

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

const BASE_URL = 'https://api.thales.market/royale-user/';

const useUserRoyalQuery = (walletAddress: string, options?: UseQueryOptions<User>) => {
    return useQuery<User>(
        QUERY_KEYS.Royale.User(walletAddress),
        async () => {
            if (walletAddress) {
                const royalePlayersDataUrl = BASE_URL + walletAddress;
                const royalePlayersDataResponse = await fetch(royalePlayersDataUrl);
                const royalePlayersDataResult = JSON.parse(await royalePlayersDataResponse.text());

                return royalePlayersDataResult.user;
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
