import React, { useMemo } from 'react';
import MarketCreation from './components/MarketCreation';
import { useSelector } from 'react-redux';
import { sortOptionsMarkets } from '../../../utils/options';
import { RootState } from 'redux/rootReducer';
import { getAvailableSynthsMap } from 'redux/modules/synths';
import HotMarkets from './components/HotMarkets';
import MarketsTable from './components/MarketsTable';
import useBinaryOptionsMarkets from 'queries/options/useBinaryOptionsMarkets';

const MAX_HOT_MARKETS = 4;

export const Home: React.FC = () => {
    const marketsQuery = useBinaryOptionsMarkets();
    const synthsMap = useSelector((state: RootState) => getAvailableSynthsMap(state));
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
