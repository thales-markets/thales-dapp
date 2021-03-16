import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import { getPhaseAndEndDate } from '../../utils/options';

const susdTokenAddress = '0x57ab1e02fee23774580c119740129eac7081e9d3';

const useBinaryOptionsMarketsQuery = (networkId: number, options?: UseQueryOptions<OptionsMarkets>) => {
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets,
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });
            for (const o of optionsMarkets) {
                if ('trading' == getPhaseAndEndDate(o.biddingEndDate, o.maturityDate, o.expiryDate).phase) {
                    let response = await fetch(
                        `https://api.0x.org/sra/v4/orderbook?baseToken=` +
                            o.longAddress +
                            '&quoteToken=' +
                            susdTokenAddress
                    );
                    let responseJ = await response.json();
                    const totalLong = responseJ.bids.total + responseJ.asks.total;
                    o.orders = [];
                    if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                        o.orders.push(responseJ.asks.records);
                    }
                    if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                        o.orders.push(responseJ.bids.records);
                    }

                    response = await fetch(
                        `https://api.0x.org/sra/v4/orderbook?baseToken=` +
                            o.shortAddress +
                            '&quoteToken=' +
                            susdTokenAddress
                    );
                    responseJ = await response.json();

                    if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                        o.orders.push(responseJ.asks.records);
                    }
                    if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                        o.orders.push(responseJ.bids.records);
                    }

                    const totalShort = responseJ.bids.total + responseJ.asks.total;

                    o.openOrders = totalLong + totalShort;
                }
            }

            return optionsMarkets;
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
