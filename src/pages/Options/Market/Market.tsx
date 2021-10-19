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
import { FlexDivCentered, FlexDivColumn, Wrapper } from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
import MarketOverview from './components/MarketOverview';
import styled from 'styled-components';
import longIcon from 'assets/images/long.svg';
import shortIcon from 'assets/images/short.svg';
import TradingView from './TradingView';
import ROUTES from 'constants/routes';
import snxJSConnector from 'utils/snxJSConnector';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import ethBurnedOracleInstance from 'utils/contracts/ethBurnedOracleInstance';
import { ethers } from 'ethers';
import CustomMarketResults from './CustomMarketResults';
import { useLocation } from 'react-router-dom';
import './media.scss';
import { MarketOverviewMobile } from './components/MarketOverview/MarketOverviewMobile';
import MarketMobile from './MarketMobile';
import { bigNumberFormatter } from 'utils/formatters/ethers';

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
    const currentLayout = useSelector((state: RootState) => getCurrentLayout(state));
    const fullLayout = useSelector((state: RootState) => getFullLayout(state));
    const [isMobileView, setIsMobileView] = useState(false);
    const [optionsMarket, setOptionsMarket] = useState<OptionsMarketInfo | null>(null);

    const [layout, setLayout] = useState(currentLayout);

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, {
        enabled: isAppReady,
    });

    useEffect(() => {
        const fetchMarketData = async () => {
            if (marketQuery.isSuccess && marketQuery.data) {
                if (marketQuery.data.customMarket) {
                    try {
                        const sportFeedContract = new ethers.Contract(
                            marketQuery.data.oracleAdress,
                            sportFeedOracleContract.abi,
                            (snxJSConnector as any).provider
                        );
                        const data: any = await Promise.all([
                            sportFeedContract.targetName(),
                            sportFeedContract.eventName(),
                            sportFeedContract.targetOutcome(),
                        ]);
                        setOptionsMarket({
                            ...marketQuery.data,
                            country: data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0],
                            eventName: data[1],
                            outcome: data[2],
                        });
                    } catch (e) {
                        const sportFeedContract = new ethers.Contract(
                            marketQuery.data.oracleAdress,
                            ethBurnedOracleInstance.abi,
                            (snxJSConnector as any).provider
                        );
                        const data: any = await Promise.all([
                            sportFeedContract.targetName(),
                            sportFeedContract.eventName(),
                            sportFeedContract.targetOutcome(),
                        ]);
                        setOptionsMarket({
                            ...marketQuery.data,
                            country: data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0],
                            eventName: data[1],
                            outcome:
                                data[1] === 'Flippening Markets' || data[1] === 'ETH/BTC market cap ratio'
                                    ? bigNumberFormatter(data[2]).toString()
                                    : Number(data[2]).toString(),
                        });
                    }
                } else {
                    setOptionsMarket(marketQuery.data);
                }
            }
        };
        fetchMarketData();
    }, [marketQuery.isSuccess]);

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
        mobileName: string;
        color: 'red' | 'green';
    }> = useMemo(
        () => [
            {
                id: 'long',
                name: t('options.market.trade-options.trade-long-options-tab-title'),
                mobileName: t('options.market.trade-options.trade-long-options-tab-title-mobile'),
                color: 'green',
            },
            {
                id: 'short',
                name: t('options.market.trade-options.trade-short-options-tab-title'),
                mobileName: t('options.market.trade-options.trade-short-options-tab-title-mobile'),
                color: 'red',
            },
        ],
        [t]
    );
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const paramOption = query.get('option');
    const defaultOptionsTab = paramOption === 'short' ? optionsTabContent[1] : optionsTabContent[0];
    const [optionsActiveTab, setOptionsActiveTab] = useState(defaultOptionsTab);

    const reactGridConfig = {
        className: 'layout',
        cols: 12,
        rowHeight: 30,
        isBounded: true,
        draggableHandle: '.grid-component-header',
    };

    const wrapWidget = (
        phase: string,
        isCustomMarket: boolean,
        widgets: ReactElement[],
        widgetKey: MarketWidgetKey,
        widget: ReactElement,
        background?: string
    ) => {
        if (isMarketWidgetVisible(widgetKey, visibilityMap, phase, isCustomMarket, isWalletConnected, false)) {
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
            optionsMarket.customMarket,
            widgets,
            MarketWidgetKey.MATURITY_PHASE,
            <MaturityPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
        );
        wrapWidget(
            optionsMarket.phase,
            optionsMarket.customMarket,
            widgets,
            MarketWidgetKey.ORDERBOOK,
            <Orderbook optionSide={optionsActiveTab.id} />
        );
        wrapWidget(
            optionsMarket.phase,
            optionsMarket.customMarket,
            widgets,
            MarketWidgetKey.TRADE,
            <TradeOptions optionSide={optionsActiveTab.id} />,
            'linear-gradient(90deg, #3936C7 -8.53%, #2D83D2 52.71%, #23A5DD 105.69%, #35DADB 127.72%)'
        );
        wrapWidget(
            optionsMarket.phase,
            optionsMarket.customMarket,
            widgets,
            MarketWidgetKey.CHART_TRADING_VIEW,
            <TradingView />
        );
        wrapWidget(
            optionsMarket.phase,
            optionsMarket.customMarket,
            widgets,
            MarketWidgetKey.CUSTOM_MARKET_RESULTS,
            <CustomMarketResults />
        );
        wrapWidget(
            optionsMarket.phase,
            optionsMarket.customMarket,
            widgets,
            MarketWidgetKey.CHART_OPTIONS_PRICE,
            <OptionsPriceChart />
        );
        wrapWidget(
            optionsMarket.phase,
            optionsMarket.customMarket,
            widgets,
            MarketWidgetKey.RECENT_TRANSACTIONS,
            <RecentTransactions marketAddress={optionsMarket.address} />
        );
        wrapWidget(
            optionsMarket.phase,
            optionsMarket.customMarket,
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
    }, [networkId, isWalletConnected, marketQuery.isSuccess, optionsMarket]);

    const handleResize = () => {
        if (window.innerWidth <= 900) {
            setIsMobileView(true);
        } else {
            setIsMobileView(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            marketQuery.remove();
            accountMarketInfoQuery.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onLayoutChange = (layout: Layout[]) => {
        setLayout(layout);
        dispatch(setMarketWidgetLayout(layout));
    };

    return optionsMarket ? (
        <MarketProvider optionsMarket={optionsMarket}>
            <Background>
                <Wrapper className="market">
                    <MarketHeader
                        showCustomizeLayout
                        phase={optionsMarket.phase}
                        isCustomMarket={optionsMarket.customMarket}
                        route={ROUTES.Options.MarketMatch}
                    />

                    <FlexDivColumn className="market__content">
                        {isMobileView ? (
                            <MarketOverviewMobile optionsMarket={optionsMarket} />
                        ) : (
                            <MarketOverview optionsMarket={optionsMarket} />
                        )}

                        <MainContentContainer className="market__container">
                            {optionsMarket.phase === 'trading' && (
                                <OptionsTabContainer className="market__container__tabs">
                                    {optionsTabContent.map((tab) => (
                                        <OptionsTab
                                            isActive={tab.id === optionsActiveTab.id}
                                            isLong={tab.id === 'long'}
                                            key={tab.id}
                                            onClick={() => setOptionsActiveTab(tab)}
                                            className={`market__container__tab ${
                                                tab.id === optionsActiveTab.id ? 'selected' : 'idle'
                                            } `}
                                        >
                                            {window.innerWidth < 768 ? tab.mobileName : tab.name}
                                            {tab.id === 'long' ? (
                                                <OptionsIcon src={longIcon} />
                                            ) : (
                                                <OptionsIcon src={shortIcon} />
                                            )}
                                        </OptionsTab>
                                    ))}
                                </OptionsTabContainer>
                            )}
                            <ReactGridContainer
                                className="market__gridWrapper"
                                phase={optionsMarket.phase}
                                optionsActiveTab={optionsActiveTab.id}
                            >
                                {isMobileView ? (
                                    <MarketMobile
                                        side={optionsActiveTab.id}
                                        market={optionsMarket}
                                        accountInfo={accountMarketInfo}
                                    />
                                ) : (
                                    <ReactGridLayout
                                        layout={layout}
                                        {...reactGridConfig}
                                        onLayoutChange={onLayoutChange}
                                    >
                                        {renderWidgets(optionsMarket)}
                                    </ReactGridLayout>
                                )}
                            </ReactGridContainer>
                        </MainContentContainer>
                    </FlexDivColumn>
                </Wrapper>
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
    min-height: 100vh;
`;

const MainContentContainer = styled.div`
    border: 1px solid #0a2e66;
    border-radius: 15px 15px 15px 15px;
    overflow: hidden;
`;

const OptionsTabContainer = styled.div`
    height: 75px;
    position: relative;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; isLong: boolean }>`
    position: absolute;
    top: 0;
    left: ${(props) => (props.isLong ? '0' : props.isActive ? '40%' : 'calc(60% - 25px)')};
    background-color: transparent;
    width: ${(props) => (props.isActive ? '60%' : 'calc(40% + 25px)')};
    z-index: ${(props) => (props.isActive ? '2' : '1')};
    transition: 0.5s;
    height: 75px;
    border-radius: 15px 15px 0px 0px;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.15px;
    color: #b8c6e5;
    padding-bottom: 15px;
    &.selected {
        background-color: #0a2e66;
        transition: 0.2s;
        color: #f6f6fe;
    }
    &:hover:not(.selected) {
        cursor: pointer;
        border: 1.5px solid #00f9ff;
        color: #00f9ff;
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
    position: relative;
    top: ${(props) => (props.phase === 'trading' ? '-15px' : '0')};
    z-index: 3;
`;

export default Market;
