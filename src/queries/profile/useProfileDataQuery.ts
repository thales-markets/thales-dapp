import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import { UserProfileData } from 'types/profile';

const useProfileDataQuery = (networkId: Network, walletAddress: string, options?: UseQueryOptions<UserProfileData>) => {
    return useQuery<UserProfileData>(
        QUERY_KEYS.Profile.Data(walletAddress, networkId),
        async () => {
            let [profit, volume, numberOfTrades, gain, investment] = [0, 0, 0, 0, 0];

            let userMarketTransactions = [],
                userTrades = [];

            const [userMarketTransactionsResponse, userTradesResponse] = await Promise.all([
                axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.OptionTransactions}/${networkId}?account=${walletAddress}`
                ),
                axios.get(`${generalConfig.API_URL}/${API_ROUTES.Trades}/${networkId}?taker=${walletAddress}`),
            ]);

            if (userMarketTransactionsResponse?.data) userMarketTransactions = userMarketTransactionsResponse?.data;
            if (userTradesResponse?.data) userTrades = userTradesResponse?.data;

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
                numberOfTrades += 1;

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
                profit,
                volume,
                numberOfTrades,
                gain,
                investment,
            };

            return result;
        },
        options
    );
};

export default useProfileDataQuery;
