import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

dotenv.config();

type User = {
    walletAddress: string;
    trades: number;
    volume: number;
    profit: number;
    investment: number;
    gain: number;
};

export interface Leaderboard {
    leaderboard: User[];
}

const useLeaderboardQuery = (networkId: NetworkId, options?: UseQueryOptions<User[]>) => {
    return useQuery<User[]>(
        QUERY_KEYS.BinaryOptions.Leaderboard(networkId),
        async () => {
            const baseUrl = 'https://api.thales.market/leaderboard/' + networkId;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            console.log(result);
            if (result === 'Bad Request') {
                return [];
            }
            return result;
        },
        options
    );
};

export default useLeaderboardQuery;
