import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { Button, FlexDiv, FlexDivColumn, Text } from 'theme/common';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import styled from 'styled-components';
import { Overlay } from 'components/Header/Header';
import { TradingModeFilterEnum, OrderFilterEnum, CoinFilterEnum, OptionFilterEnum } from './QuickTrading';
import SearchMarket from '../Home/SearchMarket';
import { CategoryFilters, DropDown, DropDownWrapper } from '../Home/ExploreMarkets/Mobile/CategoryFilters';
import { TradingModeFilters } from '../Home/ExploreMarkets/Mobile/TradingModeFilters';
import { SortyByMobile } from '../Home/ExploreMarkets/Mobile/SortByMobile';
import OrderCardMobile from '../Home/ExploreMarkets/Mobile/OrderCardMobile';
import { ExtendedOrders } from 'types/options';
import SimpleLoader from 'components/SimpleLoader';

type QuickTradingMobileProps = {
    exchangeRates: Rates | null;
    orders: ExtendedOrders;
    tradingModeFilter: TradingModeFilterEnum;
    orderFilter: OrderFilterEnum;
    coinFilter: CoinFilterEnum;
    optionFilter: OptionFilterEnum;
    setTradingModeFilter: (data: any) => void;
    setOrderFilter: (data: any) => void;
    setCoinFilter: (data: any) => void;
    setOptionFilter: (data: any) => void;
    assetSearch: any;
    setAssetSearch: (data: any) => void;
    orderBy: number;
    setOrderBy: (data: any) => void;
    isSingleMode: boolean;
    isLoading: boolean;
    resetFilters: any;
};

export enum SortByBuyEnum {
    Condition = 'condition-col',
    When = 'when-col',
    AmountToDeposit = 'depostit-amount-col',
    ReturnIfWin = 'return-col',
}

export enum SortBySellEnum {
    Condition = 'condition-col',
    When = 'when-col',
    AmountToReceive = 'receive-amount-col',
    OptionsToSell = 'options-to-sell-col',
    OptionsInWallet = 'options-in-wallet-col',
}

const QuickTradingMobile: React.FC<QuickTradingMobileProps> = ({
    orders,
    tradingModeFilter,
    orderFilter,
    coinFilter,
    optionFilter,
    setTradingModeFilter,
    setOrderFilter,
    setCoinFilter,
    setOptionFilter,
    assetSearch,
    setAssetSearch,
    orderBy,
    setOrderBy,
    isSingleMode,
    exchangeRates,
    isLoading,
    resetFilters,
}) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const { t } = useTranslation();
    const [showDropdownTradingMode, setShowDropdownTradingMode] = useState(false);
    const [showDropdownUserFilters, setShowDropdownUserFilters] = useState(false);
    const [showDropdownSort, setShowDropdownSort] = useState(false);

    const isBuyMode = tradingModeFilter === TradingModeFilterEnum.Buy;

    const getCategoryFilter = () => {
        if (
            coinFilter === CoinFilterEnum.All &&
            optionFilter === OptionFilterEnum.All &&
            orderFilter === OrderFilterEnum.All
        ) {
            return t(`options.filters-labels.${orderFilter}`);
        }
        let categoryFilter = '';
        if (orderFilter !== OrderFilterEnum.All) {
            categoryFilter = `${t(`options.filters-labels.${categoryFilter}`)}, ${t(
                `options.filters-labels.${orderFilter}`
            )}`;
        }
        if (coinFilter !== CoinFilterEnum.All) {
            categoryFilter = `${t(`options.filters-labels.${categoryFilter}`)}, ${t(
                `options.filters-labels.${coinFilter}`
            )}`;
        }
        if (optionFilter !== OptionFilterEnum.All) {
            categoryFilter = `${t(`options.filters-labels.${categoryFilter}`)}, ${t(
                `options.filters-labels.${optionFilter}`
            )}`;
        }
        return categoryFilter.substring(1);
    };

    return (
        <div className="quick-trading-mobile">
            {!isSingleMode && (
                <SearchMarket
                    className="quick-trading-mobile__search"
                    assetSearch={assetSearch}
                    setAssetSearch={setAssetSearch}
                />
            )}
            <FlexDiv className="quick-trading-mobile__filters">
                {!isSingleMode && (
                    <CategoryFilters
                        onClick={setShowDropdownUserFilters.bind(this, !showDropdownUserFilters)}
                        filter={getCategoryFilter()}
                    >
                        <DropDownWrapper hidden={!showDropdownUserFilters}>
                            <DropDown>
                                <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                    {t('options.filters-labels.category')}
                                </Text>
                                {Object.values(OrderFilterEnum).map((filterItem) => {
                                    const isDisabled =
                                        (!isWalletConnected || isSingleMode) && filterItem !== OrderFilterEnum.All;
                                    return (
                                        <Text
                                            key={filterItem}
                                            onClick={() =>
                                                !isDisabled
                                                    ? setOrderFilter(
                                                          orderFilter === filterItem ? OrderFilterEnum.All : filterItem
                                                      )
                                                    : {}
                                            }
                                            className={`${
                                                !isDisabled && orderFilter === filterItem ? 'selected' : ''
                                            } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                            style={{ marginLeft: 20 }}
                                        >
                                            {t(`options.filters-labels.${filterItem}`)}
                                        </Text>
                                    );
                                })}
                                <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                    {t('options.filters-labels.discover')}
                                </Text>
                                {Object.values(CoinFilterEnum).map((filterItem) => {
                                    const isDisabled = isSingleMode;
                                    return filterItem === CoinFilterEnum.All ? null : (
                                        <Text
                                            key={filterItem}
                                            onClick={() =>
                                                !isDisabled
                                                    ? setCoinFilter(
                                                          coinFilter === filterItem ? CoinFilterEnum.All : filterItem
                                                      )
                                                    : {}
                                            }
                                            className={`${
                                                !isDisabled && coinFilter === filterItem ? 'selected' : ''
                                            } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                            style={{ marginLeft: 20 }}
                                        >
                                            {t(`options.filters-labels.${filterItem}`)}
                                        </Text>
                                    );
                                })}
                                <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                    {t('options.filters-labels.option')}
                                </Text>
                                {Object.values(OptionFilterEnum).map((filterItem) => {
                                    const isDisabled = isSingleMode;
                                    return filterItem === OptionFilterEnum.All ? null : (
                                        <Text
                                            key={filterItem}
                                            onClick={() =>
                                                !isDisabled
                                                    ? setOptionFilter(
                                                          optionFilter === filterItem
                                                              ? OptionFilterEnum.All
                                                              : filterItem
                                                      )
                                                    : {}
                                            }
                                            className={`${
                                                !isDisabled && optionFilter === filterItem ? 'selected' : ''
                                            } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                            style={{ marginLeft: 20 }}
                                        >
                                            {t(`options.filters-labels.${filterItem}`)}
                                        </Text>
                                    );
                                })}
                            </DropDown>
                        </DropDownWrapper>
                    </CategoryFilters>
                )}
                <TradingModeFilters
                    onClick={!isSingleMode ? setShowDropdownTradingMode.bind(this, !showDropdownTradingMode) : () => {}}
                    filter={t(`options.trading-mode.${tradingModeFilter.toLowerCase()}`)}
                    text={t('options.quick-trading.mode-label')}
                    disabled={isSingleMode}
                >
                    <DropDownWrapper hidden={!showDropdownTradingMode}>
                        <DropDown>
                            {Object.values(TradingModeFilterEnum).map((filterItem) => (
                                <Text
                                    className={`${
                                        filterItem === tradingModeFilter ? 'selected' : ''
                                    } text-s lh32 pale-grey`}
                                    onClick={() => setTradingModeFilter(filterItem)}
                                    key={filterItem}
                                >
                                    {t(`options.trading-mode.${filterItem.toLowerCase()}`)}
                                </Text>
                            ))}
                        </DropDown>
                    </DropDownWrapper>
                </TradingModeFilters>
            </FlexDiv>

            {!isSingleMode && (
                <SortyByMobile
                    onClick={setShowDropdownSort.bind(this, !showDropdownSort)}
                    filter={t(
                        `options.quick-trading.table.${
                            isBuyMode ? mapOrderByToBuyEnum(orderBy) : mapOrderByToSellEnum(orderBy)
                        }`
                    )}
                >
                    <DropDownWrapper className="quick-trading-mobile__sorting-dropdown" hidden={!showDropdownSort}>
                        <DropDown>
                            {Object.values(isBuyMode ? SortByBuyEnum : SortBySellEnum).map((filterItem, index) => (
                                <Text
                                    className={`${
                                        isBuyMode
                                            ? mapOrderByToBuyEnum(orderBy)
                                            : mapOrderByToSellEnum(orderBy) === filterItem
                                            ? 'selected'
                                            : ''
                                    } text-s lh32 pale-grey`}
                                    onClick={() => setOrderBy(index + 2)}
                                    key={filterItem}
                                >
                                    {t(`options.quick-trading.table.${filterItem}`)}
                                </Text>
                            ))}
                        </DropDown>
                    </DropDownWrapper>
                </SortyByMobile>
            )}

            {isLoading && (
                <LoaderContainer>
                    <Container>
                        <SimpleLoader />
                    </Container>
                </LoaderContainer>
            )}
            {orders.length === 0 && !isLoading && (
                <NoOrders>
                    <Container>
                        <Text className="text-m bold pale-grey">{t('options.quick-trading.no-orders-found')}</Text>
                        <Button className="primary" onClick={resetFilters}>
                            {t('options.quick-trading.view-all-orders')}
                        </Button>
                    </Container>
                </NoOrders>
            )}
            {!isLoading && orders.length > 0 && (
                <OrderCardMobile exchangeRates={exchangeRates} orders={orders} isBuyMode={isBuyMode}></OrderCardMobile>
            )}
            {orders.length > 0 && !isLoading && isSingleMode && (
                <ViewAllOrdersContainer>
                    <>
                        <Button className="primary" onClick={resetFilters}>
                            {t('options.quick-trading.view-all-orders')}
                        </Button>
                    </>
                </ViewAllOrdersContainer>
            )}
            <Overlay
                onClick={() => {
                    setShowDropdownTradingMode(false);
                    setShowDropdownSort(false);
                    setShowDropdownUserFilters(false);
                }}
                className={showDropdownTradingMode || showDropdownSort || showDropdownUserFilters ? 'show' : 'hide'}
            ></Overlay>
        </div>
    );
};

export default QuickTradingMobile;

const mapOrderByToBuyEnum = (data: number) => {
    switch (data) {
        case 1:
        case 2:
            return SortByBuyEnum.Condition;
        case 3:
            return SortByBuyEnum.When;
        case 4:
            return SortByBuyEnum.AmountToDeposit;
        case 5:
            return SortByBuyEnum.ReturnIfWin;
        default:
            return SortByBuyEnum.When;
    }
};

const mapOrderByToSellEnum = (data: number) => {
    switch (data) {
        case 1:
        case 2:
            return SortBySellEnum.Condition;
        case 3:
            return SortBySellEnum.When;
        case 4:
            return SortBySellEnum.AmountToReceive;
        case 5:
            return SortBySellEnum.OptionsToSell;
        case 6:
            return SortBySellEnum.OptionsInWallet;
        default:
            return SortBySellEnum.When;
    }
};

const NoOrders = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    position: relative;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    min-height: 355px;
    padding: 2px;
    border-radius: 23px;
    margin: 24px 0;
    margin-bottom: 60px;
`;

const ViewAllOrdersContainer = styled(FlexDivColumn)`
    min-height: 100px;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 60px;
`;

const LoaderContainer = styled(NoOrders)``;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    background: #04045a;
    flex: 1;
    border-radius: 23px;
`;
