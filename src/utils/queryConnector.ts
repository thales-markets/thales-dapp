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

export const refetchRangeMarketQueries = (
    walletAddress: string,
    BOMContractAddress: string,
    marketAddress: string,
    networkId: NetworkId
) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.RangedMarket(BOMContractAddress));

    if (walletAddress) {
        queryConnector.queryClient.invalidateQueries(
            QUERY_KEYS.WalletBalances.Positions(marketAddress, walletAddress, networkId)
        );
    }
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

export const refetchMigratedRetroRewards = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.MigratedRetroRewards(walletAddress, networkId));
};

export const refetchMigratedInvestorsRetroRewards = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.Token.MigratedInvestorsRetroRewards(walletAddress, networkId)
    );
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

export const refetchAmmData = (walletAddress: string, marketAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.BinaryOptions.AccountMarketInfo(marketAddress, walletAddress)
    );
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.Synths(walletAddress, networkId));
};

export const refetchTokenQueries = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Staking.Thales(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Staking.Escrow(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.Thales(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.StakingRewards(walletAddress, networkId));
};

export const refetchLPStakingQuery = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.LPStaking(walletAddress, networkId));
};

export const refetchWalletBalances = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.WalletBalances.MultipleCollateral(walletAddress, networkId),
        {
            refetchActive: true,
            refetchInactive: true,
        }
    );
};

export default queryConnector;
