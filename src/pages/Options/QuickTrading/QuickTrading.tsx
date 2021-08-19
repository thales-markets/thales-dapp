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
    FlexDivColumnCentered,
    FlexDivRowCentered,
    MainWrapper,
    Text,
} from 'theme/common';
import SearchMarket from '../Home/SearchMarket/SearchMarket';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from 'constants/routes';
import { SYNTHS_MAP } from 'constants/currency';
import useBinaryOptionsOrders from 'queries/options/useBinaryOptionsOrders';
import { ExtendedOrderItem } from 'types/options';
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

export enum TradingModeFilterEnum {
    Buy = 'buy',
    Sell = 'sell',
}

export enum OrderFilterEnum {
    All = 'All',
    MyOrders = 'My Orders',
}

export enum CoinFilterEnum {
    All = 'All',
    Bitcoin = 'Bitcoin',
    Ethereum = 'Ethereum',
}

export enum OptionFilterEnum {
    All = 'All',
    Long = 'Long',
    Short = 'Short',
}

type OptionsBalance = {
    [address: string]: number;
};

const QuickTradingPage: React.FC<any> = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [orderFilter, setOrderFilter] = useState<OrderFilterEnum>(OrderFilterEnum.All);
    const [coinFilter, setCoinFilter] = useState<CoinFilterEnum>(CoinFilterEnum.All);
    const [optionFilter, setOptionFilter] = useState<OptionFilterEnum>(OptionFilterEnum.All);
    const [assetSearch, setAssetSearch] = useState<string>('');
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

    const optionsMarkets = orders.map((order) => order.market);
    const userAssetsQuery = useUserAssetsBalanceQuery(networkId, optionsMarkets, walletAddress, {
        enabled: isAppReady && isWalletConnected && optionsMarkets.length > 0 && !isBuyMode,
    });

    const trimOrders = useMemo(() => {
        let trimOrders = orders;
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
                optionsAdresses.includes(order.rawOrder.takerToken.toLowerCase())
            );
            trimOrders.forEach((order) => {
                order.walletBalance = optionsBalance[order.rawOrder.takerToken.toLowerCase()] || 0;
            });
        }
        return trimOrders;
    }, [userAssetsQuery.data, orders, tradingModeFilter, isWalletConnected, walletAddress, orderHash]);

    const singleOrders = useMemo(() => {
        if (orderHash !== null) {
            const singleBuy = myOrders.filter(
                (order) => order.displayOrder.orderHash.toLowerCase() === orderHash.toLowerCase()
            );
            const singleSell = trimOrders.filter(
                (order) => order.displayOrder.orderHash.toLowerCase() === orderHash.toLowerCase()
            );

            return [...singleBuy, ...singleSell];
        }

        return [];
    }, [trimOrders, myOrders]);

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
        return filteredOrders;
    }, [trimOrders, myOrders, orderFilter, coinFilter, optionFilter, isWalletConnected, walletAddress, orderHash]);

    const filteredOrders = orderHash !== null ? singleOrders : filteredAllOrders;

    const searchFilteredOrders = useDebouncedMemo(
        () => {
            return assetSearch
                ? filteredOrders.filter((order: ExtendedOrderItem) => {
                      return (
                          order.market.asset.toLowerCase().includes(assetSearch.toLowerCase()) ||
                          getSynthName(order.market.currencyKey)?.toLowerCase().includes(assetSearch.toLowerCase())
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

    console.log(filteredOrders);

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <MainWrapper>
                <FlexDivColumnCentered>
                    <MarketHeader route={ROUTES.Options.QuickTrading} />
                    <FlexDivColumnCentered style={{ padding: '40px 140px' }}>
                        <Title>{t('options.quick-trading.title')}</Title>
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
                                        text={filterItem}
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
                                        text={filterItem}
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
                                        text={filterItem}
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
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FlexDivRowCentered>
                                    <ModeLabel>{t('options.quick-trading.mode-label')}:</ModeLabel>
                                    {Object.keys(TradingModeFilterEnum)
                                        .filter((key) =>
                                            isNaN(
                                                Number(TradingModeFilterEnum[key as keyof typeof TradingModeFilterEnum])
                                            )
                                        )
                                        .map((key) => (
                                            <FilterButton
                                                className={
                                                    tradingModeFilter ===
                                                    TradingModeFilterEnum[key as keyof typeof TradingModeFilterEnum]
                                                        ? 'selected'
                                                        : ''
                                                }
                                                onClick={() =>
                                                    setTradingModeFilter(
                                                        TradingModeFilterEnum[key as keyof typeof TradingModeFilterEnum]
                                                    )
                                                }
                                                key={key}
                                                disabled={isSingleMode}
                                            >
                                                {t(`options.trading-mode.${key.toLowerCase()}`)}
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
                    </FlexDivColumnCentered>
                </FlexDivColumnCentered>
            </MainWrapper>
        </Background>
    );
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

const Title = styled.p`
    font-weight: bold;
    line-height: 64px;
    letter-spacing: -1px;
    font-size: 39px;
    padding-bottom: 65px;
    color: #f6f6fe;
`;

const ModeLabel = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: #f6f6fe;
    margin-left: 30px;
    margin-right: 10px;
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
