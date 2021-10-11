import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAppReady, set0xReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import {
    Background,
    Button,
    FilterButton,
    FlexDiv,
    FlexDivCentered,
    FlexDivColumn,
    FlexDivRowCentered,
    Text,
    Wrapper,
} from 'theme/common';
import SearchMarket from '../Home/SearchMarket/SearchMarket';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from 'constants/routes';
import { SYNTHS_MAP } from 'constants/currency';
import useBinaryOptionsOrders from 'queries/options/useBinaryOptionsOrders';
import { DisplayOrder, ExtendedOrderItem, HistoricalOptionsMarketInfo } from 'types/options';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import UserFilter from '../Home/ExploreMarkets/UserFilters';
import { useTranslation } from 'react-i18next';
import { getSynthName } from 'utils/snxJSConnector';
import bitcoin from 'assets/images/filters/bitcoin.svg';
import ethereum from 'assets/images/filters/ethereum.svg';
import myOpenOrders from 'assets/images/filters/my-open-orders.svg';
import long from 'assets/images/filters/long.svg';
import short from 'assets/images/filters/short.svg';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import QuickTradingTable from './QuickTradingTable';
import styled from 'styled-components';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import { useEffect } from 'react';
import useUserAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import { useLocation } from 'react-router-dom';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import QuickTradingMobile from './QuickTradingMobile';
import './media.scss';
import Loader from 'components/Loader';

export enum TradingModeFilterEnum {
    Buy = 'buy',
    Sell = 'sell',
}

export enum OrderFilterEnum {
    All = 'all',
    MyOrders = 'my-orders',
}

export enum CoinFilterEnum {
    All = 'all',
    Bitcoin = 'bitcoin',
    Ethereum = 'ethereum',
}

export enum OptionFilterEnum {
    All = 'all',
    Long = 'long',
    Short = 'short',
}

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const DEFAULT_ORDER_BY = 3; // market expiration time

type OptionsBalance = {
    [address: string]: number;
};

const QuickTradingPage: React.FC<any> = () => {
    try {
        const { t } = useTranslation();
        const networkId = useSelector((state: RootState) => getNetworkId(state));
        const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
        const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
        const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
        const [orderFilter, setOrderFilter] = useState<OrderFilterEnum>(OrderFilterEnum.All);
        const [coinFilter, setCoinFilter] = useState<CoinFilterEnum>(CoinFilterEnum.All);
        const [optionFilter, setOptionFilter] = useState<OptionFilterEnum>(OptionFilterEnum.All);
        const [assetSearch, setAssetSearch] = useState<string>('');
        const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
        const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
        const dispatch = useDispatch();

        const { search } = useLocation();
        const query = new URLSearchParams(search);
        const paramOrder = query.get('order');
        const paramOrderType = query.get('orderType');
        const [orderHash, setOrderHash] = useState<string | null>(paramOrder);
        const [tradingModeFilter, setTradingModeFilter] = useState<TradingModeFilterEnum>(
            paramOrderType === 'buy' ? TradingModeFilterEnum.Sell : TradingModeFilterEnum.Buy
        );

        const isSingleMode = orderHash !== null;

        const isBuyMode = tradingModeFilter === TradingModeFilterEnum.Buy;
        const ordersQuery = useBinaryOptionsOrders(networkId, isBuyMode ? 'sells' : 'buys', {
            enabled: isAppReady,
        });
        const myOrdersQuery = useBinaryOptionsOrders(networkId, isBuyMode ? 'buys' : 'sells', {
            enabled: isAppReady,
        });
        const orders: ExtendedOrderItem[] = ordersQuery.isSuccess && ordersQuery.data ? ordersQuery.data : [];
        const myOrders: ExtendedOrderItem[] = myOrdersQuery.isSuccess && myOrdersQuery.data ? myOrdersQuery.data : [];

        const optionsMarkets = [...orders.map((order) => order.market), ...myOrders.map((order) => order.market)];
        const userAssetsQuery = useUserAssetsBalanceQuery(networkId, optionsMarkets, walletAddress, {
            enabled: isAppReady && isWalletConnected && optionsMarkets.length > 0 && !isBuyMode,
        });

        const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
            enabled: isAppReady && optionsMarkets.length > 0,
        });
        const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

        const trimOrders = useMemo(() => {
            let trimOrders = orderFilter === OrderFilterEnum.MyOrders ? myOrders : orders;
            if (!isBuyMode && isWalletConnected && !isSingleMode) {
                const assets = userAssetsQuery.isSuccess && userAssetsQuery.data ? userAssetsQuery.data : [];
                const optionsAdresses: string[] = [];
                const optionsBalance: OptionsBalance = {};
                assets.forEach((asset) => {
                    if (asset.balances.long > 0) {
                        optionsAdresses.push(asset.market.longAddress.toLowerCase());
                        optionsBalance[asset.market.longAddress.toLowerCase()] = asset.balances.long;
                    }
                    if (asset.balances.short > 0) {
                        optionsAdresses.push(asset.market.shortAddress.toLowerCase());
                        optionsBalance[asset.market.shortAddress.toLowerCase()] = asset.balances.short;
                    }
                });
                trimOrders = trimOrders.filter((order) =>
                    optionsAdresses.includes(
                        orderFilter === OrderFilterEnum.MyOrders
                            ? order.rawOrder.makerToken.toLowerCase()
                            : order.rawOrder.takerToken.toLowerCase()
                    )
                );
                trimOrders.forEach((order) => {
                    order.walletBalance =
                        optionsBalance[
                            orderFilter === OrderFilterEnum.MyOrders
                                ? order.rawOrder.makerToken.toLowerCase()
                                : order.rawOrder.takerToken.toLowerCase()
                        ] || 0;
                });
            }
            return trimOrders;
        }, [
            userAssetsQuery.data,
            orders,
            myOrders,
            tradingModeFilter,
            isWalletConnected,
            walletAddress,
            orderHash,
            orderFilter,
        ]);

        const singleOrders = useMemo(() => {
            if (orderHash !== null) {
                const singleOrders = trimOrders.filter(
                    (order) => order.displayOrder.orderHash.toLowerCase() === orderHash.toLowerCase()
                );
                if (!isBuyMode && isWalletConnected) {
                    const assets = userAssetsQuery.isSuccess && userAssetsQuery.data ? userAssetsQuery.data : [];
                    const optionsAdresses: string[] = [];
                    const optionsBalance: OptionsBalance = {};
                    assets.forEach((asset) => {
                        if (asset.balances.long > 0) {
                            optionsAdresses.push(asset.market.longAddress.toLowerCase());
                            optionsBalance[asset.market.longAddress.toLowerCase()] = asset.balances.long;
                        }
                        if (asset.balances.short > 0) {
                            optionsAdresses.push(asset.market.shortAddress.toLowerCase());
                            optionsBalance[asset.market.shortAddress.toLowerCase()] = asset.balances.short;
                        }
                    });
                    singleOrders.forEach((order) => {
                        order.walletBalance = optionsBalance[order.rawOrder.takerToken.toLowerCase()] || 0;
                    });
                }

                return singleOrders;
            }

            return [];
        }, [trimOrders, myOrders, userAssetsQuery.data, isWalletConnected]);

        const filteredAllOrders = useMemo(() => {
            if (orderHash !== null) return [];

            let filteredOrders = trimOrders;
            if (orderFilter === OrderFilterEnum.MyOrders) {
                filteredOrders = myOrders.filter(
                    (order) => order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase()
                );
            } else {
                filteredOrders = filteredOrders.filter(
                    (order) => order.rawOrder.maker.toLowerCase() !== walletAddress.toLowerCase()
                );
            }
            switch (coinFilter) {
                case CoinFilterEnum.Bitcoin:
                    filteredOrders = filteredOrders.filter((order) => order.market.currencyKey === SYNTHS_MAP.sBTC);
                    break;
                case CoinFilterEnum.Ethereum:
                    filteredOrders = filteredOrders.filter((order) => order.market.currencyKey === SYNTHS_MAP.sETH);
                    break;
            }
            switch (optionFilter) {
                case OptionFilterEnum.Long:
                    filteredOrders = filteredOrders.filter((order) => order.optionSide === 'long');
                    break;
                case OptionFilterEnum.Short:
                    filteredOrders = filteredOrders.filter((order) => order.optionSide === 'short');
                    break;
            }
            return filteredOrders.sort((a, b) => {
                switch (orderBy) {
                    case 2:
                        return sortByMarketField(a.market, b.market, orderDirection, 'asset');
                    case 3:
                        return sortByTime(a, b, orderDirection);
                    case 4:
                        return sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'fillableTotal');
                    case 5:
                        return isBuyMode
                            ? sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'potentialReturn')
                            : sortByOrderField(a.displayOrder, b.displayOrder, orderDirection, 'fillableAmount');
                    case 6:
                        return sortByField(a, b, orderDirection, 'walletBalance');
                    default:
                        return 0;
                }
            });
        }, [
            trimOrders,
            myOrders,
            orderFilter,
            coinFilter,
            optionFilter,
            isWalletConnected,
            walletAddress,
            orderHash,
            orderBy,
            orderDirection,
        ]);

        const filteredOrders = orderHash !== null ? singleOrders : filteredAllOrders;

        const searchFilteredOrders = useDebouncedMemo(
            () => {
                return assetSearch
                    ? filteredOrders.filter((order: ExtendedOrderItem) => {
                          return (
                              order.market.asset.toLowerCase().includes(assetSearch.toLowerCase()) ||
                              getSynthName(order.market.currencyKey)
                                  ?.toLowerCase()
                                  .includes(assetSearch.toLowerCase()) ||
                              order.market.country?.toLowerCase().includes(assetSearch.toLowerCase()) ||
                              order.market.eventName?.toLowerCase().includes(assetSearch.toLowerCase())
                          );
                      })
                    : filteredOrders;
            },
            [filteredOrders, assetSearch],
            DEFAULT_SEARCH_DEBOUNCE_MS
        );

        useEffect(() => {
            // For some reason, creating a new instance of contract wrappers is time-consuming and blocks rendering.
            // Timeout added to delay initialization and not block page rendering.
            setTimeout(() => {
                dispatch(set0xReady(false));
                contractWrappers0xConnector.setExchangeProxy(isWalletConnected, networkId);
                dispatch(set0xReady(true));
            }, 500);
        }, [networkId, isWalletConnected]);

        const resetFilters = () => {
            setOrderFilter(OrderFilterEnum.All);
            setCoinFilter(CoinFilterEnum.All);
            setOptionFilter(OptionFilterEnum.All);
            setAssetSearch('');
            setOrderHash(null);
        };

        return (
            <Background>
                <Wrapper>
                    <MarketHeader route={ROUTES.Options.QuickTrading} />
                    <Title style={{ alignSelf: 'flex-start' }}>{t('options.quick-trading.title')}</Title>
                    <QuickTradingMobile
                        exchangeRates={exchangeRates}
                        tradingModeFilter={tradingModeFilter}
                        orderFilter={orderFilter}
                        coinFilter={coinFilter}
                        optionFilter={optionFilter}
                        setTradingModeFilter={setTradingModeFilter}
                        setOrderFilter={setOrderFilter}
                        setCoinFilter={setCoinFilter}
                        setOptionFilter={setOptionFilter}
                        assetSearch={assetSearch}
                        setAssetSearch={setAssetSearch}
                        orders={assetSearch ? searchFilteredOrders : filteredOrders}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        isSingleMode={isSingleMode}
                        isLoading={ordersQuery.isLoading || (!isBuyMode && userAssetsQuery.isLoading)}
                        resetFilters={resetFilters}
                    ></QuickTradingMobile>

                    <div id="quick-trading" className="quick-trading-desktop" style={{ width: '100%' }}>
                        <FlexDivCentered style={{ flexFlow: 'wrap' }}>
                            {Object.values(OrderFilterEnum).map((filterItem) => {
                                return filterItem === OrderFilterEnum.All ? null : (
                                    <UserFilter
                                        className={isWalletConnected && orderFilter === filterItem ? 'selected' : ''}
                                        disabled={!isWalletConnected || isSingleMode}
                                        onClick={() =>
                                            isWalletConnected
                                                ? setOrderFilter(
                                                      orderFilter === filterItem ? OrderFilterEnum.All : filterItem
                                                  )
                                                : {}
                                        }
                                        key={filterItem}
                                        img={getOrderImage(filterItem)}
                                        text={t(`options.filters-labels.${filterItem}`)}
                                    />
                                );
                            })}
                            {Object.values(CoinFilterEnum).map((filterItem) => {
                                return filterItem === CoinFilterEnum.All ? null : (
                                    <UserFilter
                                        className={coinFilter === filterItem ? 'selected' : ''}
                                        disabled={isSingleMode}
                                        onClick={() =>
                                            setCoinFilter(coinFilter === filterItem ? CoinFilterEnum.All : filterItem)
                                        }
                                        key={filterItem}
                                        img={getCoinImage(filterItem)}
                                        text={t(`options.filters-labels.${filterItem}`)}
                                    />
                                );
                            })}
                            {Object.values(OptionFilterEnum).map((filterItem) => {
                                return filterItem === OptionFilterEnum.All ? null : (
                                    <UserFilter
                                        className={optionFilter === filterItem ? 'selected' : ''}
                                        disabled={isSingleMode}
                                        onClick={() =>
                                            setOptionFilter(
                                                filterItem === optionFilter ? OptionFilterEnum.All : filterItem
                                            )
                                        }
                                        key={filterItem}
                                        img={getOptionImage(filterItem)}
                                        text={t(`options.filters-labels.${filterItem}`)}
                                    />
                                );
                            })}
                        </FlexDivCentered>
                        <FlexDiv
                            className="table-filters"
                            style={{
                                justifyContent: 'space-between',
                                marginTop: 40,
                                background: '#04045a',
                                borderTopLeftRadius: '23px',
                                borderTopRightRadius: '23px',
                                width: '100%',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FlexDivRowCentered>
                                    <ModeLabel>{t('options.quick-trading.mode-label')}:</ModeLabel>
                                    {Object.values(TradingModeFilterEnum).map((filterItem) => (
                                        <FilterButton
                                            className={tradingModeFilter === filterItem ? 'selected' : ''}
                                            onClick={() => setTradingModeFilter(filterItem)}
                                            key={filterItem}
                                            disabled={isSingleMode}
                                        >
                                            {t(`options.trading-mode.${filterItem.toLowerCase()}`).toUpperCase()}
                                        </FilterButton>
                                    ))}
                                </FlexDivRowCentered>
                            </div>
                            {!isSingleMode && (
                                <SearchMarket assetSearch={assetSearch} setAssetSearch={setAssetSearch} />
                            )}
                        </FlexDiv>
                        <QuickTradingTable
                            orders={assetSearch ? searchFilteredOrders : filteredOrders}
                            isLoading={ordersQuery.isLoading || (!isBuyMode && userAssetsQuery.isLoading)}
                            tradingModeFilter={tradingModeFilter}
                            orderFilter={orderFilter}
                            coinFilter={coinFilter}
                            optionFilter={optionFilter}
                            isSingleMode={isSingleMode}
                            resetFilters={resetFilters}
                            exchangeRates={exchangeRates}
                            orderBy={orderBy}
                            orderDirection={orderDirection}
                            setOrderBy={setOrderBy}
                            setOrderDirection={setOrderDirection}
                        >
                            <NoOrders>
                                <>
                                    <Text className="text-l bold pale-grey">
                                        {t('options.quick-trading.no-orders-found')}
                                    </Text>
                                    <Button className="primary" onClick={resetFilters}>
                                        {t('options.quick-trading.view-all-orders')}
                                    </Button>
                                </>
                            </NoOrders>
                        </QuickTradingTable>
                    </div>
                </Wrapper>
            </Background>
        );
    } catch (e) {
        return <Loader />;
    }
};

const getOrderImage = (filter: OrderFilterEnum) => {
    switch (filter) {
        case OrderFilterEnum.MyOrders:
            return myOpenOrders;
    }
};

const getCoinImage = (filter: CoinFilterEnum) => {
    switch (filter) {
        case CoinFilterEnum.Bitcoin:
            return bitcoin;
        case CoinFilterEnum.Ethereum:
            return ethereum;
    }
};

const getOptionImage = (filter: OptionFilterEnum) => {
    switch (filter) {
        case OptionFilterEnum.Long:
            return long;
        case OptionFilterEnum.Short:
            return short;
    }
};

const sortByTime = (a: ExtendedOrderItem, b: ExtendedOrderItem, direction: OrderDirection) => {
    if (direction === OrderDirection.ASC && a.market.phaseNum === b.market.phaseNum) {
        return a.market.timeRemaining > b.market.timeRemaining ? -1 : 1;
    }
    if (direction === OrderDirection.DESC && a.market.phaseNum === b.market.phaseNum) {
        return a.market.timeRemaining > b.market.timeRemaining ? 1 : -1;
    }

    return 0;
};

const sortByField = (
    a: ExtendedOrderItem,
    b: ExtendedOrderItem,
    direction: OrderDirection,
    field: keyof ExtendedOrderItem
) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const sortByOrderField = (a: DisplayOrder, b: DisplayOrder, direction: OrderDirection, field: keyof DisplayOrder) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const sortByMarketField = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection,
    field: keyof HistoricalOptionsMarketInfo
) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const Title = styled.p`
    font-weight: bold;
    line-height: 64px;
    letter-spacing: -1px;
    font-size: 39px;
    padding-bottom: 65px;
    color: #f6f6fe;
    @media (max-width: 1024px) {
        font-size: 31px;
        padding-top: 30px;
        padding-bottom: 0;
    }
`;

const ModeLabel = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: #f6f6fe;
    margin-left: 30px;
    margin-right: 10px;
    text-transform: uppercase;
`;

const NoOrders = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    .primary {
        align-self: center;
    }
    border-radius: 0 0 23px 23px;
`;

export default QuickTradingPage;
