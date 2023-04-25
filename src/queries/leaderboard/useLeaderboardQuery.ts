import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import notSigned from 'assets/images/royale/not-signed.svg';
import { truncateAddress } from 'utils/formatters/string';
import { generalConfig } from 'config/general';

type User = {
    walletAddress: string;
    avatar?: string;
    name?: string;
    trades: number;
    volume: number;
    profit: number;
    investment: number;
    rank?: number;
    gain: number;
    sticky?: boolean;
};

export interface Leaderboard {
    leaderboard: User[];
}

const useLeaderboardQuery = (networkId: NetworkId, options?: UseQueryOptions<User[]>) => {
    return useQuery<User[]>(
        QUERY_KEYS.BinaryOptions.Leaderboard(networkId),
        async () => {
            const royaleAPIRoute = `${generalConfig.API_URL}/royale-users/`;
            const royaleResponse = await fetch(royaleAPIRoute);
            const royalePlayers = await royaleResponse.json();

            const royalePlayersDataMap = new Map<string, any>(royalePlayers);

            const baseUrl = `${generalConfig.API_URL}/leaderboard/${networkId}`;
            const response = await fetch(baseUrl);
            const leaderboardData = await response.json();

            if (leaderboardData?.length) {
                leaderboardData.forEach((user: User, index: number) => {
                    leaderboardData[index]['avatar'] = royalePlayersDataMap.get(user.walletAddress)?.avatar
                        ? royalePlayersDataMap.get(user.walletAddress)?.avatar
                        : notSigned;
                    leaderboardData[index]['name'] = royalePlayersDataMap.get(user.walletAddress)?.name
                        ? royalePlayersDataMap.get(user.walletAddress)?.name
                        : truncateAddress(user.walletAddress, 5);
                });
            }

            if (!leaderboardData?.length) {
                return [];
            }

            return leaderboardData;
        },
        options
    );
};

export default useLeaderboardQuery;
