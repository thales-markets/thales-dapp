import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { Button, FlexDiv, FlexDivColumn, FlexDivColumnCentered, Text } from 'theme/common';
import styled from 'styled-components';
import { Overlay } from 'components/Header/Header';
import { TradeTypeFilterEnum, TradeFilterEnum, CoinFilterEnum, OptionFilterEnum } from './TradeHistory';
import SearchMarket from '../Home/SearchMarket';
import { CategoryFilters, DropDown, DropDownWrapper } from '../Home/ExploreMarkets/Mobile/CategoryFilters';
import { TradingModeFilters } from '../Home/ExploreMarkets/Mobile/TradingModeFilters';
import { SortyByMobile } from '../Home/ExploreMarkets/Mobile/SortByMobile';
import { ExtendedTrades } from 'types/options';
import SimpleLoader from 'components/SimpleLoader';
import TradeCardMobile from '../Home/ExploreMarkets/Mobile/TradeCardMobile';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';

type TradeHistoryMobileProps = {
    trades: ExtendedTrades;
    tradeTypeFilter: TradeTypeFilterEnum;
    tradeFilter: TradeFilterEnum;
    coinFilter: CoinFilterEnum;
    optionFilter: OptionFilterEnum;
    setTradeTypeFilter: (data: any) => void;
    setTradeFilter: (data: any) => void;
    setCoinFilter: (data: any) => void;
    setOptionFilter: (data: any) => void;
    assetSearch: any;
    setAssetSearch: (data: any) => void;
    orderBy: number;
    setOrderBy: (data: any) => void;
    isLoading: boolean;
    resetFilters: any;
    volume: number;
    numberOfTrades: number;
};

export enum SortByEnum {
    DateTime = 'date-time-col',
    Market = 'market-col',
    Asset = 'asset-col',
    Type = 'type-col',
    Amount = 'amount-col',
    Price = 'price-col',
}

const TradeHistoryMobile: React.FC<TradeHistoryMobileProps> = ({
    trades,
    tradeTypeFilter,
    tradeFilter,
    coinFilter,
    optionFilter,
    setTradeTypeFilter,
    setTradeFilter,
    setCoinFilter,
    setOptionFilter,
    assetSearch,
    setAssetSearch,
    orderBy,
    setOrderBy,
    isLoading,
    resetFilters,
    volume,
    numberOfTrades,
}) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const { t } = useTranslation();
    const [showDropdownTradeTypes, setShowDropdownTradeTypes] = useState(false);
    const [showDropdownUserFilters, setShowDropdownUserFilters] = useState(false);
    const [showDropdownSort, setShowDropdownSort] = useState(false);

    const getCategoryFilter = () => {
        if (
            coinFilter === CoinFilterEnum.All &&
            optionFilter === OptionFilterEnum.All &&
            tradeFilter === TradeFilterEnum.All
        ) {
            return t(`options.filters-labels.${tradeFilter}`);
        }
        let categoryFilter = '';
        if (tradeFilter !== TradeFilterEnum.All) {
            categoryFilter = `${categoryFilter}, ${t(`options.filters-labels.${tradeFilter}`)}`;
        }
        if (coinFilter !== CoinFilterEnum.All) {
            categoryFilter = `${categoryFilter}, ${t(`options.filters-labels.${coinFilter}`)}`;
        }
        if (optionFilter !== OptionFilterEnum.All) {
            categoryFilter = `${categoryFilter}, ${t(`options.filters-labels.${optionFilter}`)}`;
        }
        return categoryFilter.substring(1);
    };

    return (
        <div className="trade-history-mobile">
            <SearchMarket
                className="trade-history-mobile__search"
                assetSearch={assetSearch}
                setAssetSearch={setAssetSearch}
            />
            <FlexDiv className="trade-history-mobile__filters">
                <CategoryFilters
                    onClick={setShowDropdownUserFilters.bind(this, !showDropdownUserFilters)}
                    filter={getCategoryFilter()}
                >
                    <DropDownWrapper hidden={!showDropdownUserFilters}>
                        <DropDown>
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                {t('options.filters-labels.category')}
                            </Text>
                            {Object.values(TradeFilterEnum).map((filterItem) => {
                                const isDisabled = !isWalletConnected && filterItem !== TradeFilterEnum.All;
                                return (
                                    <Text
                                        key={filterItem}
                                        onClick={() =>
                                            !isDisabled
                                                ? setTradeFilter(
                                                      tradeFilter === filterItem ? TradeFilterEnum.All : filterItem
                                                  )
                                                : {}
                                        }
                                        className={`${
                                            !isDisabled && tradeFilter === filterItem ? 'selected' : ''
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
                                return filterItem === CoinFilterEnum.All ? null : (
                                    <Text
                                        key={filterItem}
                                        onClick={() =>
                                            setCoinFilter(coinFilter === filterItem ? CoinFilterEnum.All : filterItem)
                                        }
                                        className={`${
                                            coinFilter === filterItem ? 'selected' : ''
                                        } text-s lh32 pale-grey`}
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
                                return filterItem === OptionFilterEnum.All ? null : (
                                    <Text
                                        key={filterItem}
                                        onClick={() =>
                                            setOptionFilter(
                                                optionFilter === filterItem ? OptionFilterEnum.All : filterItem
                                            )
                                        }
                                        className={`${
                                            optionFilter === filterItem ? 'selected' : ''
                                        } text-s lh32 pale-grey`}
                                        style={{ marginLeft: 20 }}
                                    >
                                        {t(`options.filters-labels.${filterItem}`)}
                                    </Text>
                                );
                            })}
                        </DropDown>
                    </DropDownWrapper>
                </CategoryFilters>
                <TradingModeFilters
                    onClick={setShowDropdownTradeTypes.bind(this, !showDropdownTradeTypes)}
                    filter={t(`options.filters-labels.${tradeTypeFilter.toLowerCase()}`)}
                    text={t('options.filters-labels.trade-type')}
                >
                    <DropDownWrapper hidden={!showDropdownTradeTypes}>
                        <DropDown>
                            {Object.values(TradeTypeFilterEnum).map((filterItem) => (
                                <Text
                                    className={`${
                                        filterItem === tradeTypeFilter ? 'selected' : ''
                                    } text-s lh32 pale-grey`}
                                    onClick={() => setTradeTypeFilter(filterItem)}
                                    key={filterItem}
                                >
                                    {t(`options.filters-labels.${filterItem.toLowerCase()}`)}
                                </Text>
                            ))}
                        </DropDown>
                    </DropDownWrapper>
                </TradingModeFilters>
            </FlexDiv>

            <SortyByMobile
                onClick={setShowDropdownSort.bind(this, !showDropdownSort)}
                filter={t(`options.leaderboard.trades.table.${mapOrderByToEnum(orderBy)}`)}
            >
                <DropDownWrapper className="trade-history-mobile__sorting-dropdown" hidden={!showDropdownSort}>
                    <DropDown>
                        {Object.values(SortByEnum).map((filterItem, index) => (
                            <Text
                                className={`${
                                    mapOrderByToEnum(orderBy) === filterItem ? 'selected' : ''
                                } text-s lh32 pale-grey`}
                                onClick={() => setOrderBy(index + 1)}
                                key={filterItem}
                            >
                                {t(`options.leaderboard.trades.table.${filterItem}`)}
                            </Text>
                        ))}
                    </DropDown>
                </DropDownWrapper>
            </SortyByMobile>

            <InfoContainer>
                <Info>
                    {`${t('options.leaderboard.trades.number-of-trades')}: ${isLoading ? '-' : numberOfTrades}`}
                </Info>
                <Info>
                    {`${t('options.leaderboard.trades.volume')}: ${
                        isLoading ? '-' : formatCurrencyWithSign(USD_SIGN, volume)
                    }`}
                </Info>
            </InfoContainer>
            {isLoading && (
                <LoaderContainer>
                    <Container>
                        <SimpleLoader />
                    </Container>
                </LoaderContainer>
            )}
            {trades.length === 0 && !isLoading && (
                <NoTrades>
                    <Container>
                        <Text className="text-m bold pale-grey">{t('options.leaderboard.trades.no-trades-found')}</Text>
                        <Button className="primary" onClick={resetFilters}>
                            {t('options.leaderboard.trades.view-all-trades')}
                        </Button>
                    </Container>
                </NoTrades>
            )}
            {!isLoading && trades.length > 0 && <TradeCardMobile trades={trades}></TradeCardMobile>}
            <Overlay
                onClick={() => {
                    setShowDropdownTradeTypes(false);
                    setShowDropdownSort(false);
                    setShowDropdownUserFilters(false);
                }}
                className={showDropdownTradeTypes || showDropdownSort || showDropdownUserFilters ? 'show' : 'hide'}
            ></Overlay>
        </div>
    );
};

const mapOrderByToEnum = (data: number) => {
    switch (data) {
        case 1:
            return SortByEnum.DateTime;
        case 2:
            return SortByEnum.Market;
        case 3:
            return SortByEnum.Asset;
        case 4:
            return SortByEnum.Type;
        case 5:
            return SortByEnum.Amount;
        case 6:
            return SortByEnum.Price;
        default:
            return SortByEnum.DateTime;
    }
};

const NoTrades = styled(FlexDivColumn)`
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

const LoaderContainer = styled(NoTrades)``;

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

const InfoContainer = styled(FlexDivColumnCentered)`
    margin-top: 30px;
    text-align: center;
`;

const Info = styled.span`
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    color: #f6f6fe;
`;

export default TradeHistoryMobile;
