import { OpenOrdersMap, useFetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { DiscountMap, fetchDiscounts } from 'queries/options/useDiscountMarkets';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { HistoricalOptionsMarketInfo, OptionsMarkets, RangedMarket, RangedMarketUI } from 'types/options';
import { sortCurrencies } from 'utils/currency';
import AssetDropdown from './components/AssetDropdown';
import AssetTable from './components/AssetTable';
import DatesDropdown from './components/MaturityDateDropdown/DatesDropdown';
import AMM from './components/AMM/AMM';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import { useRangedMarketsLiquidity } from 'queries/options/rangedMarkets/useRangedMarketsLiquidity';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSignInRange } from 'utils/formatters/number';
import { MARKET_TYPE } from 'constants/options';
import ToggleButton from './components/ToggleButton/ToggleButton';

type AssetsAndDates = {
    allAssets: string[];
    allDates: number[];
};

const Markets: React.FC = () => {
    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    // states
    const [asset, setAsset] = useState<string>('ETH');
    const [maturityDate, setMaturityDate] = useState<number>();
    const [lastValidOpenOrdersMap, setLastValidOpenOrdersMap] = useState<OpenOrdersMap>(undefined);
    const [lastValidDiscountMap, setLastValidDiscountMap] = useState<DiscountMap>(undefined);
    const [market, setMarket] = useState<HistoricalOptionsMarketInfo>();
    console.log(market);
    const [marketType, setMarketType] = useState(MARKET_TYPE.positional);

    // queries
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, {
        enabled: isAppReady && marketType === MARKET_TYPE.positional,
    });
    const rangeMarketsQuery = useRangedMarketsQuery(networkId, {
        enabled: isAppReady && marketType === MARKET_TYPE.ranged,
    });
    const openOrdersQuery = useFetchAllMarketOrders(networkId, { enabled: isAppReady });
    const discountQuery = fetchDiscounts(networkId, { enabled: isAppReady });

    // hooks
    const optionsMarkets: OptionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess) {
            return marketsQuery.data;
        }
        return [];
    }, [networkId, marketsQuery]);

    const rangeOptionsMarkets: RangedMarket[] = useMemo(() => {
        if (rangeMarketsQuery.isSuccess) {
            return rangeMarketsQuery.data;
        }
        return [];
    }, [networkId, rangeMarketsQuery]);

    const rangeLiquidityQuery = useRangedMarketsLiquidity(networkId);

    const AssetsAndDates: AssetsAndDates = useMemo(() => {
        const allAssets: Set<string> = new Set();
        const allDates: Set<number> = new Set();

        optionsMarkets.map((market) => {
            allAssets.add(market.currencyKey);
            if (market.currencyKey === asset) {
                allDates.add(market.maturityDate);
            }
        });

        return {
            allAssets: Array.from(allAssets).sort(sortCurrencies),
            allDates: Array.from(allDates).sort((a, b) => a - b),
        };
    }, [optionsMarkets, asset]);

    useEffect(() => {
        if (openOrdersQuery.isSuccess && openOrdersQuery.data) {
            setLastValidOpenOrdersMap(openOrdersQuery.data);
        }
    }, [openOrdersQuery.isSuccess, openOrdersQuery.data]);

    const openOrdersMap: OpenOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess && openOrdersQuery.data) {
            return openOrdersQuery.data;
        }
        return lastValidOpenOrdersMap;
    }, [openOrdersQuery.isSuccess, openOrdersQuery.data, lastValidOpenOrdersMap]);

    useEffect(() => {
        if (discountQuery.isSuccess && discountQuery.data) {
            setLastValidDiscountMap(discountQuery.data);
        }
    }, [discountQuery.isSuccess, discountQuery.data]);

    const discountMap: DiscountMap = useMemo(() => {
        if (discountQuery.isSuccess && discountQuery.data) {
            return discountQuery.data;
        }
        return lastValidDiscountMap;
    }, [discountQuery.isSuccess, discountQuery.data, lastValidDiscountMap]);

    const marketsByAssetAndDate: OptionsMarkets = useMemo(() => {
        const TradingMarkets = optionsMarkets.filter((market) => {
            return maturityDate && market.maturityDate === maturityDate && market.currencyKey === asset;
        });

        const markets = openOrdersMap
            ? TradingMarkets.map((m) => {
                  const apiData = openOrdersMap[m.address.toLowerCase()];
                  const discountData = discountMap ? discountMap[m.address.toLowerCase()] : undefined;
                  let discountedSide;
                  let discount = 0;
                  if (discountData) {
                      if (discountData.longPriceImpact < 0) {
                          discountedSide = 'UP';
                          discount = -Math.ceil(Math.abs(discountData.longPriceImpact));
                      }
                      if (discountData.shortPriceImpact < 0) {
                          discountedSide = 'DOWN';
                          discount = -Math.ceil(Math.abs(discountData.shortPriceImpact));
                      }
                  }

                  return {
                      ...m,
                      openOrders: apiData?.ordersCount ?? 0,
                      availableLongs: apiData?.availableLongs ?? 0,
                      availableShorts: apiData?.availableShorts ?? 0,
                      longPrice: apiData?.longPrice ?? 0,
                      shortPrice: apiData?.shortPrice ?? 0,
                      ammLiquidity: (apiData?.availableLongs ?? 0) + (apiData?.availableShorts ?? 0),
                      discountedSide,
                      discount,
                  };
              })
            : TradingMarkets;
        return markets.sort((a, b) => a.strikePrice - b.strikePrice);
    }, [asset, maturityDate, openOrdersMap, discountMap]);

    const rangeMarkets: RangedMarketUI[] = useMemo(() => {
        if (rangeLiquidityQuery.isSuccess) {
            const TradingMarkets = rangeOptionsMarkets.filter((market) => {
                return maturityDate && market.maturityDate === maturityDate && market.currencyKey === asset;
            });
            const markets = rangeLiquidityQuery.data
                ? TradingMarkets.map((m) => {
                      const apiData = rangeLiquidityQuery?.data?.get(m.address.toLowerCase());

                      return {
                          ...m,
                          asset: m.currencyKey,
                          availableIn: apiData?.availableIn ?? 0,
                          availableOut: apiData?.availableOut ?? 0,
                          inPrice: apiData?.inPrice ?? 0,
                          outPrice: apiData?.outPrice ?? 0,
                          ammLiquidity: (apiData?.availableIn ?? 0) + (apiData?.availableOut ?? 0),
                          range: formatCurrencyWithSignInRange(USD_SIGN, m.leftPrice, m.rightPrice, 2),
                      };
                  })
                : rangeMarketsQuery.data;

            return (markets as any).sort((a: any, b: any) =>
                a.leftPrice !== b.leftPrice ? a.leftPrice - b.leftPrice : a.rightPrice - b.rightPrice
            );
        }
        return [];
    }, [rangeOptionsMarkets, rangeLiquidityQuery]);

    console.log('Range Markets: ', rangeMarkets);

    // const highlightMarkets = useMemo(() => {
    //     const result = new Set<string>();
    //     rangeOptionsMarkets
    //         .filter((rangeMarket) => {
    //             return (
    //                 rangeMarket.maturityDate === maturityDate &&
    //                 rangeMarket.currencyKey === asset &&
    //                 (rangeMarket.leftMarket.id.toLowerCase() === market?.address.toLowerCase() ||
    //                     rangeMarket.rightMarket.id.toLowerCase() === market?.address.toLowerCase())
    //             );
    //         })
    //         .map((rangeMarket) => {
    //             if (rangeMarket.leftMarket.id.toLowerCase() === market?.address.toLowerCase()) {
    //                 return result.add(rangeMarket.rightMarket.id);
    //             } else {
    //                 return result.add(rangeMarket.leftMarket.id);
    //             }
    //         });
    //     return result;
    // }, [rangeOptionsMarkets, asset, maturityDate, market]);

    // console.log('highlight number: ', highlightMarkets.size);

    return (
        <Wrapper>
            <div style={{ width: '100%' }}>
                <Container>
                    <AssetDropdown asset={asset} setAsset={setAsset} allAssets={AssetsAndDates.allAssets} />
                    <ToggleButton onToggle={setMarketType} state={marketType} />
                    {AssetsAndDates && (
                        <DatesDropdown
                            date={maturityDate}
                            setDate={setMaturityDate}
                            allDates={AssetsAndDates.allDates}
                        ></DatesDropdown>
                    )}
                </Container>
                <Container>
                    <AssetTable
                        setMarket={setMarket}
                        markets={marketsByAssetAndDate}
                        rangeMarkets={rangeMarkets}
                        type={marketType}
                    />
                </Container>
            </div>
            <AMMWrapper>
                <AMM
                    longAddress={market?.longAddress ?? ''}
                    shortAddress={market?.shortAddress ?? ''}
                    marketAddress={market?.address ?? ''}
                ></AMM>
            </AMMWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 40px;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const AMMWrapper = styled.div`
    max-width: 380px;
    min-width: 380px;
`;

export default Markets;
