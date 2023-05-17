import { NetworkId } from '../../utils/network';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AMM_MAX_BUFFER_PERCENTAGE } from 'constants/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';

export type OpenOrdersMap =
    | Record<
          string,
          {
              ordersCount: number;
              availableLongs: number;
              availableShorts: number;
              longPrice: number;
              shortPrice: number;
          }
      >
    | undefined;

export const useFetchAllMarketOrders = (network: NetworkId, options?: UseQueryOptions<OpenOrdersMap>) => {
    return useQuery<OpenOrdersMap>(
        QUERY_KEYS.BinaryOptions.OrdersCount(network),
        async () => {
            try {
                const [pricesFromContract, liquidityFromContract] = await Promise.all([
                    (snxJSConnector as any).binaryOptionsMarketDataContract.getPricesForAllActiveMarkets(),
                    (snxJSConnector as any).binaryOptionsMarketDataContract.getLiquidityForAllActiveMarkets(),
                ]);

                const mappedOpenOrdersMap = Object.assign(
                    {},
                    ...pricesFromContract.map((item: any, index: number) => ({
                        [item.market.toLowerCase()]: {
                            availableLongs:
                                bigNumberFormatter(liquidityFromContract[index].upLiquidity) *
                                AMM_MAX_BUFFER_PERCENTAGE,
                            availableShorts:
                                bigNumberFormatter(liquidityFromContract[index].downLiquidity) *
                                AMM_MAX_BUFFER_PERCENTAGE,
                            longPrice: stableCoinFormatter(item.upPrice, network),
                            shortPrice: stableCoinFormatter(item.downPrice, network),
                        },
                    }))
                ) as OpenOrdersMap;

                return mappedOpenOrdersMap;
            } catch (e) {
                console.log(e);
                return undefined;
            }
        },
        {
            refetchInterval: 60 * 1000,
            ...options,
        }
    );
};
