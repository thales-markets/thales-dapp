import QUERY_KEYS from 'constants/queryKeys';
import { SpaceKey } from 'enums/governance';
import { QueryClient } from 'react-query';
import { NetworkId } from 'utils/network';

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
    networkId: NetworkId
) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.RangedMarket(BOMContractAddress));

    if (walletAddress) {
        queryConnector.queryClient.invalidateQueries(
            QUERY_KEYS.BinaryOptions.UserRangedMarketPositions(marketAddress, walletAddress, networkId)
        );
    }
};

export const refetchUserOpenPositions = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.UserOpenPositions(walletAddress, networkId));
};

export const refetchAmmData = (walletAddress: string, marketAddress: string) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.BinaryOptions.UserMarketPositions(marketAddress, walletAddress)
    );
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress));
};

export const refetchRangedAmmData = (walletAddress: string, marketAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.BinaryOptions.UserRangedMarketPositions(marketAddress, walletAddress, networkId)
    );
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.AmmMaxLimits(marketAddress));
};

export const refetchTokenQueries = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.StakingData(networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.UserStakingData(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.UserVestingData(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.Transactions(walletAddress, networkId, undefined));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.Thales(walletAddress, networkId));
};

export const refetchLPStakingQueries = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.LPStaking(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.GelatoBalance(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.Gelato());
};

export const refetchUserTokenTransactions = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.Transactions(walletAddress, networkId, undefined));
};

export const refetchMigratedInvestorsRetroRewards = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.Token.MigratedInvestorsRetroRewards(walletAddress, networkId)
    );
};

export const refetchVestingEscrow = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Token.VestingEscrow(walletAddress, networkId));
};

export const refetchBalances = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.StableCoinBalance(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.WalletBalances.MultipleCollateral(walletAddress, networkId)
    );
};

export const refetchProposal = (spaceKey: SpaceKey, hash: string, walletAddress: string) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Governance.Proposal(spaceKey, hash, walletAddress));
};

export const refetchVaultData = (vaultAddress: string, walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.Data(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.UserData(vaultAddress, walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.PnL(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.Trades(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.UserTransactions(vaultAddress, networkId));
};

export const refetchLiquidityPoolData = (walletAddress: string, networkId: NetworkId) => {
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.Data(networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.UserData(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.PnL(networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.UserTransactions(networkId));
};

export default queryConnector;
