import { useQuery } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';

const useBinaryOptionsMarkets = () => {
    return useQuery<OptionsMarkets>(QUERY_KEYS.BinaryOptions.Markets, async () => {
        const optionsMarkets: OptionsMarkets = await snxData.binaryOptions.markets({ max: Infinity });
        for (const o of optionsMarkets) {
            o.openOrders = 1;
            o.longAddress = '';
            o.shortAddress = '';
            if (o.address == '0x80a54822111c86d4c139e8637ac39114784f881f') {
                const { options } = await snxJSConnector.binaryOptionsMarketDataContract.getMarketParameters(o.address);
                o.longAddress = options.long;
                o.shortAddress = options.short;
            }
        }

        return optionsMarkets;
    });
};

export default useBinaryOptionsMarkets;
