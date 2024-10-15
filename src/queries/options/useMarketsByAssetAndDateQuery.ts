import axios from 'axios';
import { generalConfig } from 'config/general';
import { ZERO_ADDRESS } from 'constants/network';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { ethers } from 'ethers';
import { uniq } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';
import { coinFormatter, truncToDecimals } from 'thales-utils';
import { MarketInfo, RangedMarket, RangedMarketPerPosition } from 'types/options';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import { getContractForInteraction, getIsDeprecatedCurrency } from '../../utils/options';

const BATCH_LIMIT = 30;

const useMarketsByAssetAndDateQuery = (
    asset: string,
    date: number,
    position: Positions,
    networkId: Network,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<MarketInfo[] | RangedMarketPerPosition[]>
) => {
    return useQuery<MarketInfo[] | RangedMarketPerPosition[]>(
        QUERY_KEYS.BinaryOptions.MarketsByAssetAndDate(asset, date, position, networkId, isDeprecatedCurrency),
        async () => {
            const { binaryOptionsMarketDataContract, binaryOptionsMarketDataUSDCContract } = snxJSConnector;
            const binaryOptionsMarketDataContractForInteraction = getContractForInteraction(
                networkId,
                isDeprecatedCurrency,
                binaryOptionsMarketDataContract,
                binaryOptionsMarketDataUSDCContract
            );

            console.log(binaryOptionsMarketDataContractForInteraction?.address, isDeprecatedCurrency);

            if (position === Positions.UP || position === Positions.DOWN) {
                const result = await binaryOptionsMarketDataContractForInteraction?.getMarketsForAssetAndStrikeDate(
                    ethers.utils.formatBytes32String(asset),
                    Number(date / 1000)
                );
                const allMarkets = uniq(result).filter((value) => value !== ZERO_ADDRESS);
                const result1 = await binaryOptionsMarketDataContractForInteraction?.getActiveMarketsInfoPerPosition(
                    allMarkets,
                    position === Positions.UP ? 0 : 1
                );

                const finalResult = result1.filter((marketInfo: any) => Number(marketInfo.liquidity) !== 0);
                let filterFlag = false;
                const data = finalResult.map((market: any) => {
                    const discount = Number(ethers.utils.formatEther(market.priceImpact));

                    const price = coinFormatter(market.price, networkId, undefined, isDeprecatedCurrency);
                    const newPrice = (1 - discount) * price;

                    const roi = calculatePotentialProfit(price);
                    const newRoi = calculatePotentialProfit(newPrice);

                    return {
                        currencyKey: asset,
                        address: market.market,
                        liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                        price: Number(truncToDecimals(price, 3)),
                        roi: Math.floor(roi - newRoi) > 0 ? newRoi : roi,
                        strikePrice: Number(ethers.utils.formatEther(market.strikePrice)),
                        discount: Math.floor(roi - newRoi),
                        url: buildOptionsMarketLink(market.market, isDeprecatedCurrency),
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
                const rangedMarketsResponse = await axios.post(
                    `${generalConfig.API_URL}/${API_ROUTES.RangeMarketsList}/${networkId}?min-maturity=${Number(
                        date / 1000
                    )}&max-maturity=${Number(date / 1000)}&currency-key=${ethers.utils.formatBytes32String(asset)}`
                );

                const rangedMarkets: RangedMarket[] = rangedMarketsResponse?.data
                    ? rangedMarketsResponse.data.filter((market: any) => {
                          const isDeprecated = getIsDeprecatedCurrency(networkId, market.managerAddress);
                          return (isDeprecatedCurrency && isDeprecated) || (!isDeprecatedCurrency && !isDeprecated);
                      })
                    : [];

                const allRangedMarkets = new Map();

                rangedMarkets.map((rangedMarket, index: number) => {
                    const batchCounter = Math.floor(index / BATCH_LIMIT); // calculate batch counter for rangedMarket.
                    const batch = allRangedMarkets.get(batchCounter); // get the batch for counter
                    // if batch exist we push the market if it does not we initialize the batch with it.
                    if (batch) {
                        batch.push(rangedMarket.address);
                        allRangedMarkets.set(batchCounter, batch);
                    } else {
                        allRangedMarkets.set(batchCounter, [rangedMarket.address]);
                    }
                });

                //EXECUTE BATCH
                const result: any = [];
                const promises: any = [];

                Array.from(allRangedMarkets).map(async (markets) => {
                    promises.push(
                        binaryOptionsMarketDataContractForInteraction
                            ?.getRangedActiveMarketsInfoPerPosition(markets[1], position === Positions.IN ? 0 : 1)
                            .then((rangedMarketsInfo: any) => {
                                result.push(...rangedMarketsInfo);
                            })
                    );
                });
                await Promise.all(promises);
                // EXECUTE BATCH

                const finalResult = result.filter(
                    (marketInfo: any) =>
                        Number(ethers.utils.formatEther(marketInfo.liquidity)) !== 0 &&
                        coinFormatter(marketInfo.price, networkId, undefined, isDeprecatedCurrency) !== 0
                );

                return finalResult
                    .map((market: any) => {
                        const discount = Number(ethers.utils.formatEther(market.priceImpact));

                        const price = coinFormatter(market.price, networkId, undefined, isDeprecatedCurrency);
                        const newPrice = (1 - discount) * price;

                        const roi = calculatePotentialProfit(price);
                        const newRoi = calculatePotentialProfit(newPrice);

                        return {
                            currencyKey: asset,
                            address: market.market,
                            liquidity: Number(ethers.utils.formatEther(market.liquidity)),
                            price: Number(truncToDecimals(price, 3)),
                            roi: Math.floor(roi - newRoi) > 0 ? newRoi : roi,
                            leftPrice: Number(ethers.utils.formatEther(market.leftPrice)),
                            rightPrice: Number(ethers.utils.formatEther(market.rightPrice)),
                            discount: Math.floor(roi - newRoi),
                            url: buildRangeMarketLink(market.market, isDeprecatedCurrency),
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
