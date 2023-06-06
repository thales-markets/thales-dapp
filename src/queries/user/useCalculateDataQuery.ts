import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

const useCalculateDataQuery = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.User.Data(walletAddress, networkId),
        async () => {
            let [profit, volume, trades, gain, investment] = [0, 0, 0, 0, 0];

            const [userMarketTransactions, userTrades] = await Promise.all([
                thalesData.binaryOptions.optionTransactions({
                    account: walletAddress,
                    network: networkId,
                }),
                thalesData.binaryOptions.trades({
                    taker: walletAddress,
                    network: networkId,
                }),
            ]);

            userMarketTransactions.map((tx: any) => {
                if (tx.type === 'mint') {
                    volume += tx.amount / 2;
                    profit -= tx.amount / 2;
                    investment += tx.amount / 2;
                } else {
                    profit += tx.amount;
                }
            });

            userTrades.map((tx: any) => {
                trades += 1;

                if (tx.orderSide === 'sell') {
                    profit += tx.makerAmount;
                    volume += tx.makerAmount;
                } else {
                    profit -= tx.takerAmount;
                    investment += tx.takerAmount;
                    volume += tx.takerAmount;
                }
            });

            gain = investment !== 0 ? profit / investment : 0;

            const result = {
                userMarketTransactions,
                trades: userTrades,
                userData: {
                    profit,
                    volume,
                    trades,
                    gain,
                    investment,
                },
            };

            return result;
        },
        options
    );
};

export default useCalculateDataQuery;
