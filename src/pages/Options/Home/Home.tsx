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
import { FlexDivColumn, Section } from 'theme/common';
import MarketHeader from './MarketHeader';
import { PHASE } from 'constants/options';
import { history } from 'utils/routes';
import ROUTES from 'constants/routes';
import useExchangeRatesQuery from '../../../queries/rates/useExchangeRatesQuery';
import { getIsAppReady } from '../../../redux/modules/app';
import { fetchOrders, openOrdersMapCache } from '../../../queries/options/fetchMarketOrders';

let fetchOrdersInterval: NodeJS.Timeout;
const MAX_HOT_MARKETS = 9;

export const Home: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
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
        if (history.location.hash === '#explore-markets') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        }
    });

    return (
        <>
            {marketsQuery.isSuccess ? (
                <>
                    <Section>
                        <FlexDivColumn>
                            <MarketHeader route={ROUTES.Options.Home} />
                        </FlexDivColumn>
                    </Section>
                    <Section>
                        {hotMarkets.length && <HotMarkets optionsMarkets={hotMarkets} exchangeRates={exchangeRates} />}
                    </Section>
                    <Section>
                        <MarketCreation />
                    </Section>
                    <Section class="explore-markets">
                        <ExploreMarkets optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
                    </Section>
                </>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default Home;
