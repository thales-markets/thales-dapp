import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets, UsersAssets } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { NetworkId } from 'utils/network';

const useUserAssetsBalanceQuery = (
    networkId: NetworkId,
    markets: OptionsMarkets,
    walletAddress: string,
    options?: UseQueryOptions<UsersAssets[]>
) => {
    return useQuery<UsersAssets[]>(
        QUERY_KEYS.User.Assets(walletAddress, networkId),
        async () => {
            const positions = await Promise.all(
                markets.map((market) =>
                    (snxJSConnector as any).binaryOptionsMarketDataContract
                        .getAccountMarketData(market.address, walletAddress)
                        .then((result: any) => {
                            return {
                                market,
                                balances: {
                                    long: bigNumberFormatter(result.balances.long),
                                    short: bigNumberFormatter(result.balances.short),
                                },
                            };
                        })
                )
            );

            return positions.filter((data) => {
                return data.balances.long > 0 || data.balances.short > 0;
            });
        },
        options
    );
};

export default useUserAssetsBalanceQuery;
