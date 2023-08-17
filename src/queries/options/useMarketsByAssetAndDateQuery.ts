import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { uniq } from 'lodash';
import { MarketInfo, RangedMarket, RangedMarketPerPosition } from 'types/options';
import { Network } from 'enums/network';
import thalesData from 'thales-data';
import { coinFormatter } from 'utils/formatters/ethers';
import { truncToDecimals } from 'utils/formatters/number';
import { Positions } from 'enums/options';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { ZERO_ADDRESS } from 'constants/network';

const useMarketsByAssetAndDateQuery = (
    asset: string,
    date: number,
    position: Positions,
    networkId: Network,
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
                const allMarkets = uniq(result).filter((value) => value !== ZERO_ADDRESS);
                const result1 = await (snxJSConnector as any).binaryOptionsMarketDataContract.getActiveMarketsInfoPerPosition(
                    allMarkets,
                    position === Positions.UP ? 0 : 1
                );

                const finalResult = result1.filter((marketInfo: any) => Number(marketInfo.liquidity) !== 0);
                let filterFlag = false;
                const data = finalResult.map((market: any) => {
                    const discount = Number(ethers.utils.formatEther(market.priceImpact));

                    const price = coinFormatter(market.price, networkId);
                    const newPrice = (1 - discount) * price;

                    const roi = calculatePotentialProfit(price);
                    const newRoi = calculatePotentialProfit(newPrice);

                    return {
                        currencyKey: asset,
                        address: market.market,
                        liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                        price: Number(truncToDecimals(price)),
                        roi: Math.floor(roi - newRoi) > 0 ? newRoi : roi,
                        strikePrice: Number(ethers.utils.formatEther(market.strikePrice)),
                        discount: Math.floor(roi - newRoi),
                        url: buildOptionsMarketLink(market.market),
                    };
                });

                const dataToFilter = data.sort((a: MarketInfo, b: MarketInfo) => {
                    return position === Positions.UP ? a.strikePrice - b.strikePrice : b.strikePrice - a.strikePrice;
                });

                return dataToFilter
                    .filter((market: MarketInfo) => {
                        if (filterFlag) {
                            return;
                        } else {
                            if (market.price < 0.1) filterFlag = true;
                            return market;
                        }
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
                        coinFormatter(marketInfo.price, networkId) !== 0
                );

                return finalResult
                    .map((market: any) => {
                        const discount = Number(ethers.utils.formatEther(market.priceImpact));

                        const price = coinFormatter(market.price, networkId);
                        const newPrice = (1 - discount) * price;

                        const roi = calculatePotentialProfit(price);
                        const newRoi = calculatePotentialProfit(newPrice);

                        return {
                            currencyKey: asset,
                            address: market.market,
                            liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                            price: Number(truncToDecimals(price)),
                            roi: Math.floor(roi - newRoi) > 0 ? newRoi : roi,
                            leftPrice: Number(ethers.utils.formatEther(market.leftPrice)),
                            rightPrice: Number(ethers.utils.formatEther(market.rightPrice)),
                            discount: Math.floor(roi - newRoi),
                            url: buildRangeMarketLink(market.market),
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
