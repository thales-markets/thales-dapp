import React, { useEffect, useMemo, useState } from 'react';
import { sortOptionsMarkets } from '../../../utils/options';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import snxJSConnector from 'utils/snxJSConnector';
import HotMarkets from './HotMarkets';
import MarketCreation from './MarketCreation/MarketCreation';
import ExploreMarkets from './ExploreMarkets';
import Loader from 'components/Loader';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { Background, FlexDivColumn } from 'theme/common';
import MarketHeader from './MarketHeader';
import { PHASE } from 'constants/options';
import ROUTES from 'constants/routes';
import useExchangeRatesQuery from '../../../queries/rates/useExchangeRatesQuery';
import { getIsAppReady } from '../../../redux/modules/app';
import { fetchOrders, openOrdersMapCache } from '../../../queries/options/fetchMarketOrders';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

let fetchOrdersInterval: NodeJS.Timeout;
const MAX_HOT_MARKETS = 9;

export const Home: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const location = useLocation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const { synthsMap } = snxJSConnector;
    const [openOrdersMap, setOpenOrdersMap] = useState(openOrdersMapCache);
    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => ({ ...m, openOrders: openOrdersMap[m.address] }))
                : marketsQuery.data;
            return sortOptionsMarkets(markets, synthsMap);
        }
        return [];
    }, [marketsQuery, synthsMap, openOrdersMap]);

    const hotMarkets = useMemo(
        () =>
            optionsMarkets
                .filter((market) => market.phaseNum === PHASE.trading && !market.customMarket)
                .sort((a, b) => a.timeRemaining - b.timeRemaining)
                .slice(0, MAX_HOT_MARKETS),
        [optionsMarkets]
    );

    useEffect(() => {
        if (!openOrdersMap && !fetchOrdersInterval && networkId && optionsMarkets.length) {
            fetchOrders(networkId, optionsMarkets, setOpenOrdersMap);
            fetchOrdersInterval = setInterval(() => {
                fetchOrders(networkId, optionsMarkets, setOpenOrdersMap);
            }, 10000);
        }
    }, [networkId, optionsMarkets]);

    useEffect(() => {
        if (location.search === '?anchor=overview') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else if (location.search === '?userFilter2=Olympics') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else if (location.search === '?anchor=hot-markets') {
            document.getElementById('hot-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else {
        }
    }, [location]);

    return (
        <>
            {marketsQuery.isSuccess ? (
                <Background style={{ minHeight: '100vh' }}>
                    <Wrapper style={{ flexDirection: 'column' }}>
                        <MarketHeader
                            route={
                                location.search === '?anchor=overview'
                                    ? ROUTES.Options.Overview
                                    : location.search === '?anchor=hot-markets'
                                    ? ROUTES.Options.Home
                                    : location.search === '?userFilter2=Olympics'
                                    ? ROUTES.Options.Olympics
                                    : ROUTES.Options.Overview
                            }
                        />

                        {hotMarkets.length && <HotMarkets optionsMarkets={hotMarkets} exchangeRates={exchangeRates} />}

                        <MarketCreation />

                        <ExploreMarkets optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
                    </Wrapper>
                </Background>
            ) : (
                <Loader />
            )}
        </>
    );
};

const Wrapper = styled(FlexDivColumn)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1440px;
    flex-direction: column;
    margin: auto;
    padding-left: 120px;
    padding-right: 30px;
    @media (max-width: 1024px) {
        padding-left: 30px;
    }
    @media (max-width: 400px) {
        padding: 0 10px;
    }
`;

export default Home;
