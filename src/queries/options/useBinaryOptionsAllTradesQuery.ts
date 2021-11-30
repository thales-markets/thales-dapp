import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { ExtendedTrades, ExtendedTrade, HistoricalOptionsMarketInfo } from 'types/options';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import ethBurnedOracleInstance from 'utils/contracts/ethBurnedOracleInstance';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { keyBy } from 'lodash';
import { sortOptionsMarkets } from 'utils/options';

const useBinaryOptionsAllTradesQuery = (networkId: number, options?: UseQueryOptions<ExtendedTrades>) => {
    return useQuery<ExtendedTrades>(
        QUERY_KEYS.BinaryOptions.AllTrades(),
        async () => {
            const [trades, rawOptionsMarkets] = await Promise.all([
                thalesData.binaryOptions.trades({
                    max: Infinity,
                    network: networkId,
                }),
                thalesData.binaryOptions.markets({
                    max: Infinity,
                    network: networkId,
                }),
            ]);

            const optionsMarkets: HistoricalOptionsMarketInfo[] = await Promise.all(
                rawOptionsMarkets.map(async (currentMarket: any) => {
                    if (currentMarket.customMarket) {
                        try {
                            const sportFeedContract = new ethers.Contract(
                                currentMarket.customOracle,
                                sportFeedOracleContract.abi,
                                (snxJSConnector as any).provider
                            );
                            const data: any = await Promise.all([
                                sportFeedContract.targetName(),
                                sportFeedContract.eventName(),
                                sportFeedContract.targetOutcome(),
                            ]);
                            currentMarket.country =
                                data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0];
                            currentMarket.eventName = data[1];
                            currentMarket.outcome = data[2];
                            return currentMarket;
                        } catch (e) {
                            const sportFeedContract = new ethers.Contract(
                                currentMarket.customOracle,
                                ethBurnedOracleInstance.abi,
                                (snxJSConnector as any).provider
                            );
                            const data: any = await Promise.all([
                                sportFeedContract.targetName(),
                                sportFeedContract.eventName(),
                                sportFeedContract.targetOutcome(),
                            ]);
                            currentMarket.country =
                                data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0];
                            currentMarket.eventName = data[1];
                            currentMarket.outcome =
                                currentMarket.eventName === 'Flippening Markets' ||
                                currentMarket.eventName === 'ETH/BTC market cap ratio'
                                    ? bigNumberFormatter(data[2]).toString()
                                    : Number(data[2]).toString();
                            return currentMarket;
                        }
                    } else {
                        return currentMarket;
                    }
                })
            );

            const optionsMarketsMap = keyBy(sortOptionsMarkets(optionsMarkets), 'address');

            trades.forEach((trade: ExtendedTrade) => {
                trade.marketItem = optionsMarketsMap[trade.market];
            });

            return trades;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useBinaryOptionsAllTradesQuery;
