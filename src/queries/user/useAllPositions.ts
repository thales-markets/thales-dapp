import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { OptionsMarkets, UsersAssets } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { NetworkId } from 'utils/network';

type PositionsData = {
    claimable: number;
    claimableAmount: number;
    matured: UsersAssets[];
    live: UsersAssets[];
};

const useAllPositions = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<PositionsData>) => {
    return useQuery<PositionsData>(
        QUERY_KEYS.User.AllPositions(walletAddress, networkId),
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });

            let claimable = 0;
            let claimableAmount = 0;

            const matured = await Promise.all(
                optionsMarkets
                    .filter((market) => market.maturityDate <= +Date.now())
                    .map((market) => {
                        return (snxJSConnector as any).binaryOptionsMarketDataContract
                            .getAccountMarketData(market.address, walletAddress)
                            .then((result: any) => {
                                if (bigNumberFormatter(result.balances.long) > 0 && market.result === 'long') {
                                    claimable++;
                                    claimableAmount += bigNumberFormatter(result.balances.long);
                                }
                                if (bigNumberFormatter(result.balances.short) > 0 && market.result === 'short') {
                                    claimable++;
                                    claimableAmount += bigNumberFormatter(result.balances.short);
                                }
                                return {
                                    market,
                                    balances: {
                                        long: bigNumberFormatter(result.balances.long),
                                        short: bigNumberFormatter(result.balances.short),
                                    },
                                };
                            });
                    })
            );

            const live = await Promise.all(
                optionsMarkets
                    .filter((market) => market.maturityDate > +Date.now())
                    .map((market) => {
                        return (snxJSConnector as any).binaryOptionsMarketDataContract
                            .getAccountMarketData(market.address, walletAddress)
                            .then((result: any) => {
                                return {
                                    market,
                                    balances: {
                                        long: bigNumberFormatter(result.balances.long),
                                        short: bigNumberFormatter(result.balances.short),
                                    },
                                };
                            });
                    })
            );

            const result = {
                claimable,
                claimableAmount,
                matured:
                    matured.length > 0
                        ? matured.filter((data) => {
                              return data.balances.long > 0 || data.balances.short > 0;
                          })
                        : [],
                live:
                    live.length > 0
                        ? live.filter((data) => {
                              return data.balances.long > 0 || data.balances.short > 0;
                          })
                        : [],
            };

            return result;
        },
        options
    );
};

export default useAllPositions;
