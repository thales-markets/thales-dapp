import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';

import { getIsAppReady } from 'redux/modules/app';

import RowCard from './components/RowCard';
import TabContainer from './components/TabContainer';
import AMM from './components/AMM';
import Switch from 'components/SwitchInput/SwitchInputNew';
import OrderbookView from './components/OrderbookView';

import { MarketProvider } from './contexts/MarketContext';

import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { OptionsMarketInfo } from 'types/options';
import { TradingType } from 'types/options';
import { buildHref, navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import Loader from 'components/Loader';
import { setSimilarMarketVisibility } from 'redux/modules/marketWidgets';

type MarketProps = {
    marketAddress: string;
};

const TradingTypes = [
    {
        value: 'Orderbook',
    },
    {
        value: 'AMM',
    },
];

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [optionMarket, setOptionMarket] = useState<OptionsMarketInfo | null>(null);
    const [tradingType, setTradingType] = useState<TradingType>(TradingTypes[1].value as TradingType);
    const dispatch = useDispatch();

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, {
        enabled: isAppReady,
    });

    useEffect(() => {
        dispatch(setSimilarMarketVisibility(false));
    }, [marketAddress]);

    useEffect(() => {
        const fetchMarketData = async () => {
            if (marketQuery.isSuccess && marketQuery.data) {
                setOptionMarket(marketQuery.data);
            } else if (marketQuery.data === null) {
                navigateTo(buildHref(ROUTES.Options.Home));
            }
        };
        fetchMarketData();
    }, [marketQuery.isSuccess]);

    return optionMarket ? (
        <MarketProvider optionsMarket={optionMarket}>
            <HeaderContainer>
                <Switch
                    active={tradingType == 'AMM'}
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
                    handleClick={() => (tradingType == 'AMM' ? setTradingType('Orderbook') : setTradingType('AMM'))}
                />
            </HeaderContainer>
            <RowCard />
            {tradingType == TradingTypes[0].value && <OrderbookView />}
            {tradingType == TradingTypes[1].value && (
                <MainContainer>
                    <AMM />
                    <TabContainer />
                </MainContainer>
            )}
        </MarketProvider>
    ) : (
        <Loader />
    );
};

const MainContainer = styled.div`
    margin-top: 17px;
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
    margin: -30px 0 20px 0;
    &::before {
        visibility: hidden;
    }

    @media (max-width: 1024px) {
        margin: 0px 0 20px 0;
    }
`;

export default Market;
