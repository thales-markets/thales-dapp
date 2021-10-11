import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import { NetworkId } from 'utils/network';
import { ethers } from 'ethers';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import ethBurnedOracleInstance from 'utils/contracts/ethBurnedOracleInstance';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const useBinaryOptionsMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<OptionsMarkets>) => {
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets(networkId),
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });
            return Promise.all(
                optionsMarkets.map(async (currentMarket) => {
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
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
