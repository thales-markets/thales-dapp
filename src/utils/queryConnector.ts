import { SpaceKey } from 'constants/governance';
import QUERY_KEYS from 'constants/queryKeys';
import { QueryClient } from 'react-query';
import { NetworkId } from 'utils/network';

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

export const refetchUserTrades = (marketAddress: string, walletAddress: string) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.UserTrades(marketAddress, walletAddress));
};

export const refetchWatchlistedMarkets = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.Watchlist(walletAddress, networkId));
};

export const refetchOrders = (networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.Orders('buys', networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.Orders('sells', networkId));
};

export const refetchRetroAirdrop = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.RetroAirdrop(walletAddress, networkId));
};

export const refetchOngoingAirdrop = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.OngoingAirdrop(walletAddress, networkId));
};

export const refetchVestingBalance = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.Vesting(walletAddress, networkId));
};

export const refetchUserTokenTransactions = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.Transactions(walletAddress, networkId));
};

export const refetchUserBalance = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.Synths(walletAddress, networkId));
};

export const refetchProposal = (spaceKey: SpaceKey, hash: string, walletAddress: string) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Governance.Proposal(spaceKey, hash, walletAddress));
};

export default queryConnector;
