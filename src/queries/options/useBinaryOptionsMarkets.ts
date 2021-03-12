import { useQuery } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { getPhaseAndEndDate } from '../../utils/options';

const susdTokenAddress = '0x57ab1e02fee23774580c119740129eac7081e9d3';

const useBinaryOptionsMarkets = () => {
    return useQuery<OptionsMarkets>(QUERY_KEYS.BinaryOptions.Markets, async () => {
        const optionsMarkets: OptionsMarkets = await snxData.binaryOptions.markets({ max: Infinity });
        for (const o of optionsMarkets) {
            o.longAddress = '';
            o.shortAddress = '';
            if ('trading' == getPhaseAndEndDate(o.biddingEndDate, o.maturityDate, o.expiryDate).phase) {
                const { options } = await snxJSConnector.binaryOptionsMarketDataContract.getMarketParameters(o.address);
                o.longAddress = options.long;
                o.shortAddress = options.short;
                //https://api.0x.org/sra/v4/orders?makerToken=

                let response = await fetch(
                    `https://api.0x.org/sra/v4/orderbook?baseToken=` + o.longAddress + '&quoteToken=' + susdTokenAddress
                );
                let responseJ = await response.json();
                const totalLong = responseJ.bids.total + responseJ.asks.total;

                response = await fetch(
                    `https://api.0x.org/sra/v4/orderbook?baseToken=` +
                        o.shortAddress +
                        '&quoteToken=' +
                        susdTokenAddress
                );
                responseJ = await response.json();
                const totalShort = responseJ.bids.total + responseJ.asks.total;

                o.openOrders = totalLong + totalShort;
            }
        }

        return optionsMarkets;
    });
};

export default useBinaryOptionsMarkets;
