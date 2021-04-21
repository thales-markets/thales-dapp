import React, { useState, useCallback, useMemo, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { USD_SIGN } from 'constants/currency';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { MarketProvider } from './contexts/MarketContext';
import { useBOMContractContext } from './contexts/BOMContractContext';
import { Button, Icon, Label, Loader, Menu } from 'semantic-ui-react';
import { AccountMarketInfo, OptionsMarketInfo } from 'types/options';
import { Link } from 'react-router-dom';
import MarketInfoModal from './MarketInfoModal';
import ChartCard from './ChartCard';
import MarketSentiment from '../components/MarketSentiment';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { getIsAppReady, set0xReady } from 'redux/modules/app';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import './temp.css';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import BiddingPhaseCard from './TradeCard/BiddingPhaseCard';
import TradingPhaseCard from './TradeCard/TradingPhaseCard';
import MaturityPhaseCard from './TradeCard/MaturityPhaseCard';
import OptionSideIcon from './components/OptionSideIcon';
import { Tooltip } from '@material-ui/core';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import YourTransactions from './TransactionsCard/YourTransactions';
import RecentTransactions from './TransactionsCard/RecentTransactions';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import TradeOptionsSide from './TradeOptions/TradeOptionsSide';
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

const ReactGridLayout = WidthProvider(RGL);

type MarketProps = {
    marketAddress: string;
};

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const [marketInfoModalVisible, setMarketInfoModalVisible] = useState<boolean>(false);
    const BOMContract = useBOMContractContext();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const dispatch = useDispatch();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const visibilityMap = useSelector((state: RootState) => getVisibilityMap(state));
    const curentLayout = useSelector((state: RootState) => getCurrentLayout(state));
    const fullLayout = useSelector((state: RootState) => getFullLayout(state));

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, BOMContract, {
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

    const accountMarketInfo = {
        balances: {
            long: 0,
            short: 0,
        },
        claimable: {
            long: 0,
            short: 0,
        },
        bids: {
            long: 0,
            short: 0,
        },
    };

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        const { balances, claimable, bids } = accountMarketInfoQuery.data as AccountMarketInfo;

        accountMarketInfo.balances = balances;
        accountMarketInfo.claimable = claimable;
        accountMarketInfo.bids = bids;
    }

    const longAmount = accountMarketInfo.balances.long + accountMarketInfo.claimable.long;
    const shortAmount = accountMarketInfo.balances.short + accountMarketInfo.claimable.short;
    const exerciseAvailable = !!longAmount || !!shortAmount;
    const claimAvailable = !!accountMarketInfo.bids.short || !!accountMarketInfo.bids.long;
    const userActionAvailable =
        optionsMarket &&
        ((optionsMarket.phase === 'trading' && claimAvailable) ||
            (optionsMarket.phase === 'maturity' && exerciseAvailable));

    const optionsAmountLabel = (phase: string) => (
        <>
            <Label
                onClick={() => {
                    const widgetKey =
                        phase === 'trading' ? MarketWidgetKey.TRADING_PHASE : MarketWidgetKey.MATURITY_PHASE;
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
                        amount: formatCurrency(longAmount),
                    })}
                </div>
                <br />
                <div>
                    <OptionSideIcon side="short" />{' '}
                    {t(`options.common.amount-short`, {
                        amount: formatCurrency(shortAmount),
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

    const wrapWidget = (phase: string, widgets: ReactElement[], widgetKey: MarketWidgetKey, widget: ReactElement) => {
        if (isMarketWidgetVisible(widgetKey, visibilityMap, phase, isWalletConnected, false)) {
            widgets.push(
                <div key={widgetKey} data-grid={fullLayout.find((item: Layout) => item.i === widgetKey)}>
                    <MarketWidget widgetKey={widgetKey}>{widget}</MarketWidget>
                </div>
            );
        }
    };

    const renderWidgets = (optionsMarket: OptionsMarketInfo) => {
        const widgets: ReactElement[] = [];
        wrapWidget(
            optionsMarket.phase,
            widgets,
            MarketWidgetKey.BIDDING_PHASE,
            <BiddingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
        );
        wrapWidget(
            optionsMarket.phase,
            widgets,
            MarketWidgetKey.TRADING_PHASE,
            <TradingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
        );
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
            <TradeOptionsSide optionSide={optionsActiveTab.id} />
        );
        wrapWidget(optionsMarket.phase, widgets, MarketWidgetKey.CHART, <ChartCard />);
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
            contractWrappers0xConnector.setContractWrappers0x(isWalletConnected, networkId);
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
        window.scrollTo(0, 0);
    }, []);

    const onLayoutChange = (layout: Layout[]) => {
        dispatch(setMarketWidgetLayout(layout));
    };

    return optionsMarket ? (
        <MarketProvider optionsMarket={optionsMarket}>
            <div style={{ padding: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ textTransform: 'uppercase' }}>
                            <Link to={ROUTES.Options.Home} className="item">
                                <Icon name="long arrow alternate left"></Icon>
                                {t('options.market.heading.all-markets')}
                            </Link>{' '}
                            | {marketHeading}
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
                        <span style={{ textTransform: 'uppercase' }}>
                            {t('options.market.heading.market-sentiment')}
                            <MarketSentiment
                                long={optionsMarket.longPrice}
                                short={optionsMarket.shortPrice}
                                display="col"
                            />
                        </span>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'row' }}>
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
                                        {optionsAmountLabel(optionsMarket.phase)}
                                    </Tooltip>
                                ) : (
                                    optionsAmountLabel(optionsMarket.phase)
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {optionsMarket.phase === 'trading' && (
                    <Menu tabular>
                        {optionsTabContent.map((tab) => (
                            <Menu.Item
                                key={tab.id}
                                onClick={() => setOptionsActiveTab(tab)}
                                active={tab.id === optionsActiveTab.id}
                                name={tab.id}
                                color={tab.color}
                            >
                                {tab.name}{' '}
                                <span style={{ marginLeft: 5, color: 'black' }}>
                                    <OptionSideIcon side={tab.id} />
                                </span>
                            </Menu.Item>
                        ))}
                    </Menu>
                )}
                <ReactGridLayout layout={curentLayout} {...reactGridConfig} onLayoutChange={onLayoutChange}>
                    {renderWidgets(optionsMarket)}
                </ReactGridLayout>
            </div>
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

export default Market;
