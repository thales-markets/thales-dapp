import axios from 'axios';
import { generalConfig } from 'config/general';
import { CACHE_PREFIX_KEYS, WAIT_PERIOD_AFTER_CACHE_INVALIDATION_IN_SECONDS } from 'constants/cache';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
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

const getCacheKey = (prefixKey: string, keys: any[]) => {
    keys.unshift(prefixKey);

    return keys
        .filter((item) => item)
        .map((item) => {
            if (typeof item !== 'string') return item?.toString();
            return item?.toLowerCase();
        })
        .join('-');
};

const invalidateCache = async (cacheKeys: string[]) => {
    try {
        await axios.post(`${generalConfig.API_URL}/${API_ROUTES.CacheControl}`, {
            cacheKeys: cacheKeys,
        });

        return;
    } catch (e) {
        console.log('Error while invalidating cache on API ', e);
        return;
    }
};

const wait = (seconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
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

export const refetchUserNotifications = async (walletAddress: string, networkId: Network) => {
    await invalidateCache([
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.PositionBalance, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.RangePositionBalance, [networkId, walletAddress]),
    ]);

    await wait(WAIT_PERIOD_AFTER_CACHE_INVALIDATION_IN_SECONDS);

    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.Notifications(walletAddress, networkId));
};

export const refetchUserOpenPositions = async (walletAddress: string, networkId: Network) => {
    await invalidateCache([
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.PositionBalance, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.RangePositionBalance, [networkId, walletAddress]),
    ]);

    await wait(WAIT_PERIOD_AFTER_CACHE_INVALIDATION_IN_SECONDS);

    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.OpenPositions(walletAddress, networkId));
};

export const refetchUserProfileQueries = async (walletAddress: string, networkId: Network) => {
    await invalidateCache([
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.OptionTransactions, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.Trades, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.PositionBalance, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.RangePositionBalance, [networkId, walletAddress]),
    ]);

    await wait(WAIT_PERIOD_AFTER_CACHE_INVALIDATION_IN_SECONDS);

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

export const refetchBalances = async (walletAddress: string, networkId: Network) => {
    await invalidateCache([
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.PositionBalance, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.RangePositionBalance, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.OptionTransactions, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.Trades, [networkId, walletAddress]),
    ]);

    await wait(WAIT_PERIOD_AFTER_CACHE_INVALIDATION_IN_SECONDS);

    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.WalletBalances.StableCoinBalance(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.WalletBalances.MultipleCollateral(walletAddress, networkId)
    );
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.User.OpenPositions(walletAddress, networkId));
};

export const refetchVaultData = async (
    vaultAddress: string,
    walletAddress: string,
    networkId: Network,
    round: number
) => {
    await invalidateCache([
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.VaultTransactions, [networkId, vaultAddress, round]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.VaultUserTransactions, [networkId, vaultAddress]),
    ]);

    await wait(WAIT_PERIOD_AFTER_CACHE_INVALIDATION_IN_SECONDS);

    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.Data(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.UserData(vaultAddress, walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.PnL(vaultAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.Trades(vaultAddress, networkId, round));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.Vault.UserTransactions(vaultAddress, networkId));
};

export const refetchLiquidityPoolData = async (walletAddress: string, networkId: Network, round: number) => {
    await invalidateCache([
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.LiquidityPoolTransactions, [networkId, walletAddress]),
        getCacheKey(CACHE_PREFIX_KEYS.DigitalOptions.LiquidityPoolTransactions, [networkId, round]),
    ]);

    await wait(WAIT_PERIOD_AFTER_CACHE_INVALIDATION_IN_SECONDS);

    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.Data(networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.UserData(walletAddress, networkId));
    queryConnector.queryClient.invalidateQueries(QUERY_KEYS.LiquidityPool.PnL(networkId));
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.LiquidityPool.UserTransactions(networkId, undefined, round)
    );
    queryConnector.queryClient.invalidateQueries(
        QUERY_KEYS.LiquidityPool.UserTransactions(networkId, walletAddress, undefined)
    );
};

export default queryConnector;
