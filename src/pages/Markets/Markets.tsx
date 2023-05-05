import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { useFetchAllMarketOrders, OpenOrdersMap } from 'queries/options/fetchAllMarketOrders';

import { sortOptionsMarkets } from 'utils/options';
import Loader from 'components/Loader';

import { getIsArbitrum, getIsBSC, getIsOVM, getIsPolygon } from 'utils/network';
import OpRewardsBanner from 'components/OpRewardsBanner';
import Footer from 'components/Footer';
import { DiscountMap, useDiscountMarkets } from 'queries/options/useDiscountMarkets';
import ElectionsBanner from 'components/ElectionsBanner';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';

const HotMarkets = lazy(() => import(/* webpackChunkName: "HotMarkets" */ './components/HotMarkets'));
const MarketsTable = lazy(() => import(/* webpackChunkName: "MarketsTable" */ './components/MarketsTable'));

const Markets: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [lastValidOpenOrdersMap, setLastValidOpenOrdersMap] = useState<OpenOrdersMap>(undefined);
    const [lastValidDiscountMap, setLastValidDiscountMap] = useState<DiscountMap>(undefined);

    const showOPBanner = getIsOVM(networkId);

    const showDiscountMarkets =
        getIsOVM(networkId) || getIsArbitrum(networkId) || getIsPolygon(networkId) || getIsBSC(networkId);

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);

    const openOrdersQuery = useFetchAllMarketOrders(networkId, { enabled: isAppReady });

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

    const discountQuery = useDiscountMarkets(networkId, { enabled: isAppReady });

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

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => {
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
                : marketsQuery.data;
            return sortOptionsMarkets(markets);
        }
        return [];
    }, [marketsQuery.isSuccess, marketsQuery.data, openOrdersMap, discountMap]);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery();

    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    return (
        <>
            {showOPBanner && <OpRewardsBanner width={90} />}
            <ElectionsBanner width={90} />
            <Suspense fallback={<></>}>
                {showDiscountMarkets && <HotMarkets optionsMarkets={optionsMarkets} />}
            </Suspense>
            <Suspense fallback={<></>}>
                <MarketsTable optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
            </Suspense>
            <Footer />

            {networkId === 1 && <Loader hideMainnet={true} />}
        </>
    );
};

// const BannerContainer = styled(FlexDiv)`
//     width: 90% !important;
//     padding-bottom: 50px;
//     strong {
//         font-weight: bold;
//         cursor: pointer;
//         margin-left: 0.2em;
//         color: var(--input-border-color);
//     }
//     a {
//         display: contents;
//         font-weight: bold;
//         cursor: pointer;
//         color: var(--input-border-color);
//     }
// `;

export default Markets;
