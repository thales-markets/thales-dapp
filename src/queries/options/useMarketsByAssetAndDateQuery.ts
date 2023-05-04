import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { Positions } from 'constants/options';
import { uniq } from 'lodash';
import { MarketInfo } from 'types/options';

const useMarketsByAssetAndDateQuery = (
    asset: string,
    date: number,
    position: Positions,
    options?: UseQueryOptions<MarketInfo[]>
) => {
    return useQuery<MarketInfo[]>(
        QUERY_KEYS.BinaryOptions.MarketsByAssetAndDate(asset, date, position),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketsForAssetAndStrikeDate(
                ethers.utils.formatBytes32String(asset),
                Number(date / 1000)
            );

            const allMarkets = uniq(result).filter((value) => value !== '0x0000000000000000000000000000000000000000');

            const result1 = await (snxJSConnector as any).binaryOptionsMarketDataContract.getActiveMarketsInfoPerPosition(
                allMarkets,
                position === Positions.UP ? 0 : 1
            );
            const finalResult = result1.filter((marketInfo: any) => Number(marketInfo.liquidity) !== 0);
            return finalResult
                .map((market: any) => {
                    const discount = Number(ethers.utils.formatEther(market.priceImpact));

                    return {
                        currencyKey: asset,
                        address: market.market,
                        liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                        price: calculatePotentialProfit(Number(ethers.utils.formatEther(market.price))),
                        strikePrice: Number(ethers.utils.formatEther(market.strikePrice)),
                        discount: discount < 0 ? discount : 0,
                    };
                })
                .sort((a: MarketInfo, b: MarketInfo) => {
                    return b.strikePrice - a.strikePrice;
                });
        },
        {
            ...options,
        }
    );
};

const calculatePotentialProfit = (price: number) => {
    return ((1 - price) / price) * 100;
};

export default useMarketsByAssetAndDateQuery;
