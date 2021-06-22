import React, { useEffect, useMemo } from 'react';
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

const MAX_HOT_MARKETS = 9;

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

    const hotMarkets = useMemo(
        () =>
            optionsMarkets
                .filter((market) => market.phaseNum === PHASE.trading)
                .sort((a, b) => a.timeRemaining - b.timeRemaining)
                .slice(0, MAX_HOT_MARKETS),
        [optionsMarkets]
    );

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
                            <MarketCreation />
                        </FlexDivColumn>
                    </Section>
                    <Section>{hotMarkets.length && <HotMarkets optionsMarkets={hotMarkets} />}</Section>
                    <Section class="explore-markets">
                        <ExploreMarkets optionsMarkets={optionsMarkets} />
                    </Section>
                </>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default Home;
