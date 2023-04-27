import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { MarketParametersInfo } from 'types/options';

const useBinaryOptionsMarketParametersInfoQuery = (
    marketAddress: string,
    options?: UseQueryOptions<MarketParametersInfo>
) => {
    return useQuery<MarketParametersInfo>(
        QUERY_KEYS.BinaryOptions.Market(marketAddress),
        async () => {
            const marketParametersInfo: MarketParametersInfo = {
                longAddress: '',
                shortAddress: '',
            };

            try {
                const marketParameters = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketParameters(
                    marketAddress
                );

                marketParametersInfo.longAddress = marketParameters.options.up;
                marketParametersInfo.shortAddress = marketParameters.options.down;

                return marketParametersInfo;
            } catch (e) {
                console.log(e);
                return marketParametersInfo;
            }
        },
        {
            ...options,
        }
    );
};

export default useBinaryOptionsMarketParametersInfoQuery;
