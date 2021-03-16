import React, { useMemo } from 'react';
import { sortOptionsMarkets } from '../../../utils/options';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import snxJSConnector from 'utils/snxJSConnector';
import HotMarkets from './HotMarkets';
import MarketCreation from './MarketCreation/MarketCreation';
import ExploreMarkets from './ExploreMarkets';
import { Loader } from 'semantic-ui-react';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';

const MAX_HOT_MARKETS = 4;

export const Home: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
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
