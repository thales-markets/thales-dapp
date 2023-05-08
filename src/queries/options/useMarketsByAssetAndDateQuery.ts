import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { Positions } from 'constants/options';
import { uniq } from 'lodash';
import { MarketInfo, RangedMarket, RangedMarketPerPosition } from 'types/options';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';

const useMarketsByAssetAndDateQuery = (
    networkId: NetworkId,
    asset: string,
    date: number,
    position: Positions,
    options?: UseQueryOptions<MarketInfo[] | RangedMarketPerPosition[]>
) => {
    return useQuery<MarketInfo[] | RangedMarketPerPosition[]>(
        QUERY_KEYS.BinaryOptions.MarketsByAssetAndDate(networkId, asset, date, position),
        async () => {
            if (position === Positions.UP || position === Positions.DOWN) {
                const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketsForAssetAndStrikeDate(
                    ethers.utils.formatBytes32String(asset),
                    Number(date / 1000)
                );
                const allMarkets = uniq(result).filter(
                    (value) => value !== '0x0000000000000000000000000000000000000000'
                );
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
            } else {
                const rangedMarkets: RangedMarket[] = await thalesData.binaryOptions.rangedMarkets({
                    max: Infinity,
                    network: networkId,
                    minMaturity: Number(date / 1000),
                    maxMaturity: Number(date / 1000),
                    currencyKey: ethers.utils.formatBytes32String(asset),
                });

                const allRangedMarkets: string[] = [];

                rangedMarkets.map((rangedMarket) => {
                    allRangedMarkets.push(rangedMarket.address);
                });

                const rangedMarketsInfo = await (snxJSConnector as any).binaryOptionsMarketDataContract.getRangedActiveMarketsInfoPerPosition(
                    allRangedMarkets,
                    position === Positions.IN ? 0 : 1
                );

                const finalResult = rangedMarketsInfo.filter(
                    (marketInfo: any) =>
                        Number(ethers.utils.formatEther(marketInfo.liquidity)) !== 0 &&
                        Number(ethers.utils.formatEther(marketInfo.price)) !== 0
                );

                return finalResult
                    .map((market: any) => {
                        const discount = Number(ethers.utils.formatEther(market.priceImpact));

                        return {
                            currencyKey: asset,
                            address: market.market,
                            liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                            price: calculatePotentialProfit(Number(ethers.utils.formatEther(market.price))),
                            leftPrice: Number(ethers.utils.formatEther(market.leftPrice)),
                            rightPrice: Number(ethers.utils.formatEther(market.rightPrice)),
                            discount: discount < 0 ? discount : 0,
                        };
                    })
                    .sort((a: RangedMarketPerPosition, b: RangedMarketPerPosition) => {
                        return b.leftPrice - a.leftPrice;
                    });
            }
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
