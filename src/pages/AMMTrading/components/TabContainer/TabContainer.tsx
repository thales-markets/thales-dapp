import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Orderbook from '../OrderbookView/components/Orderbook';
import OptionPriceTab from '../Tabs/OptionPriceTab';
import UserActivity from '../Tabs/UserActivity';
import TradingView from '../Tabs/TradingView';
import MarketActivity from '../Tabs/MarketActivity';
import Container from './styled-components/Container';
import SPAAnchor from 'components/SPAAnchor';
import { SimilarMarketsContainer } from './styled-components/SimilarMarkets';

import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getSimilarMarketsVisibility } from 'redux/modules/marketWidgets';
import { getNetworkId } from 'redux/modules/wallet';
import { sortOptionsMarkets } from 'utils/options';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { getIsAppReady } from 'redux/modules/app';
import { buildOptionsMarketLink } from 'utils/routes';
import MarketCard from 'pages/Markets/components/MarketsCard';

import { OptionSide } from 'types/options';

type TabContainerProps = {
    optionSide?: OptionSide;
};

const TabContainer: React.FC<TabContainerProps> = ({ optionSide }) => {
    const marketInfo = useMarketContext();

    const [currentTab, setCurrentTab] = useState<number>(optionSide ? 0 : 1);
    const similarMarketsVisibility = useSelector((state: RootState) => getSimilarMarketsVisibility(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            let markets = openOrdersMap
                ? marketsQuery.data.map((m) => ({
                      ...m,
                      openOrders: (openOrdersMap as any).get(m.address.toLowerCase())?.ordersCount ?? '0',
                      availableLongs: (openOrdersMap as any).get(m.address.toLowerCase())?.availableLongs ?? '0',
                      availableShorts: (openOrdersMap as any).get(m.address.toLowerCase())?.availableShorts ?? '0',
                      longPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.longPrice ?? '0',
                      shortPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.shortPrice ?? '0',
                  }))
                : marketsQuery.data;

            markets = markets.filter((market) => market.currencyKey == marketInfo?.currencyKey);
            markets = markets.filter((market) => market.availableLongs > 0 && market.availableShorts > 0);
            markets = markets.filter((market) => market.maturityDate == marketInfo.maturityDate);
            markets = sortOptionsMarkets(markets);
            return markets.slice(0, 6);
        }
        return [];
    }, [marketsQuery]);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
        enabled: isAppReady && optionsMarkets.length > 0,
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const { t } = useTranslation();

    const tabItems = [
        ...(optionSide
            ? [
                  {
                      title: t('options.market.widgets.orderbook-widget'),
                      index: 0,
                  },
              ]
            : []),
        {
            title: t('options.market.widgets.chart-trading-view-widget'),
            index: 1,
        },
        {
            title: t('options.market.widgets.chart-options-price-widget'),
            index: 2,
        },
        {
            title: t('options.market.widgets.your-transactions-widget'),
            index: 3,
        },
        {
            title: t('options.market.widgets.recent-transactions-widget'),
            index: 4,
        },
    ];

    return (
        <>
            {!similarMarketsVisibility && (
                <Container>
                    <Container.Main>
                        {tabItems &&
                            tabItems.map((item, index) => {
                                return (
                                    <Container.Main.Item
                                        active={item.index == currentTab}
                                        key={index}
                                        onClick={() => setCurrentTab(item.index)}
                                    >
                                        {item.title}
                                    </Container.Main.Item>
                                );
                            })}
                    </Container.Main>
                    <Container.Tab>
                        {currentTab == 0 && (optionSide ? <Orderbook optionSide={optionSide} /> : <></>)}
                        {currentTab == 1 && <TradingView />}
                        {currentTab == 2 && <OptionPriceTab />}
                        {currentTab == 3 && <UserActivity />}
                        {currentTab == 4 && <MarketActivity />}
                    </Container.Tab>
                </Container>
            )}
            {similarMarketsVisibility && (
                <SimilarMarketsContainer>
                    {optionsMarkets?.length > 0 &&
                        optionsMarkets.map((optionMarket, index) => {
                            return (
                                <SPAAnchor key={index} href={buildOptionsMarketLink(optionMarket.address)}>
                                    <MarketCard
                                        optionMarket={optionMarket}
                                        exchangeRates={exchangeRates}
                                        marketCardStyle={{
                                            maxWidth: '49%',
                                            wrapperMargin: '0px 0px 10px 0px',
                                        }}
                                    />{' '}
                                </SPAAnchor>
                            );
                        })}
                </SimilarMarketsContainer>
            )}
        </>
    );
};

export default TabContainer;
