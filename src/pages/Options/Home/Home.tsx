import React, { useMemo } from 'react';
import { sortOptionsMarkets } from '../../../utils/options';
import useBinaryOptionsMarkets from 'queries/options/useBinaryOptionsMarkets';
import snxJSConnector from 'utils/snxJSConnector';
import HotMarkets from './HotMarkets';
import MarketCreation from './MarketCreation/MarketCreation';
import ExploreMarkets from './ExploreMarkets';
import { Loader } from 'semantic-ui-react';

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
            {optionsMarkets.length ? (
                <>
                    <HotMarkets optionsMarkets={hotMarkets} />
                    <MarketCreation />
                    <ExploreMarkets optionsMarkets={optionsMarkets} />
                </>
            ) : (
                <Loader active />
            )}
        </>
    );
};

export default Home;
