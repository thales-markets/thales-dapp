import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Orderbook from '../OrderbookView/components/Orderbook';
import OptionPriceTab from '../Tabs/OptionPriceTab';
import UserActivity from '../Tabs/UserActivity';
import TradingView from '../Tabs/TradingView';
import MarketActivity from '../Tabs/MarketActivity';
import Container from './styled-components/Container';
import SPAAnchor from 'components/SPAAnchor';
import { SimilarMarketsContainer } from './styled-components/SimilarMarkets';
import { useDispatch } from 'react-redux';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getSimilarMarketsVisibility, setSimilarMarketVisibility } from 'redux/modules/marketWidgets';
import { getNetworkId } from 'redux/modules/wallet';
import { sortOptionsMarkets } from 'utils/options';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { getIsAppReady } from 'redux/modules/app';
import { buildOptionsMarketLink } from 'utils/routes';
import MarketCard from 'pages/Markets/components/MarketsCard';

import { OptionSide } from 'types/options';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

type TabContainerProps = {
    optionSide?: OptionSide;
};

const TabContainer: React.FC<TabContainerProps> = ({ optionSide }) => {
    const marketInfo = useMarketContext();
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState<number>(optionSide ? 0 : 1);
    const [inMaturity, setMaturity] = useState<boolean>(false);
    const similarMarketsVisibility = useSelector((state: RootState) => getSimilarMarketsVisibility(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);
    const [showViewsDropdown, setShowViewsDropdown] = useState<boolean>(false);

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);

    useEffect(() => {
        if (marketInfo.phase == 'maturity') {
            setMaturity(true);
            setCurrentTab(4);
        }
    }, [marketInfo.phase]);

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
            markets = markets.filter((market) => market.availableLongs > 0 || market.availableShorts > 0);
            markets = markets.filter((market) => market.maturityDate == marketInfo.maturityDate);
            markets = markets.filter((market) => market.address !== marketInfo.address);
            markets = sortOptionsMarkets(markets);
            return markets;
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
        ...(optionSide && !inMaturity
            ? [
                  {
                      title: t('options.market.widgets.orderbook-widget'),
                      index: 0,
                  },
              ]
            : []),
        ...(!inMaturity
            ? [
                  {
                      title: t('options.market.widgets.chart', { currencyKey: marketInfo?.currencyKey }),
                      index: 1,
                  },
              ]
            : []),
        ...(!inMaturity
            ? [
                  {
                      title: t('options.market.widgets.position-price'),
                      index: 2,
                  },
              ]
            : []),
        ...(!inMaturity
            ? [
                  {
                      title: t('options.market.widgets.your-transactions-widget'),
                      index: 3,
                  },
              ]
            : []),
        {
            title: t('options.market.widgets.recent-transactions-widget'),
            index: 4,
        },
    ];

    return (
        <>
            <FiltersButton onClick={() => setShowViewsDropdown(!showViewsDropdown)}>Views</FiltersButton>
            {showViewsDropdown && (
                <PositionWrapper>
                    <Wrapper>
                        <OutsideClickHandler onOutsideClick={() => setShowViewsDropdown(false)}>
                            <Title>Views</Title>
                            {tabItems &&
                                tabItems.map((item, index) => {
                                    return (
                                        <Item
                                            active={!similarMarketsVisibility && currentTab === item.index}
                                            key={index}
                                            onClick={() => {
                                                dispatch(setSimilarMarketVisibility(false));
                                                setCurrentTab(item.index);
                                                setShowViewsDropdown(false);
                                            }}
                                        >
                                            {item.title}
                                        </Item>
                                    );
                                })}
                            <Item
                                active={similarMarketsVisibility}
                                onClick={() => {
                                    dispatch(setSimilarMarketVisibility(true));
                                    setShowViewsDropdown(false);
                                }}
                            >
                                {t('options.market.overview.similar-markets')}
                            </Item>
                        </OutsideClickHandler>
                    </Wrapper>
                </PositionWrapper>
            )}
            {!similarMarketsVisibility && (
                <Container>
                    <Container.Main justifyContent={inMaturity ? 'flex-start' : ''}>
                        {tabItems &&
                            tabItems.map((item, index) => {
                                return (
                                    <Container.Main.Item
                                        active={item.index == currentTab}
                                        key={index}
                                        noStrech={inMaturity ? true : false}
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
                                    />
                                </SPAAnchor>
                            );
                        })}
                </SimilarMarketsContainer>
            )}
        </>
    );
};

const PositionWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    z-index: 2;
`;

const FiltersButton = styled.div`
    display: none;
    padding: 6px 20px;
    border: 1.5px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 30px;
    background: transparent;
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
    text-transform: uppercase;
    color: #64d9fe;
    @media (max-width: 768px) {
        display: block;
        align-self: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
`;

const Wrapper = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
        border: 2px solid rgba(100, 217, 254, 0.5);
        box-sizing: border-box;
        border-radius: 12px;
        padding: 15px 20px;
        max-width: 240px;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
        top: -56px;
        z-index: 2;
    }
`;

const Item = styled.div<{ active: boolean }>`
    text-transform: uppercase;
    cursor: pointer;
    font-family: Roboto !important;
    font-style: normal;
    color: ${(_props) => (_props?.active ? '#64d9fe' : '#ffffff')};

    @media (max-width: 768px) {
        font-weight: bold;
        font-size: 12px;
        line-height: 162.5%;
    }
`;

const Title = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: #64d9fe;
    @media (min-width: 769px) {
        display: none;
    }
    margin-bottom: 10px;
`;

export default TabContainer;
