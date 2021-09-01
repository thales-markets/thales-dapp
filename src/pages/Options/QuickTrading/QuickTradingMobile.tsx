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
import { PhaseFilters } from '../Home/ExploreMarkets/Mobile/PhaseFilters';
import { SortyByMobile } from '../Home/ExploreMarkets/Mobile/SortByMobile';
import OrderCardMobile from '../Home/ExploreMarkets/Mobile/OrderCardMobile';
import { ExtendedOrders } from 'types/options';

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
};

export enum SortByEnum {
    Asset = 'Asset',
    Asset_Price = 'Asset Price',
    Strike_Price = 'Strike Price',
    Pool_Size = 'Pool Size',
    Time_Remaining = 'Time Remaining',
    Open_Orders = 'Open Orders',
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
}) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const { t } = useTranslation();
    const [showDropdownPhase, setShowDropwodnPhase] = useState(false);
    const [showDropdownUserFilters, setShowDropwodnUserFilters] = useState(false);
    const [showDropdownSort, setShowDropwodnSort] = useState(false);

    // const onClickUserFilter = (filter: PrimaryFilters, isDisabled: boolean) => {
    //     const userFilterValue = queryString.parse(searchFilter.search).userFilter;
    //     if (!isDisabled && userFilterValue !== filter) {
    //         history.replace({
    //             pathname: searchFilter.pathname,
    //             search: queryString.stringify({ userFilter: [filter] }),
    //         });
    //     } else if (userFilterValue === filter && userFilter !== PrimaryFilters.All) {
    //         history.replace({
    //             pathname: searchFilter.pathname,
    //             search: '',
    //         });
    //     }

    //     if (!isDisabled && secondLevelUserFilter !== SecondaryFilters.All && filter !== PrimaryFilters.All) {
    //         setSecondLevelUserFilter(SecondaryFilters.All);
    //     }

    //     if (!isDisabled) {
    //         setUserFilter(userFilter === filter ? PrimaryFilters.All : filter);
    //     }

    //     document.getElementsByClassName('markets-mobile')[0]?.scrollIntoView({ behavior: 'smooth' });
    //     return;
    // };

    // const onClickSecondLevelUserFilter = (filter: SecondaryFilters, isDisabled: boolean) => {
    //     const userFilterValue = queryString.parse(searchFilter.search).userFilter;
    //     const secondLevelFilterValue = queryString.parse(searchFilter.search).userFilter2;

    //     if (!isDisabled && secondLevelFilterValue !== filter && userFilter) {
    //         history.replace({
    //             pathname: searchFilter.pathname,
    //             search: queryString.stringify({
    //                 userFilter: [userFilterValue],
    //                 userFilter2: [filter],
    //             }),
    //         });
    //     } else if (userFilter && secondLevelFilterValue === filter && secondLevelUserFilter !== SecondaryFilters.All) {
    //         history.replace({
    //             pathname: searchFilter.pathname,
    //             search: queryString.stringify({
    //                 userFilter: [userFilterValue],
    //             }),
    //         });
    //     } else if (!isDisabled && !userFilter && secondLevelFilterValue !== filter) {
    //         history.replace({
    //             pathname: searchFilter.pathname,
    //             search: queryString.stringify({
    //                 userFilter2: [filter],
    //             }),
    //         });
    //     }

    //     if (!isDisabled) {
    //         setSecondLevelUserFilter(secondLevelUserFilter === filter ? SecondaryFilters.All : filter);
    //     }

    //     document.getElementsByClassName('markets-mobile')[0]?.scrollIntoView({ behavior: 'smooth' });
    //     return;
    // };

    const resetFilters = () => {
        setOrderFilter(OrderFilterEnum.All);
        setCoinFilter(CoinFilterEnum.All);
        setOptionFilter(OptionFilterEnum.All);
        setAssetSearch('');
    };

    return (
        <div className="quick-trading-mobile">
            <SearchMarket
                className="quick-trading-mobile__search"
                assetSearch={assetSearch}
                setAssetSearch={setAssetSearch}
            />
            <FlexDiv className="quick-trading-mobile__filters">
                <CategoryFilters
                    onClick={setShowDropwodnUserFilters.bind(this, !showDropdownUserFilters)}
                    filter={orderFilter}
                >
                    <DropDownWrapper hidden={!showDropdownUserFilters}>
                        <DropDown>
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                Category
                            </Text>
                            {Object.keys(OrderFilterEnum).map((filterItem) => {
                                const isDisabled = !isWalletConnected || isSingleMode;
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
                                        {filterItem}
                                    </Text>
                                );
                            })}
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                Discover
                            </Text>
                            {Object.keys(CoinFilterEnum).map((filterItem) => {
                                const isDisabled = isSingleMode;
                                return (
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
                                        {filterItem}
                                    </Text>
                                );
                            })}
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                Option
                            </Text>
                            {Object.keys(OptionFilterEnum).map((filterItem) => {
                                const isDisabled = isSingleMode;
                                return (
                                    <Text
                                        key={filterItem}
                                        onClick={() =>
                                            !isDisabled
                                                ? setOptionFilter(
                                                      optionFilter === filterItem ? OptionFilterEnum.All : filterItem
                                                  )
                                                : {}
                                        }
                                        className={`${
                                            !isDisabled && optionFilter === filterItem ? 'selected' : ''
                                        } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                        style={{ marginLeft: 20 }}
                                    >
                                        {filterItem}
                                    </Text>
                                );
                            })}
                        </DropDown>
                    </DropDownWrapper>
                </CategoryFilters>
                <PhaseFilters onClick={setShowDropwodnPhase.bind(this, !showDropdownPhase)} filter={tradingModeFilter}>
                    <DropDownWrapper hidden={!showDropdownPhase}>
                        <DropDown>
                            {Object.values(TradingModeFilterEnum).map((filterItem) => (
                                <Text
                                    className={`${
                                        filterItem === tradingModeFilter ? 'selected' : ''
                                    } text-s lh32 pale-grey capitalize`}
                                    onClick={() => setTradingModeFilter(filterItem)}
                                    key={filterItem}
                                >
                                    {t(`options.phases.${filterItem}`)}
                                </Text>
                            ))}
                        </DropDown>
                    </DropDownWrapper>
                </PhaseFilters>
            </FlexDiv>

            <SortyByMobile
                onClick={setShowDropwodnSort.bind(this, !showDropdownSort)}
                filter={mapOrderByToEnum(orderBy)}
            >
                <DropDownWrapper className="quick-trading-mobile__sorting-dropdown" hidden={!showDropdownSort}>
                    <DropDown>
                        {Object.keys(SortByEnum)
                            .filter((key) => isNaN(Number(SortByEnum[key as keyof typeof SortByEnum])))
                            .map((key, index) => (
                                <Text
                                    className={`${
                                        mapOrderByToEnum(orderBy) === SortByEnum[key as keyof typeof SortByEnum]
                                            ? 'selected'
                                            : ''
                                    } text-s lh32 pale-grey capitalize`}
                                    onClick={() => setOrderBy(index + 2)}
                                    key={key}
                                >
                                    {SortByEnum[key as keyof typeof SortByEnum]}
                                </Text>
                            ))}
                    </DropDown>
                </DropDownWrapper>
            </SortyByMobile>

            {orders.length > 0 ? (
                <OrderCardMobile exchangeRates={exchangeRates} orders={orders}></OrderCardMobile>
            ) : (
                <NoOrders>
                    <Container>
                        <Text className="text-l bold pale-grey">{t('options.quick-trading.no-orders-found')}</Text>
                        <Button className="primary" onClick={resetFilters}>
                            {t('options.quick-trading.view-all-orders')}
                        </Button>
                    </Container>
                </NoOrders>
            )}
            <Overlay
                onClick={() => {
                    setShowDropwodnPhase(false);
                    setShowDropwodnSort(false);
                    setShowDropwodnUserFilters(false);
                }}
                className={showDropdownPhase || showDropdownSort || showDropdownUserFilters ? 'show' : 'hide'}
            ></Overlay>
        </div>
    );
};

export default QuickTradingMobile;

const mapOrderByToEnum = (data: number) => {
    switch (data) {
        case 1:
        case 2:
            return SortByEnum.Asset;
        case 3:
            return SortByEnum.Asset_Price;
        case 4:
            return SortByEnum.Strike_Price;
        case 5:
            return SortByEnum.Pool_Size;
        case 6:
            return SortByEnum.Time_Remaining;
        case 7:
            return SortByEnum.Open_Orders;
        default:
            return SortByEnum.Time_Remaining;
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
    margin-bottom: 600px;
`;

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
