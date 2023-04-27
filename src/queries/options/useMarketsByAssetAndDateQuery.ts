import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { POSITIONS } from 'constants/options';
import { uniq } from 'lodash';

type MarketInfo = {
    address: string;
    liquidity: number;
    price: number;
    strikePrice: number;
    discount: number;
};

const useMarketsByAssetAndDateQuery = (
    asset: string,
    date: Date,
    position: POSITIONS,
    options?: UseQueryOptions<MarketInfo[]>
) => {
    return useQuery<MarketInfo[]>(
        QUERY_KEYS.BinaryOptions.MarketsByAssetAndDate(asset, date, position),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketsForAssetAndStrikeDate(
                ethers.utils.formatBytes32String(asset),
                Number(date.getTime() / 1000)
            );

            const allMarkets = uniq(result).filter((value) => value !== '0x0000000000000000000000000000000000000000');

            const result1 = await (snxJSConnector as any).binaryOptionsMarketDataContract.getActiveMarketsInfoPerPosition(
                allMarkets,
                position === POSITIONS.UP ? 0 : 1
            );
            const finalResult = result1.filter((marketInfo: any) => Number(marketInfo.liquidity) !== 0);

            return finalResult.map((market: any) => {
                return {
                    address: market.market,
                    liquidity: ethers.utils.formatEther(market.liquidity),
                    price: ethers.utils.formatEther(market.price),
                    strikePrice: ethers.utils.formatEther(market.strikePrice),
                    discount: ethers.utils.formatEther(market.priceImpact),
                };
            });
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketsByAssetAndDateQuery;
