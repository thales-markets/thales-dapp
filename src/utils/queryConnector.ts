import QUERY_KEYS from 'constants/queryKeys';
import { SpaceKey } from 'enums/governance';
import { Network } from 'enums/network';
import { QueryClient } from 'react-query';

type QueryConnector = {
    queryClient: QueryClient;
    setQueryClient: () => void;
};

// @ts-ignore
const queryConnector: QueryConnector = {
    setQueryClient: function () {
        if (this.queryClient === undefined) {
            this.queryClient = new QueryClient();
        }
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
            QUERY_KEYS.BinaryOptions.UserMarketPositions(optionsMarketAddress, walletAddress)
        );
    }
};

export const refetchRangeMarketQueries = (
    walletAddress: string,
    BOMContractAddress: string,
    marketAddress: string,
    networkId: Network
) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.RangedMarket(BOMContractAddress));

    if (walletAddress) {
        queryConnector.queryClient.invalidateQueries(
            QUERY_KEYS.BinaryOptions.UserRangedMarketPositions(marketAddress, walletAddress, networkId)
        );
    }
};

export const refetchUserNotifications = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.Notifications(walletAddress, networkId));
};

export const refetchUserOpenPositions = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.OpenPositions(walletAddress, networkId));
};

export const refetchUserProfileQueries = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Profile.Data(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Profile.OpenPositions(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Profile.ClaimablePositions(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Profile.ClosedPositions(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Profile.Trades(walletAddress, networkId));
};

export const refetchAmmData = (walletAddress: string, marketAddress: string) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.BinaryOptions.UserMarketPositions(marketAddress, walletAddress)
    );
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress));
};

export const refetchRangedAmmData = (walletAddress: string, marketAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.BinaryOptions.UserRangedMarketPositions(marketAddress, walletAddress, networkId)
    );
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress));
};

export const refetchTokenQueries = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.StakingData(networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.UserStakingData(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.UserVestingData(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.Transactions(walletAddress, networkId, undefined));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.Thales(walletAddress, networkId));
};

export const refetchLPStakingQueries = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.LPStaking(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.GelatoBalance(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.Gelato());
};

export const refetchUserTokenTransactions = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.Transactions(walletAddress, networkId, undefined));
};

export const refetchMigratedInvestorsRetroRewards = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.Token.MigratedInvestorsRetroRewards(walletAddress, networkId)
    );
};

export const refetchVestingEscrow = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.VestingEscrow(walletAddress, networkId));
};

export const refetchBalances = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.StableCoinBalance(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.WalletBalances.MultipleCollateral(walletAddress, networkId)
    );
};

export const refetchProposal = (spaceKey: SpaceKey, hash: string, walletAddress: string) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Governance.Proposal(spaceKey, hash, walletAddress));
};

export const refetchVaultData = (vaultAddress: string, walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.Data(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.UserData(vaultAddress, walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.PnL(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.Trades(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.UserTransactions(vaultAddress, networkId));
};

export const refetchLiquidityPoolData = (walletAddress: string, networkId: Network) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.Data(networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.UserData(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.PnL(networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.UserTransactions(networkId));
};

export const refetchSpeedMarketsLimits = (isChained: boolean, networkId: Network, walletAddress?: string) => {
    queryConnector.queryClient.invalidateQueries(
        isChained
            ? QUERY_KEYS.BinaryOptions.ChainedSpeedMarketsLimits(networkId, walletAddress)
            : QUERY_KEYS.BinaryOptions.SpeedMarketsLimits(networkId, walletAddress)
    );
};

export const refetchUserSpeedMarkets = (isChained: boolean, networkId: Network, walletAddress: string) => {
    queryConnector.queryClient.invalidateQueries(
        isChained
            ? QUERY_KEYS.BinaryOptions.UserChainedSpeedMarkets(networkId, walletAddress)
            : QUERY_KEYS.BinaryOptions.UserSpeedMarkets(networkId, walletAddress)
    );
};

export const refetchUserResolvedSpeedMarkets = (isChained: boolean, networkId: Network, walletAddress: string) => {
    queryConnector.queryClient.invalidateQueries(
        isChained
            ? QUERY_KEYS.BinaryOptions.UserResolvedChainedSpeedMarkets(networkId, walletAddress)
            : QUERY_KEYS.BinaryOptions.UserResolvedSpeedMarkets(networkId, walletAddress)
    );
};

export const refetchActiveSpeedMarkets = (isChained: boolean, networkId: Network) => {
    isChained
        ? queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.ActiveChainedSpeedMarkets(networkId))
        : queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.ActiveSpeedMarkets(networkId));
};

export const refetchPythPrice = (priceId: string, publishTime: number) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Prices.PythPrices(priceId, publishTime));
};

export const refetchStakingLeaderboardData = (walletAddress: string, networkId: Network, period: number) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.Token.StakersLeaderboardData(walletAddress, networkId, period)
    );
};

export const refetchCelerBridgeHistory = (walletAddress: string) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.CelerBridgeHistory(walletAddress));
};

export default queryConnector;
