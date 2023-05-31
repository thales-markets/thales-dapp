import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { Positions } from 'constants/options';
import { uniq } from 'lodash';
import { MarketInfo, RangedMarket, RangedMarketPerPosition } from 'types/options';
import { NetworkId } from 'utils/network';
import thalesData from 'thales-data';
import { stableCoinFormatter } from 'utils/formatters/ethers';
import { truncDecimals } from 'utils/formatters/number';

const useMarketsByAssetAndDateQuery = (
    asset: string,
    date: number,
    position: Positions,
    networkId: NetworkId,
    options?: UseQueryOptions<MarketInfo[] | RangedMarketPerPosition[]>
) => {
    return useQuery<MarketInfo[] | RangedMarketPerPosition[]>(
        QUERY_KEYS.BinaryOptions.MarketsByAssetAndDate(asset, date, position, networkId),
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
                        const discount = Math.abs(Number(ethers.utils.formatEther(market.priceImpact)));

                        const price = stableCoinFormatter(market.price, networkId);
                        const newPrice = (1 - discount) * price;

                        const roi = calculatePotentialProfit(price);
                        const newRoi = calculatePotentialProfit(newPrice);

                        return {
                            currencyKey: asset,
                            address: market.market,
                            liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                            price: Number(truncDecimals(price, 2)),
                            roi: roi,
                            strikePrice: Number(ethers.utils.formatEther(market.strikePrice)),
                            discount: Math.floor(newRoi - roi),
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
                        stableCoinFormatter(marketInfo.price, networkId) !== 0
                );

                return finalResult
                    .map((market: any) => {
                        const discount = Math.abs(Number(ethers.utils.formatEther(market.priceImpact)));

                        const price = stableCoinFormatter(market.price, networkId);
                        const newPrice = (1 - discount) * price;

                        const roi = calculatePotentialProfit(price);
                        const newRoi = calculatePotentialProfit(newPrice);
                        return {
                            currencyKey: asset,
                            address: market.market,
                            liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                            price: Number(truncDecimals(price, 2)),
                            roi: roi,
                            leftPrice: Number(ethers.utils.formatEther(market.leftPrice)),
                            rightPrice: Number(ethers.utils.formatEther(market.rightPrice)),
                            discount: Math.round(newRoi - roi),
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
