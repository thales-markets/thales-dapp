import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

dotenv.config();

export interface Leaderboard {
    leaderboard: [
        {
            walletAddress: string;
            trades: number;
            volume: number;
            netProfit: number;
            investment: number;
            gain: number;
        }
    ];
}

const useLeaderboardQuery = (networkId: NetworkId, options?: UseQueryOptions<Leaderboard>) => {
    return useQuery<Leaderboard>(
        QUERY_KEYS.BinaryOptions.Leaderboard(networkId),
        async () => {
            const baseUrl = 'https://api.thales.market/leaderboard/' + networkId;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            const leaderboard = result.map((record: any) => {
                return {
                    walletAddress: record[0],
                    volume: record[1].volume,
                    trades: record[1].trades,
                    netProfit: record[1].netProfit,
                    investment: record[1].investment,
                    gain: record[1].gain,
                };
            });

            return { leaderboard };
        },
        options
    );
};
export default useLeaderboardQuery;
