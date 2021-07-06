import React, { useState, useMemo, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { MarketProvider } from './contexts/MarketContext';
import Loader from 'components/Loader';
import { AccountMarketInfo, OptionsMarketInfo } from 'types/options';
import OptionsPriceChart from './OptionsPriceChart';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { getIsAppReady, set0xReady } from 'redux/modules/app';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import MaturityPhaseCard from './TradeCard/MaturityPhaseCard';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './temp.css';
import YourTransactions from './TransactionsCard/YourTransactions';
import RecentTransactions from './TransactionsCard/RecentTransactions';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import TradeOptions from './TradeOptions';
import Orderbook from './TradeOptions/Orderbook';
import MarketWidget from './components/MarketWidget';
import { MarketWidgetKey } from 'constants/ui';
import { getVisibilityMap, setMarketWidgetLayout, getCurrentLayout, getFullLayout } from 'redux/modules/marketWidgets';
import { isMarketWidgetVisible } from 'utils/options';
import { FlexDivCentered, FlexDivColumn, FlexDiv } from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
import MarketOverview from './components/MarketOverview';
import styled from 'styled-components';
import longIcon from 'assets/images/long.svg';
import shortIcon from 'assets/images/short.svg';
import TradingView from './TradingView';
import ROUTES from 'constants/routes';

const ReactGridLayout = WidthProvider(RGL);

type MarketProps = {
    marketAddress: string;
};

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const dispatch = useDispatch();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const visibilityMap = useSelector((state: RootState) => getVisibilityMap(state));
    const curentLayout = useSelector((state: RootState) => getCurrentLayout(state));
    const fullLayout = useSelector((state: RootState) => getFullLayout(state));

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, {
        enabled: isAppReady,
    });

    const optionsMarket: OptionsMarketInfo | null = marketQuery.isSuccess && marketQuery.data ? marketQuery.data : null;

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(marketAddress, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    let accountMarketInfo = {
        long: 0,
        short: 0,
    };

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        accountMarketInfo = accountMarketInfoQuery.data as AccountMarketInfo;
    }

    const optionsTabContent: Array<{
        id: 'long' | 'short';
        name: string;
        color: 'red' | 'green';
    }> = useMemo(
        () => [
            {
                id: 'long',
                name: t('options.market.trade-options.trade-long-options-tab-title'),
                color: 'green',
            },
            {
                id: 'short',
                name: t('options.market.trade-options.trade-short-options-tab-title'),
                color: 'red',
            },
        ],
        [t]
    );
    const [optionsActiveTab, setOptionsActiveTab] = useState(optionsTabContent[0]);

    const reactGridConfig = {
        className: 'layout',
        cols: 12,
        rowHeight: 30,
        isBounded: true,
        draggableHandle: '.grid-component-header',
    };

    const wrapWidget = (
        phase: string,
        widgets: ReactElement[],
        widgetKey: MarketWidgetKey,
        widget: ReactElement,
        background?: string
    ) => {
        if (isMarketWidgetVisible(widgetKey, visibilityMap, phase, isWalletConnected, false)) {
            widgets.push(
                <div key={widgetKey} data-grid={fullLayout.find((item: Layout) => item.i === widgetKey)}>
                    <MarketWidget background={background}>{widget}</MarketWidget>
                </div>
            );
        }
    };

    const renderWidgets = (optionsMarket: OptionsMarketInfo) => {
        const widgets: ReactElement[] = [];
        wrapWidget(
            optionsMarket.phase,
            widgets,
            MarketWidgetKey.MATURITY_PHASE,
            <MaturityPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
        );
        wrapWidget(
            optionsMarket.phase,
            widgets,
            MarketWidgetKey.ORDERBOOK,
            <Orderbook optionSide={optionsActiveTab.id} />
        );
        wrapWidget(
            optionsMarket.phase,
            widgets,
            MarketWidgetKey.TRADE,
            <TradeOptions optionSide={optionsActiveTab.id} />,
            'linear-gradient(90deg, #3936C7 -8.53%, #2D83D2 52.71%, #23A5DD 105.69%, #35DADB 127.72%)'
        );
        wrapWidget(optionsMarket.phase, widgets, MarketWidgetKey.CHART_TRADING_VIEW, <TradingView />);
        wrapWidget(optionsMarket.phase, widgets, MarketWidgetKey.CHART_OPTIONS_PRICE, <OptionsPriceChart />);
        wrapWidget(
            optionsMarket.phase,
            widgets,
            MarketWidgetKey.RECENT_TRANSACTIONS,
            <RecentTransactions marketAddress={optionsMarket.address} />
        );
        wrapWidget(
            optionsMarket.phase,
            widgets,
            MarketWidgetKey.YOUR_TRANSACTIONS,
            <YourTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress} />
        );
        return widgets;
    };

    useEffect(() => {
        if (optionsMarket && optionsMarket.phase === 'trading') {
            // For some reason, creating a new instance of contract wrappers is time-consuming and blocks rendering.
            // Timeout added to delay initialization and not block page rendering.
            setTimeout(() => {
                dispatch(set0xReady(false));
                contractWrappers0xConnector.setExchangeProxy(isWalletConnected, networkId);
                dispatch(set0xReady(true));
            }, 500);
        }
    }, [networkId, isWalletConnected, marketQuery.isSuccess]);

    useEffect(() => {
        return () => {
            marketQuery.remove();
            accountMarketInfoQuery.remove();
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onLayoutChange = (layout: Layout[]) => {
        dispatch(setMarketWidgetLayout(layout));
    };

    return optionsMarket ? (
        <MarketProvider optionsMarket={optionsMarket}>
            <Background>
                <Container>
                    <FlexDivColumn>
                        <MarketHeader
                            showCustomizeLayout
                            phase={optionsMarket.phase}
                            route={ROUTES.Options.MarketMatch}
                        />
                    </FlexDivColumn>
                </Container>
                <Container>
                    <MainContent>
                        <MarketOverview optionsMarket={optionsMarket} />{' '}
                        <MainContentContainer>
                            {optionsMarket.phase === 'trading' && (
                                <OptionsTabContainer>
                                    {optionsTabContent.map((tab) => (
                                        <OptionsTab
                                            isActive={tab.id === optionsActiveTab.id}
                                            key={tab.id}
                                            onClick={() => setOptionsActiveTab(tab)}
                                            className={tab.id === optionsActiveTab.id ? 'selected' : ''}
                                            // name={tab.id}
                                            // color={tab.color}
                                        >
                                            {tab.name}{' '}
                                            {tab.id === 'long' ? (
                                                <OptionsIcon src={longIcon} />
                                            ) : (
                                                <OptionsIcon src={shortIcon} />
                                            )}
                                        </OptionsTab>
                                    ))}
                                </OptionsTabContainer>
                            )}
                            <ReactGridContainer phase={optionsMarket.phase} optionsActiveTab={optionsActiveTab.id}>
                                <ReactGridLayout
                                    layout={curentLayout}
                                    {...reactGridConfig}
                                    onLayoutChange={onLayoutChange}
                                >
                                    {renderWidgets(optionsMarket)}
                                </ReactGridLayout>
                            </ReactGridContainer>
                        </MainContentContainer>
                    </MainContent>
                </Container>
            </Background>
        </MarketProvider>
    ) : (
        <Loader />
    );
};

export const Background = styled.section`
    position: relative;
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    z-index: 2;
    height: 100vh;
    overflow: auto;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
    }
`;

const MainContent = styled(FlexDivColumn)`
    padding: 20px 108px;
`;

const MainContentContainer = styled.div`
    border: 1px solid #0a2e66;
    border-radius: 15px 15px 15px 15px;
    overflow: hidden;
`;

const OptionsTabContainer = styled(FlexDiv)``;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean }>`
    background-color: transparent;
    width: ${(props) => (props.isActive ? '60%' : '40%')};
    transition: 0.5s;
    height: 60px;
    border-radius: 15px 15px 0px 0px;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.15px;
    color: #b8c6e5;
    &.selected {
        background-color: #0a2e66;
        transition: 0.2s;
        color: #f6f6fe;
    }
    &:hover {
        cursor: pointer;
        transition: 0.2s;
    }
    img {
        margin-left: 10px;
        margin-bottom: 5px;
    }
`;

const OptionsIcon = styled.img``;

const ReactGridContainer = styled.div<{ phase: string; optionsActiveTab: string }>`
    background-color: #0a2e66;
    border-radius: ${(props) =>
        props.phase === 'trading'
            ? props.optionsActiveTab === 'long'
                ? '0px 15px 15px 15px'
                : '15px 0px 15px 15px'
            : '15px 15px 15px 15px'};
`;

export default Market;
