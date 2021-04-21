import QUERY_KEYS from 'constants/queryKeys';
import { QueryClient } from 'react-query';

type QueryConnector = {
    queryClient: QueryClient;
    setQueryClient: () => void;
};

// @ts-ignore
const queryConnector: QueryConnector = {
    setQueryClient: function () {
        this.queryClient = new QueryClient();
    },
};

export const refetchMarketQueries = (
    walletAddress: string,
    BOMContractAddress: string,
    optionsMarketAddress: string
) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.Market(BOMContractAddress));

    if (walletAddress) {
        queryConnector.queryClient.invalidateQueries(
            QUERY_KEYS.BinaryOptions.AccountMarketInfo(optionsMarketAddress, walletAddress)
        );
    }
};

export const refetchOrderbook = (optionsTokenAddress: string) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.MarketOrderBook(optionsTokenAddress));
};

export const refetchTrades = (marketAddress: string) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.Trades(marketAddress));
};

export default queryConnector;
