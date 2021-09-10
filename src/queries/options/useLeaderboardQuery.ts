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
    profiles: Map<
        string,
        {
            mints: [];
            trades: [];
            excercises: [];
            unclaimed: [];
        }
    >;
}

const useLeaderboardQuery = (networkId: NetworkId, options?: UseQueryOptions<Leaderboard>) => {
    return useQuery<Leaderboard>(
        QUERY_KEYS.BinaryOptions.Leaderboard(networkId),
        async () => {
            const baseUrl = 'http://localhost:3002/leaderboard/' + networkId;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            const profiles = new Map();
            const leaderboard = result.data.map((record: any) => {
                profiles.set(record[0].toString().toLowerCase().trim(), record[1].profile);
                return {
                    walletAddress: record[0],
                    volume: record[1].volume,
                    trades: record[1].trades,
                    netProfit: record[1].netProfit,
                    investment: record[1].investment,
                    gain: record[1].gain,
                };
            });
            return { leaderboard, profiles };
        },
        options
    );
};
export default useLeaderboardQuery;
