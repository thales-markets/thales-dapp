import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import { NetworkId } from 'utils/network';
import { ethers } from 'ethers';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import snxJSConnector from 'utils/snxJSConnector';

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
                        currentMarket.country = data[0];
                        currentMarket.eventName = data[1];
                        currentMarket.outcome = data[2];
                        return currentMarket;
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
