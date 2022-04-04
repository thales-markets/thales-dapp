import React, { useMemo } from 'react';

import MarketsTable from './components/MarketsTable';

import HotMarkets from './components/HotMarkets';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { sortOptionsMarkets } from 'utils/options';
import { PHASE } from 'constants/options';
import Loader from 'components/Loader';

// const MAX_HOT_MARKETS = 6;

const Markets: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);
    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => {
                      const apiData = (openOrdersMap as any).get(m.address.toLowerCase());
                      return {
                          ...m,
                          openOrders: apiData?.ordersCount ?? 0,
                          availableLongs: apiData?.availableLongs ?? 0,
                          availableShorts: apiData?.availableShorts ?? 0,
                          longPrice: apiData?.longPrice ?? 0,
                          shortPrice: apiData?.shortPrice ?? 0,
                          ammLiquidity: Number(apiData?.availableLongs ?? 0) + Number(apiData?.availableShorts ?? 0),
                      };
                  })
                : marketsQuery.data;
            return sortOptionsMarkets(markets);
        }
        return [];
    }, [marketsQuery]);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
        enabled: isAppReady && optionsMarkets.length > 0,
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const hotMarkets = useMemo(
        () =>
            optionsMarkets
                .filter((market) => market.phaseNum === PHASE.trading && !market.customMarket)
                .sort((a, b) => a.timeRemaining - b.timeRemaining),
        [optionsMarkets]
    );

    return (
        <>
            <HotMarkets optionsMarkets={hotMarkets} />
            <MarketsTable optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
            {networkId === 1 && <Loader hideMainnet={true} />}
        </>
    );
};

export default Markets;
