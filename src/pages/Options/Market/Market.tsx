import React, { useState, useCallback, useMemo, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { USD_SIGN } from 'constants/currency';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { MarketProvider } from './contexts/MarketContext';
import { Button, Icon, Label, Loader } from 'semantic-ui-react';
import { AccountMarketInfo, OptionsMarketInfo } from 'types/options';
import { Link } from 'react-router-dom';
import MarketInfoModal from './MarketInfoModal';
import OptionsPriceChart from './OptionsPriceChart';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { getIsAppReady, set0xReady } from 'redux/modules/app';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import MaturityPhaseCard from './TradeCard/MaturityPhaseCard';
import OptionSideIcon from './components/OptionSideIcon';
import { Tooltip } from '@material-ui/core';
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
import {
    getVisibilityMap,
    setMarketWidgetLayout,
    getCurrentLayout,
    setMarketWidgetVisibility,
    getFullLayout,
} from 'redux/modules/marketWidgets';
import { isMarketWidgetVisible } from 'utils/options';
import CustomizeLayout from './components/CustomizeLayout';
import { FlexDivCentered, FlexDivColumn, FlexDiv } from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
import MarketOverview from './components/MarketOverview';
import styled from 'styled-components';
import longIcon from 'assets/images/long.svg';
import shortIcon from 'assets/images/short.svg';
import TradingView from './TradingView';

const ReactGridLayout = WidthProvider(RGL);

type MarketProps = {
    marketAddress: string;
};

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const [marketInfoModalVisible, setMarketInfoModalVisible] = useState<boolean>(false);
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

    const handleViewMarketDetails = useCallback(() => {
        setMarketInfoModalVisible(true);
    }, []);

    const optionsMarket: OptionsMarketInfo | null = marketQuery.isSuccess && marketQuery.data ? marketQuery.data : null;

    const marketHeading = optionsMarket
        ? `${optionsMarket.asset} > ${formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)} @ ${formatShortDate(
              optionsMarket.maturityDate
          )}`
        : null;

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

    const exerciseAvailable = !!accountMarketInfo.long || !!accountMarketInfo.short;
    const userActionAvailable = optionsMarket && optionsMarket.phase === 'maturity' && exerciseAvailable;

    const optionsAmountLabel = () => (
        <>
            <Label
                onClick={() => {
                    const widgetKey = MarketWidgetKey.MATURITY_PHASE;
                    dispatch(
                        setMarketWidgetVisibility({
                            marketWidget: widgetKey,
                            isVisible: !visibilityMap[widgetKey],
                        })
                    );
                }}
                className="button-label"
            >
                <div>
                    <OptionSideIcon side="long" />{' '}
                    {t(`options.common.amount-long`, {
                        amount: formatCurrency(accountMarketInfo.long),
                    })}
                </div>
                <br />
                <div>
                    <OptionSideIcon side="short" />{' '}
                    {t(`options.common.amount-short`, {
                        amount: formatCurrency(accountMarketInfo.short),
                    })}
                </div>
            </Label>
            {userActionAvailable && (
                <Label
                    circular
                    color="red"
                    empty
                    floating
                    style={{ position: 'relative', top: '-35px', left: '-10px' }}
                />
            )}
        </>
    );

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
            'linear-gradient(90deg, #3936c7 -8.53%, #2d83d2 52.71%, #23a5dd 105.69%, #35dadb 127.72%)'
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
            dispatch(set0xReady(false));
            // TODO: For some reason, creating a new instance of contract wrappers is time-consuming and blocks rendering. Find a way to optimize this.
            contractWrappers0xConnector.setExchangeProxy(isWalletConnected, networkId);
            dispatch(set0xReady(true));
        }
    }, [networkId, isWalletConnected, marketQuery.isSuccess]);

    useEffect(() => {
        dispatch(
            setMarketWidgetVisibility({
                marketWidget: MarketWidgetKey.YOUR_TRANSACTIONS,
                isVisible: isWalletConnected && visibilityMap[MarketWidgetKey.YOUR_TRANSACTIONS],
            })
        );
    }, [isWalletConnected]);

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
                        <MarketHeader />
                    </FlexDivColumn>
                </Container>
                <Container>
                    <MainContent>
                        <MarketOverview optionsMarket={optionsMarket} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <span style={{ textTransform: 'uppercase' }}>
                                    <Link to={ROUTES.Options.Home} className="item">
                                        <Icon name="long arrow alternate left"></Icon>
                                        {t('options.market.heading.all-markets')}
                                    </Link>
                                    <Button
                                        size="mini"
                                        onClick={handleViewMarketDetails}
                                        style={{ marginLeft: 10, marginRight: 10 }}
                                    >
                                        {t('options.market.heading.market-details')}
                                        {'  '}
                                        <Icon name="info circle"></Icon>
                                    </Button>
                                </span>
                            </div>
                            <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', flexDirection: 'row' }}>
                                <CustomizeLayout phase={optionsMarket.phase} />
                                {(optionsMarket.phase === 'trading' || optionsMarket.phase === 'maturity') && (
                                    <div>
                                        {userActionAvailable ? (
                                            <Tooltip
                                                title={
                                                    <span style={{ fontSize: 12 }}>
                                                        {t(
                                                            optionsMarket.phase === 'trading'
                                                                ? 'options.market.heading.options-to-claim-tooltip'
                                                                : 'options.market.heading.options-to-exercise-tooltip'
                                                        )}
                                                    </span>
                                                }
                                                placement="top"
                                                arrow={true}
                                            >
                                                {optionsAmountLabel()}
                                            </Tooltip>
                                        ) : (
                                            optionsAmountLabel()
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

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
            {marketInfoModalVisible && (
                <MarketInfoModal
                    marketHeading={marketHeading}
                    optionMarket={optionsMarket}
                    onClose={() => setMarketInfoModalVisible(false)}
                />
            )}
        </MarketProvider>
    ) : (
        <Loader active />
    );
};

export const Background = styled.section`
    position: relative;
    background: transparent;
    z-index: 2;
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
    border: 1px solid #141c7f;
    border-radius: 15px 15px 15px 15px;
    overflow: hidden;
`;

const OptionsTabContainer = styled(FlexDiv)``;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean }>`
    background-color: transparent;
    width: ${(props) => (props.isActive ? '60%' : '40%')};
    transition: 0.5s;
    height: 74px;
    border-radius: 15px 15px 0px 0px;
    font-style: normal;
    font-weight: 600;
    font-size: 25px;
    line-height: 48px;
    text-align: center;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    &.selected {
        background-color: #141c7f;
        transition: 0.2s;
    }
    &:hover {
        cursor: pointer;
        transition: 0.2s;
    }
    img {
        margin-left: 10px;
        margin-bottom: 10px;
    }
`;

const OptionsIcon = styled.img``;

const ReactGridContainer = styled.div<{ phase: string; optionsActiveTab: string }>`
    background-color: #141c7f;
    border-radius: ${(props) =>
        props.phase === 'trading'
            ? props.optionsActiveTab === 'long'
                ? '0px 15px 15px 15px'
                : '15px 0px 15px 15px'
            : '15px 15px 15px 15px'};
`;

export default Market;
