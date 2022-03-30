import { useQuery, UseQueryOptions } from 'react-query';
import dotenv from 'dotenv';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

import thalesData from 'thales-data';

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
            const map = new Map<string, User>();
            const marketTx = await thalesData.binaryOptions.optionTransactions({
                network: networkId,
            });

            marketTx.map((tx: any) => {
                let [profit, volume, trades, gain, investment] = [0, 0, 0, 0, 0];
                if (map.has(tx.account)) {
                    const user: User = map.get(tx.account) as any;
                    [profit, volume, trades, gain, investment] = [
                        user.profit,
                        user.volume,
                        user.trades,
                        user.gain,
                        user.investment,
                    ];
                }

                if (tx.type === 'mint') {
                    volume += tx.amount / 2;
                    profit -= tx.amount / 2;
                    investment += tx.amount / 2;
                } else {
                    profit += tx.amount;
                }
                gain = profit / investment;
                map.set(tx.account, { walletAddress: tx.account, trades, gain, profit, volume, investment });
            });

            const trades = await thalesData.binaryOptions.trades({
                network: networkId,
            });

            trades.map((tx: any) => {
                let [profit, volume, trades, gain, investment] = [0, 0, 0, 0, 0];

                if (tx.orderSide === 'buy') {
                    if (map.has(tx.taker)) {
                        const user: User = map.get(tx.taker) as any;
                        [profit, volume, trades, gain, investment] = [
                            user.profit,
                            user.volume,
                            user.trades,
                            user.gain,
                            user.investment,
                        ];
                    }
                    trades += 1;
                    volume += tx.takerAmount;
                    profit -= tx.takerAmount;
                    investment += tx.takerAmount;
                    gain = profit / investment;
                    map.set(tx.taker, { walletAddress: tx.taker, trades, gain, profit, volume, investment });
                } else {
                    if (map.has(tx.maker)) {
                        const user: User = map.get(tx.maker) as any;
                        [profit, volume, trades, gain, investment] = [
                            user.profit,
                            user.volume,
                            user.trades,
                            user.gain,
                            user.investment,
                        ];
                    }
                    trades += 1;
                    volume += tx.makerAmount;
                    profit += tx.makerAmount;
                    gain = profit / investment;
                    map.set(tx.maker, { walletAddress: tx.maker, trades, gain, profit, volume, investment });
                }
            });

            return Array.from(map, ([name, value]) => ({ ...value, walletAddress: name }));
        },
        options
    );
};

export default useLeaderboardQuery;
