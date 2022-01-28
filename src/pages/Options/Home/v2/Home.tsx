import React, { useMemo } from 'react';

import { Background, NewWrapper } from 'theme/common';

import MarketsTable from '../MarketsTable/v2/MarketsTable';
import MarketHeader from '../MarketHeader/v2/MarketHeader';
import HotMarkets from '../HotMarkets/v2/HotMarkets';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { getTheme } from 'redux/modules/ui';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useUserWatchlistedMarketsQuery from 'queries/watchlist/useUserWatchlistedMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import ROUTES from 'constants/routes';
import { sortOptionsMarkets } from 'utils/options';
import { PHASE } from 'constants/options';

const MAX_HOT_MARKETS = 6;

const Home: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);
    const watchlistedMarketsQuery = useUserWatchlistedMarketsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const theme = useSelector((state: RootState) => getTheme(state));

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);
    const watchlistedMarkets = watchlistedMarketsQuery.data ? watchlistedMarketsQuery.data.data : [];
    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => ({
                      ...m,
                      openOrders: (openOrdersMap as any).get(m.address.toLowerCase())?.ordersCount ?? '0',
                      availableLongs: (openOrdersMap as any).get(m.address.toLowerCase())?.availableLongs ?? '0',
                      availableShorts: (openOrdersMap as any).get(m.address.toLowerCase())?.availableShorts ?? '0',
                      longPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.longPrice ?? '0',
                      shortPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.shortPrice ?? '0',
                  }))
                : marketsQuery.data;
            return sortOptionsMarkets(markets);
        }
        return [];
    }, [marketsQuery]);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
        enabled: isAppReady && optionsMarkets.length > 0,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const hotMarkets = useMemo(
        () =>
            optionsMarkets
                .filter((market) => market.phaseNum === PHASE.trading && !market.customMarket)
                .sort((a, b) => a.timeRemaining - b.timeRemaining)
                .slice(0, MAX_HOT_MARKETS),
        [optionsMarkets]
    );

    return (
        <>
            <Background style={{ minHeight: '100vh' }} className={theme == 0 ? 'light' : 'dark'}>
                <NewWrapper>
                    <MarketHeader
                        route={
                            location.search === '?anchor=overview'
                                ? ROUTES.Options.Overview
                                : location.search === '?userFilter2=custom'
                                ? ROUTES.Options.CustomMarkets
                                : location.search === '?userFilter2=competition'
                                ? ROUTES.Options.CompetitionMarkets
                                : ROUTES.Options.Overview
                        }
                    />
                    <HotMarkets optionsMarkets={hotMarkets} />
                    <MarketsTable
                        optionsMarkets={optionsMarkets}
                        exchangeRates={exchangeRates}
                        watchlistedMarkets={watchlistedMarkets}
                    />
                </NewWrapper>
            </Background>
        </>
    );
};

export default Home;
