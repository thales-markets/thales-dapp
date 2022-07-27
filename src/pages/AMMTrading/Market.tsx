import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';

import { getIsAppReady } from 'redux/modules/app';

import TabContainer from './components/TabContainer';
import AMM from './components/AMM';
import Switch from 'components/SwitchInput/SwitchInputNew';
import OrderbookView from './components/OrderbookView';
import Maturity from './components/Maturity';
import RangedMarketAMM from './components/RangedMarketAMM';
import TabContainerRangedMarket from './components/TabContainer/TabContainerRangedMarket';

import { MarketProvider } from './contexts/MarketContext';

import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import useRangedMarketQuery from 'queries/options/rangedMarkets/useRangedMarketQuery';

import { OptionsMarketInfo, RangedMarketData } from 'types/options';
import { TradingType } from 'types/options';
import Loader from 'components/Loader';
import { getIsPolygon } from 'utils/network';
import { getNetworkId } from 'redux/modules/wallet';
import { RangedMarketProvider } from './contexts/RangedMarketContext';
import RangeMaturity from './components/Maturity/RangeMaturity';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { POLYGON_ID } from 'constants/network';

type MarketProps = {
    marketAddress: string;
    isRangedMarket?: boolean;
};

const TradingTypes = [
    {
        value: 'Orderbook',
    },
    {
        value: 'AMM',
    },
];

const Market: React.FC<MarketProps> = ({ marketAddress, isRangedMarket }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [optionMarket, setOptionMarket] = useState<OptionsMarketInfo | null>(null);
    const [rangedMarket, setRangedMarket] = useState<RangedMarketData | null>(null);
    const [tradingType, setTradingType] = useState<TradingType>(TradingTypes[1].value as TradingType);
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
                    {!inMaturityPhase && (
                        <HeaderContainer>
                            <Switch
                                active={tradingType == 'AMM'}
                                disabled={getIsPolygon(networkId)}
                                width={'94px'}
                                height={'32px'}
                                dotSize={'22px'}
                                label={{
                                    firstLabel: TradingTypes[0].value,
                                    secondLabel: TradingTypes[1].value,
                                    fontSize: '25px',
                                }}
                                shadow={true}
                                dotBackground={'var(--amm-switch-circle)'}
                                handleClick={() =>
                                    tradingType == 'AMM' ? setTradingType('Orderbook') : setTradingType('AMM')
                                }
                            />
                        </HeaderContainer>
                    )}
                    {tradingType == TradingTypes[0].value && <OrderbookView />}
                    {tradingType == TradingTypes[1].value && (
                        <MainContainer>
                            {inMaturityPhase ? <Maturity /> : <AMM />}
                            <TabContainer />
                        </MainContainer>
                    )}
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

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: -77px 0 20px 0;
    &::before {
        visibility: hidden;
    }

    @media (max-width: 1024px) {
        margin: 0px 0 20px 0;
    }
`;

export default Market;
