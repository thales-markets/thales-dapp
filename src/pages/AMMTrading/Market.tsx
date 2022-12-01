import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';

import { getIsAppReady } from 'redux/modules/app';

import TabContainer from './components/TabContainer';
import AMM from './components/AMM';
import Maturity from './components/Maturity';
import RangedMarketAMM from './components/RangedMarketAMM';
import TabContainerRangedMarket from './components/TabContainer/TabContainerRangedMarket';

import { MarketProvider } from './contexts/MarketContext';

import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import useRangedMarketQuery from 'queries/options/rangedMarkets/useRangedMarketQuery';

import { OptionsMarketInfo, RangedMarketData } from 'types/options';
import Loader from 'components/Loader';
import { getNetworkId } from 'redux/modules/wallet';
import { RangedMarketProvider } from './contexts/RangedMarketContext';
import RangeMaturity from './components/Maturity/RangeMaturity';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { POLYGON_ID } from 'constants/network';
import Footer from 'components/Footer';

type MarketProps = {
    marketAddress: string;
    isRangedMarket?: boolean;
};

const Market: React.FC<MarketProps> = ({ marketAddress, isRangedMarket }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [optionMarket, setOptionMarket] = useState<OptionsMarketInfo | null>(null);
    const [rangedMarket, setRangedMarket] = useState<RangedMarketData | null>(null);
    const [inMaturityPhase, setMaturityPhase] = useState<boolean>(false);
    const [networkSwitched, setNetworkSwitched] = useState(false);

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, {
        enabled: isAppReady && !isRangedMarket,
    });

    const rangedMarketQuery = useRangedMarketQuery(marketAddress, {
        enabled: isAppReady && isRangedMarket,
    });

    useEffect(() => {
        if (networkSwitched) {
            isRangedMarket && networkId !== POLYGON_ID
                ? navigateTo(ROUTES.Options.RangeMarkets)
                : navigateTo(ROUTES.Options.Home);
        }
        setNetworkSwitched(true);
    }, [networkId]);

    useEffect(() => {
        const fetchMarketData = async () => {
            if (isRangedMarket && rangedMarketQuery.isSuccess && rangedMarketQuery?.data) {
                setRangedMarket(rangedMarketQuery?.data);
            }
            if (!isRangedMarket && marketQuery.isSuccess && marketQuery.data) {
                setOptionMarket(marketQuery.data);
            } else if (marketQuery.data === null) {
                // navigateTo(buildHref(ROUTES.Options.Home));
            }
        };

        fetchMarketData();
    }, [marketQuery.isSuccess, rangedMarketQuery.isSuccess, marketAddress]);

    useEffect(() => {
        if (!isRangedMarket && optionMarket?.phase == 'maturity') {
            setMaturityPhase(true);
        } else if (isRangedMarket && rangedMarket?.phase == 'maturity') {
            setMaturityPhase(true);
        } else {
            setMaturityPhase(false);
        }
    }, [optionMarket?.phase, rangedMarket?.phase]);

    return optionMarket || rangedMarket ? (
        <>
            {!isRangedMarket && (
                <MarketProvider optionsMarket={optionMarket}>
                    <MainContainer>
                        {inMaturityPhase ? <Maturity /> : <AMM />}
                        <TabContainer />
                    </MainContainer>
                </MarketProvider>
            )}
            {isRangedMarket && (
                <RangedMarketProvider rangedMarket={rangedMarket}>
                    <MainContainer>
                        {inMaturityPhase ? <RangeMaturity /> : <RangedMarketAMM />}
                        <TabContainerRangedMarket />
                    </MainContainer>
                </RangedMarketProvider>
            )}
            <Footer />
        </>
    ) : (
        <Loader />
    );
};

const MainContainer = styled.div`
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

export default Market;
