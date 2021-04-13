import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { USD_SIGN } from 'constants/currency';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { MarketProvider } from './contexts/MarketContext';
import { useBOMContractContext } from './contexts/BOMContractContext';
import { Button, Icon, Label, Loader, Menu, Segment, Sidebar } from 'semantic-ui-react';
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
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import YourTransactions from './TransactionsCard/YourTransactions';
import RecentTransactions from './TransactionsCard/RecentTransactions';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import TradeOptionsSide from './TradeOptions/TradeOptionsSide';
import Orderbook from './TradeOptions/Orderbook';

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
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
    const dispatch = useDispatch();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

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

    const optionsAmountLabel = () => (
        <Label onClick={() => setSidebarVisible(!sidebarVisible)} className="button-label">
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
            {userActionAvailable && <Label circular color="red" empty floating style={{ top: 18 }} />}
        </Label>
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

    const layout = [
        { i: 'd', x: 0, y: 1, w: 12, h: 10 },
        { i: 'e', x: 0, y: 1, w: 12, h: 10 },
        { i: 'i', x: 0, y: 1, w: 12, h: 10 },
    ];

    const aaaa = {
        className: 'layout',
        cols: 12,
        rowHeight: 30,
        isBounded: true,
        // This turns off compaction so you can place items wherever.
        //verticalCompact: false,
        // This turns off rearrangement so items will not be pushed arround.
        //preventCollision: true,
    };

    if (optionsMarket && optionsMarket.phase === 'bidding') {
        layout.unshift({ i: 'b', x: 0, y: 0, w: 12, h: 17 });
    }

    if (optionsMarket && optionsMarket.phase === 'trading') {
        layout.unshift({ i: 'b', x: 0, y: 0, w: 6, h: 17 }, { i: 'c', x: 6, y: 0, w: 6, h: 17 });
    }

    console.log(layout);

    const renderGridLayoutItems = (optionsMarket: OptionsMarketInfo) => {
        const items = [
            <div key="d">
                <section style={{ padding: '10px 10px', height: '100%' }}>
                    <div style={{ overflow: 'auto', height: '100%', border: '1px solid #bbb', padding: '1rem' }}>
                        <ChartCard />
                    </div>
                </section>
            </div>,
            <div key="e">
                <section style={{ padding: '10px 10px', height: '100%' }}>
                    <div style={{ overflow: 'auto', height: '100%', border: '1px solid #bbb', padding: '1rem' }}>
                        <RecentTransactions marketAddress={optionsMarket.address} />
                    </div>
                </section>
            </div>,
            <div key="i">
                <section style={{ padding: '10px 10px', height: '100%' }}>
                    <div style={{ overflow: 'auto', height: '100%', border: '1px solid #bbb', padding: '1rem' }}>
                        <YourTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress} />
                    </div>
                </section>
            </div>,
        ];

        if (optionsMarket && optionsMarket.phase === 'bidding') {
            items.unshift(
                <div key="b">
                    <section style={{ padding: '10px 10px', height: '100%' }}>
                        <div style={{ overflow: 'auto', height: '100%', border: '1px solid #bbb', padding: '1rem' }}>
                            <BiddingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
                        </div>
                    </section>
                </div>
            );
        }

        if (optionsMarket && optionsMarket.phase === 'trading') {
            items.unshift(
                <div key="b">
                    <section style={{ padding: '10px 10px', height: '100%' }}>
                        <div style={{ overflow: 'auto', height: '100%', border: '1px solid #bbb', padding: '1rem' }}>
                            <Orderbook optionSide={optionsActiveTab.id} />
                        </div>
                    </section>
                </div>,
                <div key="c">
                    <section style={{ padding: '10px 10px', height: '100%' }}>
                        <div style={{ overflow: 'auto', height: '100%', border: '1px solid #bbb', padding: '1rem' }}>
                            <TradeOptionsSide optionSide={optionsActiveTab.id} />
                        </div>
                    </section>
                </div>
            );
        }

        return items;
    };

    useEffect(() => {
        if (optionsMarket && optionsMarket.phase === 'trading') {
            dispatch(set0xReady(false));
            // TODO: For some reason, creating a new instance of contract wrappers is time-consuming and blocks rendering. Find a way to optimize this.
            contractWrappers0xConnector.setContractWrappers0x(isWalletConnected, networkId);
            dispatch(set0xReady(true));
        }
    }, [networkId, isWalletConnected]);

    const onLayoutChange = (layout: any) => {
        /*eslint no-console: 0*/
        console.log('layout', layout);
    };

    return optionsMarket ? (
        <MarketProvider optionsMarket={optionsMarket}>
            <Sidebar.Pushable as={Segment}>
                <Sidebar animation="slide along" visible={sidebarVisible} width="very wide" direction="right">
                    {optionsMarket.phase === 'trading' && (
                        <TradingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
                    )}
                    {optionsMarket.phase === 'maturity' && (
                        <MaturityPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
                    )}
                </Sidebar>

                <Sidebar.Pusher>
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
                        {(optionsMarket.phase === 'trading' || optionsMarket.phase === 'maturity') && (
                            <div style={{ marginTop: 10 }}>
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
                    <ReactGridLayout layout={layout} {...aaaa} onLayoutChange={onLayoutChange}>
                        {renderGridLayoutItems(optionsMarket)}
                    </ReactGridLayout>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
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
