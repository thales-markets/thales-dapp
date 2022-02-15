import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import {
    Button,
    FlexDivColumn,
    FlexDivColumnCentered,
    Text,
    Wrapper,
    Background,
    FlexDivCentered,
    FlexDiv,
    FlexDivRowCentered,
    FilterButton,
} from 'theme/common';
import { ExtendedTrade, HistoricalOptionsMarketInfo, OptionSide } from 'types/options';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useBinaryOptionsAllTradesQuery from 'queries/options/useBinaryOptionsAllTradesQuery';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import { getSynthName } from 'utils/currency';
import SearchMarket from '../Home/SearchMarket';
import TradesTable from '../Home/Leaderboard/Trades/TradesTable';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from 'constants/routes';
import myTrades from 'assets/images/filters/my-open-orders.svg';
import { getCoinImage, getOptionImage } from '../QuickTradingCompetition/QuickTradingCompetition';
import UserFilter from '../Home/ExploreMarkets/UserFilters';
import snxJSConnector from 'utils/snxJSConnector';
import TradeHistoryMobile from './TradeHistoryMobile';
import './media.scss';

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

export enum TradeTypeFilterEnum {
    All = 'all',
    Amm = 'amm',
    Orderbook = 'orderbook',
}

export enum TradeFilterEnum {
    All = 'all',
    MyTrades = 'my-trades',
}

export enum CoinFilterEnum {
    All = 'all',
    Bitcoin = 'bitcoin',
    Ethereum = 'ethereum',
    Snx = 'synthetix',
}

export enum OptionFilterEnum {
    All = 'all',
    Long = 'long',
    Short = 'short',
}

const DEFAULT_ORDER_BY = 1;

const TradeHistory: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
    const [assetSearch, setAssetSearch] = useState<string>('');
    const [volume, setVolume] = useState<number>(0);
    const [numberOfTrades, setNumberOfTrades] = useState<number>(0);
    const [tradeFilter, setTradeFilter] = useState<TradeFilterEnum>(TradeFilterEnum.All);
    const [coinFilter, setCoinFilter] = useState<CoinFilterEnum>(CoinFilterEnum.All);
    const [optionFilter, setOptionFilter] = useState<OptionFilterEnum>(OptionFilterEnum.All);
    const [tradeTypeFilter, setTradeTypeFilter] = useState<TradeTypeFilterEnum>(TradeTypeFilterEnum.All);

    const tradesQuery = useBinaryOptionsAllTradesQuery(networkId, {
        enabled: isAppReady,
    });
    const trades: ExtendedTrade[] = tradesQuery.isSuccess && tradesQuery.data ? tradesQuery.data : [];

    const filteredTrades = useMemo(() => {
        let filteredTrades = trades;
        switch (tradeFilter) {
            case TradeFilterEnum.MyTrades:
                filteredTrades = filteredTrades.filter(
                    (trade: ExtendedTrade) =>
                        trade.maker.toLowerCase() === walletAddress.toLowerCase() ||
                        trade.taker.toLowerCase() === walletAddress.toLowerCase()
                );
                break;
        }
        switch (coinFilter) {
            case CoinFilterEnum.Bitcoin:
                filteredTrades = filteredTrades.filter(
                    (trade: ExtendedTrade) =>
                        trade.marketItem.currencyKey === SYNTHS_MAP.sBTC ||
                        trade.marketItem.currencyKey === CRYPTO_CURRENCY_MAP.BTC
                );
                break;
            case CoinFilterEnum.Ethereum:
                filteredTrades = filteredTrades.filter(
                    (trade: ExtendedTrade) =>
                        trade.marketItem.currencyKey === SYNTHS_MAP.sETH ||
                        trade.marketItem.currencyKey === CRYPTO_CURRENCY_MAP.ETH
                );
                break;
            case CoinFilterEnum.Snx:
                filteredTrades = filteredTrades.filter(
                    (trade: ExtendedTrade) => trade.marketItem.currencyKey === CRYPTO_CURRENCY_MAP.SNX
                );
                break;
        }
        switch (optionFilter) {
            case OptionFilterEnum.Long:
                filteredTrades = filteredTrades.filter((trade: ExtendedTrade) => trade.optionSide === 'long');
                break;
            case OptionFilterEnum.Short:
                filteredTrades = filteredTrades.filter((trade: ExtendedTrade) => trade.optionSide === 'short');
                break;
        }
        const { ammContract } = snxJSConnector;
        const ammContractAddress = ammContract ? ammContract.address : '';
        switch (tradeTypeFilter) {
            case TradeTypeFilterEnum.Amm:
                filteredTrades = filteredTrades.filter(
                    (trade: ExtendedTrade) => trade.maker.toLowerCase() === ammContractAddress.toLowerCase()
                );
                break;
            case TradeTypeFilterEnum.Orderbook:
                filteredTrades = filteredTrades.filter(
                    (trade: ExtendedTrade) => trade.maker.toLowerCase() !== ammContractAddress.toLowerCase()
                );
                break;
        }

        return filteredTrades.sort((a, b) => {
            switch (orderBy) {
                case 1:
                    return sortByField(a, b, orderDirection, 'timestamp');
                case 2:
                    return sortByMarketHeading(a, b, orderDirection);
                case 3:
                    return sortByField(a, b, orderDirection, 'optionSide');
                case 4:
                    return sortByField(a, b, orderDirection, 'orderSide');
                case 5:
                    return sortByAmount(a, b, orderDirection);
                case 6:
                    return sortByPrice(a, b, orderDirection);
                default:
                    return 0;
            }
        });
    }, [trades, orderBy, orderDirection, coinFilter, optionFilter, tradeTypeFilter, tradeFilter]);

    const searchFilteredTrades = useDebouncedMemo(
        () => {
            return assetSearch
                ? filteredTrades.filter((trade: ExtendedTrade) => {
                      return (
                          trade.marketItem.asset.toLowerCase().includes(assetSearch.toLowerCase()) ||
                          getSynthName(trade.marketItem.currencyKey)
                              ?.toLowerCase()
                              .includes(assetSearch.toLowerCase()) ||
                          trade.marketItem.country?.toLowerCase().includes(assetSearch.toLowerCase()) ||
                          trade.marketItem.eventName?.toLowerCase().includes(assetSearch.toLowerCase())
                      );
                  })
                : filteredTrades;
        },
        [filteredTrades, assetSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    useEffect(() => {
        setVolume(
            searchFilteredTrades.reduce(
                (acc, trade) => acc + (trade.orderSide === 'buy' ? trade.takerAmount : trade.makerAmount),
                0
            )
        );
        setNumberOfTrades(searchFilteredTrades.length);
    }, [searchFilteredTrades]);

    const resetFilters = () => {
        setTradeFilter(TradeFilterEnum.All);
        setCoinFilter(CoinFilterEnum.All);
        setOptionFilter(OptionFilterEnum.All);
        setTradeTypeFilter(TradeTypeFilterEnum.All);
        setAssetSearch('');
    };

    return (
        <Background>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.TradeHistory} />
                <Title style={{ alignSelf: 'flex-start' }}>{t('common.sidebar.trade-history-label')}</Title>
                <TradeHistoryMobile
                    tradeTypeFilter={tradeTypeFilter}
                    tradeFilter={tradeFilter}
                    coinFilter={coinFilter}
                    optionFilter={optionFilter}
                    setTradeTypeFilter={setTradeTypeFilter}
                    setTradeFilter={setTradeFilter}
                    setCoinFilter={setCoinFilter}
                    setOptionFilter={setOptionFilter}
                    assetSearch={assetSearch}
                    setAssetSearch={setAssetSearch}
                    trades={assetSearch ? searchFilteredTrades : filteredTrades}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    isLoading={tradesQuery.isLoading}
                    resetFilters={resetFilters}
                    volume={volume}
                    numberOfTrades={numberOfTrades}
                />

                <FlexDivColumnCentered id="trade-history" className="trade-history-desktop" style={{ width: '100%' }}>
                    <FlexDivCentered style={{ flexFlow: 'wrap' }}>
                        {Object.values(TradeFilterEnum).map((filterItem) => {
                            return filterItem === TradeFilterEnum.All ? null : (
                                <UserFilter
                                    className={isWalletConnected && tradeFilter === filterItem ? 'selected' : ''}
                                    disabled={!isWalletConnected}
                                    onClick={() =>
                                        isWalletConnected
                                            ? setTradeFilter(
                                                  tradeFilter === filterItem ? TradeFilterEnum.All : filterItem
                                              )
                                            : {}
                                    }
                                    key={filterItem}
                                    img={getTradeImage(filterItem)}
                                    text={t(`options.filters-labels.${filterItem}`)}
                                />
                            );
                        })}
                        {Object.values(CoinFilterEnum).map((filterItem) => {
                            return filterItem === CoinFilterEnum.All ? null : (
                                <UserFilter
                                    className={coinFilter === filterItem ? 'selected' : ''}
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
                                    onClick={() =>
                                        setOptionFilter(filterItem === optionFilter ? OptionFilterEnum.All : filterItem)
                                    }
                                    key={filterItem}
                                    img={getOptionImage(filterItem)}
                                    text={t(`options.filters-labels.${filterItem}`)}
                                />
                            );
                        })}
                    </FlexDivCentered>
                    <InfoContainer>
                        <Info>
                            {`${t('options.leaderboard.trades.number-of-trades')}: ${
                                tradesQuery.isLoading ? '-' : numberOfTrades
                            }`}
                        </Info>
                        <Info>
                            {`${t('options.leaderboard.trades.volume')}: ${
                                tradesQuery.isLoading ? '-' : formatCurrencyWithSign(USD_SIGN, volume)
                            }`}
                        </Info>
                    </InfoContainer>
                    <FlexDiv
                        className="table-filters"
                        style={{
                            justifyContent: 'space-between',
                            background: '#04045a',
                            borderTopLeftRadius: '23px',
                            borderTopRightRadius: '23px',
                            width: '100%',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 12 }}>
                            <FlexDivRowCentered>
                                {Object.values(TradeTypeFilterEnum).map((filterItem) => (
                                    <FilterButton
                                        className={tradeTypeFilter === filterItem ? 'selected' : ''}
                                        onClick={() => setTradeTypeFilter(filterItem)}
                                        key={filterItem}
                                    >
                                        {t(`options.filters-labels.${filterItem.toLowerCase()}`).toUpperCase()}
                                    </FilterButton>
                                ))}
                            </FlexDivRowCentered>
                        </div>
                        <SearchMarket assetSearch={assetSearch} setAssetSearch={setAssetSearch} />
                    </FlexDiv>
                    <TradesTable
                        trades={assetSearch ? searchFilteredTrades : filteredTrades}
                        isLoading={tradesQuery.isLoading}
                        orderBy={orderBy}
                        orderDirection={orderDirection}
                        setOrderBy={setOrderBy}
                        setOrderDirection={setOrderDirection}
                        hideBorderRadius
                        deps={[orderBy, orderDirection, tradeTypeFilter, tradeFilter, coinFilter, optionFilter]}
                    >
                        <NoTrades>
                            <>
                                <Text className="text-l bold pale-grey">
                                    {t('options.leaderboard.trades.no-trades-found')}
                                </Text>
                                <Button className="primary" onClick={resetFilters}>
                                    {t('options.leaderboard.trades.view-all-trades')}
                                </Button>
                            </>
                        </NoTrades>
                    </TradesTable>
                </FlexDivColumnCentered>
            </Wrapper>
        </Background>
    );
};

export const marketHeading = (optionsMarket: HistoricalOptionsMarketInfo, optionSide: OptionSide) => {
    const orderbookSign = optionsMarket.customMarket
        ? optionSide === 'long'
            ? optionsMarket.eventName === 'XYZ airdrop claims' ||
              optionsMarket.eventName === 'ETH burned count' ||
              optionsMarket.eventName === 'Flippening Markets' ||
              optionsMarket.eventName === 'ETH/BTC market cap ratio'
                ? '>='
                : '=='
            : optionsMarket.eventName === 'XYZ airdrop claims' ||
              optionsMarket.eventName === 'ETH burned count' ||
              optionsMarket.eventName === 'Flippening Markets' ||
              optionsMarket.eventName === 'ETH/BTC market cap ratio'
            ? '<'
            : '!='
        : optionSide === 'long'
        ? '>'
        : '<';

    return optionsMarket.customMarket
        ? `${optionsMarket.country} ${orderbookSign} ${formatCurrency(
              optionsMarket.outcome || 0,
              optionsMarket.eventName === 'Flippening Markets' || optionsMarket.eventName === 'ETH/BTC market cap ratio'
                  ? 2
                  : 0
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`
        : `${getSynthName(optionsMarket.currencyKey)} ${orderbookSign} ${formatCurrencyWithSign(
              USD_SIGN,
              optionsMarket.strikePrice
          )} @ ${formatShortDate(optionsMarket.maturityDate)}`;
};

const sortByMarketHeading = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection) => {
    const aMarket = marketHeading(a.marketItem, a.optionSide);
    const bMarket = marketHeading(b.marketItem, b.optionSide);
    if (direction === OrderDirection.ASC) {
        return aMarket < bMarket ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aMarket < bMarket ? 1 : -1;
    }

    return 0;
};

const sortByField = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection, field: keyof ExtendedTrade) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const sortByAmount = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection) => {
    const aAmount = a.orderSide === 'buy' ? a.makerAmount : a.takerAmount;
    const bAmount = b.orderSide === 'buy' ? b.makerAmount : b.takerAmount;
    if (direction === OrderDirection.ASC) {
        return aAmount < bAmount ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aAmount < bAmount ? 1 : -1;
    }

    return 0;
};

const sortByPrice = (a: ExtendedTrade, b: ExtendedTrade, direction: OrderDirection) => {
    const aPrice = a.orderSide === 'buy' ? a.takerAmount / a.makerAmount : a.makerAmount / a.takerAmount;
    const bPrice = b.orderSide === 'buy' ? b.takerAmount / b.makerAmount : b.makerAmount / b.takerAmount;
    if (direction === OrderDirection.ASC) {
        return aPrice < bPrice ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aPrice < bPrice ? 1 : -1;
    }

    return 0;
};

export const getTradeImage = (filter: TradeFilterEnum) => {
    switch (filter) {
        case TradeFilterEnum.MyTrades:
            return myTrades;
    }
};

const Title = styled.p`
    font-weight: bold;
    line-height: 64px;
    letter-spacing: -1px;
    font-size: 39px;
    padding-bottom: 30px;
    color: #f6f6fe;
    @media (max-width: 1024px) {
        font-size: 31px;
        padding-top: 30px;
        padding-bottom: 0;
    }
`;

const NoTrades = styled(FlexDivColumn)`
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    .primary {
        align-self: center;
    }
    border-radius: 0 0 23px 23px;
`;

const InfoContainer = styled.div`
    margin-left: 22px;
    margin-bottom: 20px;
    margin-top: 40px;
`;

const Info = styled.span`
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: #f6f6fe;
    &:first-child {
        margin-right: 50px;
    }
`;

export default TradeHistory;
