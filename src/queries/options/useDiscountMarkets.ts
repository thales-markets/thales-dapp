import { NetworkId } from '../../utils/network';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { generalConfig } from 'config/general';

type DiscountMap = Record<string, { longPriceImpact: number; shortPriceImpact: number }> | null;

// TODO: discuss with team to change logic and store and update markets in redux to avoid this
export let discountOrdersMap: DiscountMap = null;

export const fetchDiscounts = (network: NetworkId, options?: UseQueryOptions<DiscountMap>) => {
    return useQuery<DiscountMap>(
        QUERY_KEYS.BinaryOptions.DiscountMap(network),
        async () => {
            if (network === 420 || network === 10) {
                const baseUrl = `${generalConfig.API_URL}/discounts/${network}`;
                const response = await fetch(baseUrl);
                const json = await response.json();
                const discountMap = new Map(json);

                discountOrdersMap = discountMap as any;
                return discountMap as any;
            } else return new Map();
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};
