import AMM from 'pages/AMMTrading/components/AMM';
import { MarketProvider } from 'pages/AMMTrading/contexts/MarketContext';
import { OpenOrdersMap, fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { DiscountMap, fetchDiscounts } from 'queries/options/useDiscountMarkets';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { OptionsMarkets } from 'types/options';
import { sortCurrencies } from 'utils/currency';
import AssetDropdown from './components/AssetDropdown';
import AssetTable from './components/AssetTable';
import DatesDropdown from './components/MaturityDateDropdown/DatesDropdown';

type AssetsAndDates = {
    allAssets: string[];
    allDates: number[];
};

const Markets: React.FC = () => {
    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    // states
    const [asset, setAsset] = useState<string>('ETH');
    const [maturityDate, setMaturityDate] = useState<number>();
    const [lastValidOpenOrdersMap, setLastValidOpenOrdersMap] = useState<OpenOrdersMap>(undefined);
    const [lastValidDiscountMap, setLastValidDiscountMap] = useState<DiscountMap>(undefined);
    const [market, setMarket] = useState<string>('');

    // queries
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: true });
    const openOrdersQuery = fetchAllMarketOrders(networkId, { enabled: true });
    const discountQuery = fetchDiscounts(networkId, { enabled: true });
    const marketQuery = useBinaryOptionsMarketQuery(market, {
        enabled: market !== '',
    });

    // hooks
    const optionsMarkets: OptionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess) {
            return marketsQuery.data;
        }
        return [];
    }, [networkId, marketsQuery]);

    const AssetsAndDates: AssetsAndDates = useMemo(() => {
        const allAssets: Set<string> = new Set();
        const allDates: Set<number> = new Set();

        optionsMarkets.forEach((market) => {
            if (market.maturityDate > new Date().getTime()) {
                if (!market.customMarket) allAssets.add(market.currencyKey);
                if (market.currencyKey === asset) {
                    allDates.add(market.maturityDate);
                }
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
    }, [asset, maturityDate]);

    const marketContext = useMemo(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            return marketQuery.data;
        }
        return null;
    }, [marketQuery.isSuccess, market]);

    return (
        <Wrapper>
            <div style={{ width: '100%' }}>
                <Container>
                    <AssetDropdown asset={asset} setAsset={setAsset} allAssets={AssetsAndDates.allAssets} />
                    {AssetsAndDates && (
                        <DatesDropdown
                            date={maturityDate}
                            setDate={setMaturityDate}
                            allDates={AssetsAndDates.allDates}
                        ></DatesDropdown>
                    )}
                </Container>
                <Container>
                    <AssetTable setMarket={setMarket} markets={marketsByAssetAndDate} />
                </Container>
            </div>
            <AMMWrapper>
                {marketContext !== null && (
                    <MarketProvider optionsMarket={marketContext}>
                        <AMM />
                    </MarketProvider>
                )}
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
