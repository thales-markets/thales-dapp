import React, { useMemo } from 'react';
import MarketCreation from './components/MarketCreation';
import { sortOptionsMarkets } from '../../../utils/options';
import HotMarkets from './components/HotMarkets';
import MarketsTable from './components/MarketsTable';
import useBinaryOptionsMarkets from 'queries/options/useBinaryOptionsMarkets';
import snxJSConnector from 'utils/snxJSConnector';

const MAX_HOT_MARKETS = 4;

export const Home: React.FC = () => {
    const marketsQuery = useBinaryOptionsMarkets();
    const { synthsMap } = snxJSConnector;
    const optionsMarkets = useMemo(
        () =>
            marketsQuery.isSuccess && Array.isArray(marketsQuery.data)
                ? sortOptionsMarkets(marketsQuery.data, synthsMap)
                : [],
        [marketsQuery, synthsMap]
    );

    const hotMarkets = useMemo(() => optionsMarkets.slice(0, MAX_HOT_MARKETS), [optionsMarkets]);
    return (
        <>
            <h1>Options</h1>
            <HotMarkets optionsMarkets={hotMarkets} />
            <MarketCreation />
            <MarketsTable optionsMarkets={optionsMarkets} />
        </>
    );
};

export default Home;
