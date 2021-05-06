import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
// import { getPhaseAndEndDate } from '../../utils/options';
// import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from 'utils/network';
import { getPhaseAndEndDate } from '../../utils/options';

const useBinaryOptionsMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<OptionsMarkets>) => {
    // const {
    //     snxJS: { sUSD },
    // } = snxJSConnector as any;
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets(networkId),
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });
            for (const o of optionsMarkets) {
                if ('trading' == getPhaseAndEndDate(o.biddingEndDate, o.maturityDate, o.expiryDate).phase) {
                    const baseUrl = 'https://api.thales.market/options/' + networkId;
                    const response = await fetch(baseUrl + '/' + o.address);
                    const count = await response.text();
                    o.openOrders = parseInt(count);
                }
            }

            return optionsMarkets;
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
