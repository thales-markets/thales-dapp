import React, { useMemo } from 'react';

import MarketsTable from './components/MarketsTable';

import HotMarkets from './components/HotMarkets';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useUserWatchlistedMarketsQuery from 'queries/watchlist/useUserWatchlistedMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { sortOptionsMarkets } from 'utils/options';
import { PHASE } from 'constants/options';

// const MAX_HOT_MARKETS = 6;

const Markets: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);
    const watchlistedMarketsQuery = useUserWatchlistedMarketsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);
    const watchlistedMarkets = watchlistedMarketsQuery.data ? watchlistedMarketsQuery.data.data : [];
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
            <MarketsTable
                optionsMarkets={optionsMarkets}
                exchangeRates={exchangeRates}
                watchlistedMarkets={watchlistedMarkets}
            />
        </>
    );
};

export default Markets;
