import { NetworkId } from '../../utils/network';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';

export type DiscountMap = Record<string, { longPriceImpact: number; shortPriceImpact: number }> | undefined;

export const fetchDiscounts = (network: NetworkId, options?: UseQueryOptions<DiscountMap>) => {
    return useQuery<DiscountMap>(
        QUERY_KEYS.BinaryOptions.DiscountMap(network),
        async () => {
            try {
                const priceImpactFromContract = await (snxJSConnector as any).binaryOptionsMarketDataContract.getPriceImpactForAllActiveMarkets();

                const discountMap = Object.assign(
                    {},
                    ...priceImpactFromContract.map((item: any) => ({
                        [item.market.toLowerCase()]: {
                            longPriceImpact: bigNumberFormatter(item.upPriceImpact) * 100,
                            shortPriceImpact: bigNumberFormatter(item.downPriceImpact) * 100,
                        },
                    }))
                ) as DiscountMap;

                return discountMap;
            } catch (e) {
                console.log(e);
                return undefined;
            }
        },
        {
            refetchInterval: 30 * 1000,
            ...options,
        }
    );
};
