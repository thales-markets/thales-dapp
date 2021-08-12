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

export enum TradingModeFilterEnum {
    Buy = 'buy',
    Sell = 'sell',
}

export enum UserFilterEnum {
    All = 'All',
    MyOrders = 'My Orders',
    Bitcoin = 'Bitcoin',
    Ethereum = 'Ethereum',
    Long = 'Long',
    Short = 'Short',
}

const QuickTradingPage: React.FC<any> = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [tradingModeFilter, setTradingModeFilter] = useState<TradingModeFilterEnum>(TradingModeFilterEnum.Buy);
    const [userFilter, setUserFilter] = useState<UserFilterEnum>(UserFilterEnum.All);
    const [assetSearch, setAssetSearch] = useState<string>('');
    const dispatch = useDispatch();

    const isBuyMode = tradingModeFilter === TradingModeFilterEnum.Buy;
    const ordersQuery = useBinaryOptionsOrders(networkId, isBuyMode ? 'sells' : 'buys', {
        enabled: isAppReady,
    });
    const myOrdersQuery = useBinaryOptionsOrders(networkId, isBuyMode ? 'buys' : 'sells', {
        enabled: isAppReady,
    });
    const orders: ExtendedOrderItem[] = ordersQuery.isSuccess && ordersQuery.data ? ordersQuery.data : [];
    const myOrders: ExtendedOrderItem[] = myOrdersQuery.isSuccess && myOrdersQuery.data ? myOrdersQuery.data : [];

    const filteredOrders = useMemo(() => {
        let filteredOrders = orders;
        switch (userFilter) {
            case UserFilterEnum.MyOrders:
                filteredOrders = myOrders.filter(
                    (order) => order.rawOrder.maker.toLowerCase() === walletAddress.toLowerCase()
                );
                break;
            case UserFilterEnum.Bitcoin:
                filteredOrders = filteredOrders.filter((order) => order.market.currencyKey === SYNTHS_MAP.sBTC);
                break;
            case UserFilterEnum.Ethereum:
                filteredOrders = filteredOrders.filter((order) => order.market.currencyKey === SYNTHS_MAP.sETH);
                break;
            case UserFilterEnum.Long:
                filteredOrders = filteredOrders.filter((order) => order.optionSide === 'long');
                break;
            case UserFilterEnum.Short:
                filteredOrders = filteredOrders.filter((order) => order.optionSide === 'short');
                break;
        }
        if (userFilter !== UserFilterEnum.MyOrders) {
            filteredOrders = filteredOrders.filter(
                (order) => order.rawOrder.maker.toLowerCase() !== walletAddress.toLowerCase()
            );
        }
        return filteredOrders;
    }, [orders, userFilter, isWalletConnected, walletAddress]);

    const searchFilteredOrders = useDebouncedMemo(
        () => {
            return assetSearch
                ? filteredOrders.filter((order) => {
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

    const onClickUserFilter = (filter: UserFilterEnum, isDisabled: boolean) => {
        if (!isDisabled) {
            setUserFilter(userFilter === filter ? UserFilterEnum.All : filter);
        }
        return;
    };

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
        setUserFilter(UserFilterEnum.All);
    };

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <MainWrapper>
                <FlexDivColumnCentered>
                    <MarketHeader route={ROUTES.Options.QuickTrading} />
                    <FlexDivColumnCentered style={{ padding: '40px 140px' }}>
                        <Title>{t('options.quick-trading.title')}</Title>
                        <FlexDivCentered style={{ flexFlow: 'wrap' }}>
                            {Object.keys(UserFilterEnum)
                                .filter(
                                    (key) =>
                                        isNaN(Number(UserFilterEnum[key as keyof typeof UserFilterEnum])) &&
                                        key !== UserFilterEnum.All
                                )
                                .map((key, index) => {
                                    const isDisabled = !isWalletConnected && index < 1;
                                    return (
                                        <UserFilter
                                            className={`${
                                                !isDisabled &&
                                                userFilter === UserFilterEnum[key as keyof typeof UserFilterEnum]
                                                    ? 'selected'
                                                    : ''
                                            }`}
                                            disabled={isDisabled}
                                            onClick={onClickUserFilter.bind(
                                                this,
                                                UserFilterEnum[key as keyof typeof UserFilterEnum],
                                                isDisabled
                                            )}
                                            key={key}
                                            img={getImage(UserFilterEnum[key as keyof typeof UserFilterEnum])}
                                            text={UserFilterEnum[key as keyof typeof UserFilterEnum]}
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
                                            >
                                                {t(`options.trading-mode.${key.toLowerCase()}`)}
                                            </FilterButton>
                                        ))}
                                </FlexDivRowCentered>
                            </div>
                            <SearchMarket assetSearch={assetSearch} setAssetSearch={setAssetSearch} />
                        </FlexDiv>
                        <QuickTradingTable
                            orders={assetSearch ? searchFilteredOrders : filteredOrders}
                            isLoading={ordersQuery.isLoading}
                            tradingModeFilter={tradingModeFilter}
                            userFilter={userFilter}
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

const getImage = (filter: UserFilterEnum) => {
    switch (filter) {
        case UserFilterEnum.Bitcoin:
            return bitcoin;
        case UserFilterEnum.Ethereum:
            return ethereum;
        case UserFilterEnum.MyOrders:
            return myOpenOrders;
        case UserFilterEnum.Long:
            return long;
        case UserFilterEnum.Short:
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
`;

export default QuickTradingPage;
