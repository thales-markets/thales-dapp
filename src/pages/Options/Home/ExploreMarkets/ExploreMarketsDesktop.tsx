import bitcoin from 'assets/images/filters/bitcoin.svg';
import ethereum from 'assets/images/filters/ethereum.svg';
import myAssets from 'assets/images/filters/my-assets.svg';
import myMarkets from 'assets/images/filters/my-markets.svg';
import myOpenOrders from 'assets/images/filters/my-open-orders.svg';
import myWatchlist from 'assets/images/filters/my-watchlist.svg';
import olympicsImg from 'assets/images/filters/olympics.svg';
import recentlyAdded from 'assets/images/filters/recently-added.svg';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import ROUTES from 'constants/routes';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import useUserWatchlistedMarketsQuery from 'queries/watchlist/useUserWatchlistedMarketsQuery';
import queryString from 'query-string';
import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button, FilterButton, FlexDiv, FlexDivCentered, FlexDivColumn, Text } from 'theme/common';
import { HistoricalOptionsMarketInfo, OptionsMarkets, Trade } from 'types/options';
import onboardConnector from 'utils/onboardConnector';
import { history, navigateTo } from 'utils/routes';
import snxJSConnector, { getSynthName } from 'utils/snxJSConnector';
import { SYNTHS_MAP } from '../../../../constants/currency';
import { Rates } from '../../../../queries/rates/useExchangeRatesQuery';
import useAssetsBalanceQuery from '../../../../queries/user/useUserAssetsBalanceQuery';
import useUserOrdersQuery from '../../../../queries/user/useUserOrdersQuery';
import MarketsTable from '../MarketsTable';
import SearchMarket from '../SearchMarket';
import { ExploreMarketsMobile } from './ExploreMarketsMobile';
import './media.scss';
import UserFilter from './UserFilters';

type ExploreMarketsProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
};

export enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

export enum PhaseFilterEnum {
    trading = 'trading',
    maturity = 'maturity',
    expiry = 'expiry',
    all = 'all',
}

export enum PrimaryFilters {
    All = 'All',
    MyMarkets = 'My Markets',
    MyOrders = 'My Orders',
    MyAssets = 'My Assets',
    MyWatchlist = 'Watchlist',
    Recent = 'Recently Added',
}

export enum SecondaryFilters {
    All = 'All',
    Bitcoin = 'Bitcoin',
    Ethereum = 'Ethereum',
    Olympics = 'Olympics',
}

const isOrderInMarket = (order: Trade, market: HistoricalOptionsMarketInfo): boolean => {
    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const isBuy: boolean = order.makerToken.toLowerCase() === SynthsUSD.address.toLowerCase();
    return (
        (isBuy &&
            (market.longAddress.toLowerCase() === order.takerToken.toLowerCase() ||
                market.shortAddress.toLowerCase() === order.takerToken.toLowerCase())) ||
        (!isBuy &&
            (market.longAddress.toLowerCase() === order.makerToken.toLowerCase() ||
                market.shortAddress.toLowerCase() === order.makerToken.toLowerCase()))
    );
};

const defaultOrderBy = 5; // time remaining

const ExploreMarketsDesktop: React.FC<ExploreMarketsProps> = ({ optionsMarkets, exchangeRates }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const { t } = useTranslation();
    const [phaseFilter, setPhaseFilter] = useState<PhaseFilterEnum>(PhaseFilterEnum.trading);
    const [userFilter, setUserFilter] = useState<PrimaryFilters>(PrimaryFilters.All);
    const [secondLevelUserFilter, setSecondLevelUserFilter] = useState<SecondaryFilters>(SecondaryFilters.All);
    const [assetSearch, setAssetSearch] = useState<string>('');
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
    const searchFilter = useLocation();

    const userAssetsQuery = useAssetsBalanceQuery(networkId, optionsMarkets, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const userOrdersQuery = useUserOrdersQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const watchlistedMarketsQuery = useUserWatchlistedMarketsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const userAssets = userAssetsQuery.isSuccess && Array.isArray(userAssetsQuery.data) ? userAssetsQuery.data : [];
    const userOrders =
        userOrdersQuery.isSuccess && Array.isArray(userOrdersQuery.data?.records) ? userOrdersQuery.data.records : [];
    const watchlistedMarkets = watchlistedMarketsQuery.data ? watchlistedMarketsQuery.data.data : [];

    useEffect(() => {
        const tradingMarkets = filteredOptionsMarkets.filter((market) => {
            return market.phase === PhaseFilterEnum.trading;
        });

        if (tradingMarkets.length === 0 && phaseFilter !== PhaseFilterEnum.maturity) {
            setPhaseFilter(PhaseFilterEnum.maturity);
        }
    }, [userFilter]);

    useEffect(() => {
        const tradingMarkets = secondLevelFilteredOptionsMarket.filter((market) => {
            return market.phase === PhaseFilterEnum.trading;
        });

        if (tradingMarkets.length === 0 && phaseFilter !== PhaseFilterEnum.maturity) {
            setPhaseFilter(PhaseFilterEnum.maturity);
        }
    }, [secondLevelUserFilter]);

    const filteredOptionsMarkets = useMemo(() => {
        let filteredMarkets = optionsMarkets;
        switch (userFilter) {
            case PrimaryFilters.MyMarkets:
                filteredMarkets = filteredMarkets.filter(
                    ({ creator }) => creator.toLowerCase() === walletAddress.toLowerCase()
                );
                break;
            case PrimaryFilters.MyWatchlist:
                filteredMarkets = filteredMarkets.filter(({ address }) => watchlistedMarkets?.includes(address));
                break;
            case PrimaryFilters.MyAssets:
                filteredMarkets = userAssets.reduce((acc: HistoricalOptionsMarketInfo[], { market, balances }) => {
                    if (balances.long || balances.short) {
                        acc.push(market);
                    }
                    return acc;
                }, []);
                break;
            case PrimaryFilters.MyOrders:
                filteredMarkets = filteredMarkets.filter((market) =>
                    userOrders.find((order) => isOrderInMarket(order.order, market))
                );
                break;
            case PrimaryFilters.Recent:
                filteredMarkets = filteredMarkets.filter(({ timestamp }) =>
                    isRecentlyAdded(new Date(), new Date(timestamp))
                );
                break;
        }

        if (phaseFilter !== PhaseFilterEnum.all) {
            filteredMarkets = filteredMarkets.filter((market) => {
                return market.phase === phaseFilter;
            });
        }

        const userFilterParamValue = queryString.parse(searchFilter.search).userFilter;
        const secondLevelUserFilterParamValue = queryString.parse(searchFilter.search).userFilter2;

        if (userFilterParamValue && userFilter === PrimaryFilters.All) {
            Object.keys(PrimaryFilters).forEach((key) => {
                if (PrimaryFilters[key as keyof typeof PrimaryFilters] === userFilterParamValue)
                    setUserFilter(userFilterParamValue);
            });
        }

        if (!secondLevelUserFilterParamValue && secondLevelUserFilter !== SecondaryFilters.All) {
            setSecondLevelUserFilter(SecondaryFilters.All);
        } else if (secondLevelUserFilterParamValue && secondLevelUserFilter === SecondaryFilters.All) {
            Object.keys(SecondaryFilters).forEach((key) => {
                if (SecondaryFilters[key as keyof typeof SecondaryFilters] === secondLevelUserFilterParamValue)
                    setSecondLevelUserFilter(secondLevelUserFilterParamValue);
            });
        }

        return filteredMarkets.sort((a, b) => {
            switch (orderBy) {
                case 1:
                case 2:
                    return sortByField(a, b, orderDirection, 'asset');
                case 3:
                    return sortByAssetPrice(a, b, orderDirection, exchangeRates);
                case 4:
                    return sortByField(a, b, orderDirection, 'strikePrice');
                case 5:
                    return sortByField(a, b, orderDirection, 'poolSize');
                case 6:
                    return sortByTime(a, b, orderDirection);
                case 7:
                    return orderDirection === OrderDirection.ASC
                        ? a.openOrders - b.openOrders
                        : b.openOrders - a.openOrders;
                default:
                    return 0;
            }
        });
    }, [
        optionsMarkets,
        userFilter,
        phaseFilter,
        isWalletConnected,
        walletAddress,
        watchlistedMarkets,
        assetSearch,
        orderBy,
        orderDirection,
    ]);

    const searchFilteredOptionsMarkets = useDebouncedMemo(
        () => {
            return assetSearch
                ? filteredOptionsMarkets.filter(({ asset, currencyKey }) => {
                      return (
                          asset.toLowerCase().includes(assetSearch.toLowerCase()) ||
                          getSynthName(currencyKey)?.toLowerCase().includes(assetSearch.toLowerCase())
                      );
                  })
                : filteredOptionsMarkets;
        },
        [filteredOptionsMarkets, assetSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    const secondLevelFilteredOptionsMarket = useMemo(() => {
        let secondLevelFilteredOptionsMarkets = filteredOptionsMarkets;
        switch (secondLevelUserFilter) {
            case SecondaryFilters.Bitcoin:
                secondLevelFilteredOptionsMarkets = filteredOptionsMarkets.filter(
                    ({ currencyKey }) => currencyKey === SYNTHS_MAP.sBTC
                );
                break;
            case SecondaryFilters.Ethereum:
                secondLevelFilteredOptionsMarkets = filteredOptionsMarkets.filter(
                    ({ currencyKey }) => currencyKey === SYNTHS_MAP.sETH
                );
                break;
            case SecondaryFilters.Olympics:
                secondLevelFilteredOptionsMarkets = filteredOptionsMarkets.filter(({ customMarket }) => customMarket);
                break;
        }

        if (phaseFilter !== PhaseFilterEnum.all) {
            secondLevelFilteredOptionsMarkets = secondLevelFilteredOptionsMarkets.filter((market) => {
                return market.phase === phaseFilter;
            });
        }

        return secondLevelFilteredOptionsMarkets;
    }, [filteredOptionsMarkets, secondLevelUserFilter, phaseFilter]);

    const onClickUserFilter = (filter: PrimaryFilters, isDisabled: boolean) => {
        const userFilterValue = queryString.parse(searchFilter.search).userFilter;

        if (!isDisabled && userFilterValue !== filter) {
            history.push({
                pathname: searchFilter.pathname,
                search: queryString.stringify({ userFilter: [filter] }),
            });
        } else if (userFilterValue === filter && userFilter !== PrimaryFilters.All) {
            history.push({
                pathname: searchFilter.pathname,
                search: '',
            });
        }

        if (!isDisabled && secondLevelUserFilter !== SecondaryFilters.All && filter !== PrimaryFilters.All) {
            setSecondLevelUserFilter(SecondaryFilters.All);
        }

        if (!isDisabled) {
            setUserFilter(userFilter === filter ? PrimaryFilters.All : filter);
        }

        document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });

        return;
    };

    const onClickSecondLevelUserFilter = (filter: SecondaryFilters, isDisabled: boolean) => {
        const userFilterValue = queryString.parse(searchFilter.search).userFilter;
        const secondLevelFilterValue = queryString.parse(searchFilter.search).userFilter2;

        if (!isDisabled && secondLevelFilterValue !== filter && userFilter) {
            history.push({
                pathname: searchFilter.pathname,
                search: queryString.stringify({
                    userFilter: [userFilterValue],
                    userFilter2: [filter],
                }),
            });
        } else if (userFilter && secondLevelFilterValue === filter && secondLevelUserFilter !== SecondaryFilters.All) {
            history.push({
                pathname: searchFilter.pathname,
                search: queryString.stringify({
                    userFilter: [userFilterValue],
                }),
            });
        } else if (!isDisabled && !userFilter && secondLevelFilterValue !== filter) {
            history.push({
                pathname: searchFilter.pathname,
                search: queryString.stringify({
                    userFilter2: [filter],
                }),
            });
        }

        if (!isDisabled) {
            setSecondLevelUserFilter(secondLevelUserFilter === filter ? SecondaryFilters.All : filter);
        }

        document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        return;
    };

    const getImage = (filter: PrimaryFilters | SecondaryFilters) => {
        switch (filter) {
            case PrimaryFilters.MyMarkets:
                return myMarkets;
            case PrimaryFilters.MyWatchlist:
                return myWatchlist;
            case PrimaryFilters.Recent:
                return recentlyAdded;
            case PrimaryFilters.MyAssets:
                return myAssets;
            case PrimaryFilters.MyOrders:
                return myOpenOrders;
            case SecondaryFilters.Bitcoin:
                return bitcoin;
            case SecondaryFilters.Ethereum:
                return ethereum;
            case SecondaryFilters.Olympics:
                return olympicsImg;
        }
    };

    const resetFilters = () => {
        setPhaseFilter(PhaseFilterEnum.all);
        setUserFilter(PrimaryFilters.All);
        setSecondLevelUserFilter(SecondaryFilters.All);
    };

    return (
        <>
            <ExploreMarketsMobile
                exchangeRates={exchangeRates}
                userFilter={userFilter}
                setUserFilter={setUserFilter}
                secondLevelUserFilter={secondLevelUserFilter}
                setSecondLevelUserFilter={setSecondLevelUserFilter}
                phaseFilter={phaseFilter}
                setPhaseFilter={setPhaseFilter}
                assetSearch={assetSearch}
                setAssetSearch={setAssetSearch}
                allMarkets={filteredOptionsMarkets}
                filteredMarkets={assetSearch ? searchFilteredOptionsMarkets : secondLevelFilteredOptionsMarket}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
            ></ExploreMarketsMobile>
            <div id="explore-markets" className="markets-desktop" style={{ width: '100%' }}>
                <FlexDivCentered style={{ flexFlow: 'wrap' }}>
                    {Object.keys(PrimaryFilters)
                        .filter(
                            (key) =>
                                isNaN(Number(PrimaryFilters[key as keyof typeof PrimaryFilters])) &&
                                key !== PrimaryFilters.All
                        )
                        .map((key, index) => {
                            const isDisabled = !isWalletConnected && index < 4;
                            return (
                                <UserFilter
                                    className={`${
                                        !isDisabled && userFilter === PrimaryFilters[key as keyof typeof PrimaryFilters]
                                            ? 'selected'
                                            : ''
                                    }`}
                                    disabled={isDisabled}
                                    onClick={onClickUserFilter.bind(
                                        this,
                                        PrimaryFilters[key as keyof typeof PrimaryFilters],
                                        isDisabled
                                    )}
                                    key={key}
                                    img={getImage(PrimaryFilters[key as keyof typeof PrimaryFilters])}
                                    text={PrimaryFilters[key as keyof typeof PrimaryFilters]}
                                />
                            );
                        })}
                </FlexDivCentered>

                <FlexDivCentered style={{ flexFlow: 'wrap' }}>
                    {Object.keys(SecondaryFilters)
                        .filter(
                            (key) =>
                                isNaN(Number(SecondaryFilters[key as keyof typeof SecondaryFilters])) &&
                                key !== SecondaryFilters.All
                        )
                        .map((key) => {
                            const isCustomMarketsEmpty =
                                filteredOptionsMarkets.filter(({ customMarket }) => customMarket).length === 0;
                            const isBtcMarketsEmpty =
                                filteredOptionsMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sBTC)
                                    .length === 0;
                            const isEthMarketsEmpty =
                                filteredOptionsMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sETH)
                                    .length === 0;
                            const assetSearchNoBtc =
                                filteredOptionsMarkets.filter(({ asset, currencyKey }) => {
                                    return (
                                        currencyKey === SYNTHS_MAP.sBTC &&
                                        (asset.toLowerCase().includes(assetSearch.toLowerCase()) ||
                                            getSynthName(currencyKey)
                                                ?.toLowerCase()
                                                .includes(assetSearch.toLowerCase()))
                                    );
                                }).length === 0 &&
                                assetSearch.length > 0 &&
                                SecondaryFilters.Bitcoin === key;
                            const assetSearchNoEth =
                                filteredOptionsMarkets.filter(({ asset, currencyKey }) => {
                                    return (
                                        currencyKey === SYNTHS_MAP.sETH &&
                                        (asset.toLowerCase().includes(assetSearch.toLowerCase()) ||
                                            getSynthName(currencyKey)
                                                ?.toLowerCase()
                                                .includes(assetSearch.toLowerCase()))
                                    );
                                }).length === 0 &&
                                assetSearch.length > 0 &&
                                SecondaryFilters.Ethereum === key;
                            let isDisabled = false;
                            switch (key) {
                                case SecondaryFilters.Bitcoin:
                                    isBtcMarketsEmpty ? (isDisabled = true) : (isDisabled = false);
                                    break;
                                case SecondaryFilters.Ethereum:
                                    isEthMarketsEmpty ? (isDisabled = true) : (isDisabled = false);
                                    break;
                                case SecondaryFilters.Olympics:
                                    (userFilter !== PrimaryFilters.All && isCustomMarketsEmpty) ||
                                    assetSearch.length > 0
                                        ? (isDisabled = true)
                                        : (isDisabled = false);
                                    break;
                            }
                            isDisabled = isDisabled || assetSearchNoBtc || assetSearchNoEth;
                            return (
                                <UserFilter
                                    className={`${
                                        !isDisabled &&
                                        secondLevelUserFilter === SecondaryFilters[key as keyof typeof SecondaryFilters]
                                            ? 'selected'
                                            : ''
                                    }`}
                                    disabled={isDisabled}
                                    onClick={onClickSecondLevelUserFilter.bind(
                                        this,
                                        SecondaryFilters[key as keyof typeof SecondaryFilters],
                                        isDisabled
                                    )}
                                    key={key}
                                    img={getImage(SecondaryFilters[key as keyof typeof SecondaryFilters])}
                                    text={SecondaryFilters[key as keyof typeof SecondaryFilters]}
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
                        <div>
                            {Object.keys(PhaseFilterEnum)
                                .filter((key) => isNaN(Number(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum])))
                                .map((key) => (
                                    <FilterButton
                                        className={
                                            phaseFilter === PhaseFilterEnum[key as keyof typeof PhaseFilterEnum]
                                                ? 'selected'
                                                : ''
                                        }
                                        onClick={() =>
                                            setPhaseFilter(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum])
                                        }
                                        key={key}
                                    >
                                        {t(`options.phases.${key}`)}
                                    </FilterButton>
                                ))}
                        </div>
                    </div>
                    <SearchMarket assetSearch={assetSearch} setAssetSearch={setAssetSearch} />
                </FlexDiv>

                <MarketsTable
                    exchangeRates={exchangeRates}
                    optionsMarkets={assetSearch ? searchFilteredOptionsMarkets : secondLevelFilteredOptionsMarket}
                    watchlistedMarkets={watchlistedMarkets}
                    isLoading={false} // TODO put logic
                    phase={phaseFilter}
                    onChange={watchlistedMarketsQuery.refetch}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    orderDirection={orderDirection}
                    setOrderDirection={setOrderDirection}
                >
                    <NoMarkets>
                        {userFilter !== PrimaryFilters.MyMarkets && (
                            <>
                                <Text className="text-l bold pale-grey">
                                    {t('options.home.explore-markets.table.no-markets-found')}
                                </Text>
                                <Button className="primary" onClick={resetFilters}>
                                    {t('options.home.explore-markets.table.view-all-markets')}
                                </Button>
                            </>
                        )}
                        {userFilter === PrimaryFilters.MyMarkets && (
                            <>
                                <Text className="text-l bold pale-grey">You haven’t created any market yet.</Text>
                                <FlexDiv style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                                    <Button
                                        className="secondary"
                                        onClick={() =>
                                            isWalletConnected
                                                ? navigateTo(ROUTES.Options.CreateMarket)
                                                : onboardConnector.connectWallet()
                                        }
                                    >
                                        {isWalletConnected
                                            ? t('options.home.market-creation.create-market-button-label')
                                            : t('common.wallet.connect-your-wallet')}
                                    </Button>
                                    <Text
                                        className="text-l bold pale-grey"
                                        style={{
                                            margin: 'auto 60px',
                                        }}
                                    >
                                        or
                                    </Text>
                                    <Button className="primary" onClick={resetFilters}>
                                        {t('options.home.explore-markets.table.view-all-markets')}
                                    </Button>
                                </FlexDiv>
                            </>
                        )}
                    </NoMarkets>
                </MarketsTable>
            </div>
        </>
    );
};

const NoMarkets = styled(FlexDivColumn)`
    height: 500px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    .primary {
        align-self: center;
    }
`;

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const isRecentlyAdded = (a: Date, b: Date) => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY)) <= 7;
};

export const sortByField = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection,
    field: keyof HistoricalOptionsMarketInfo
) => {
    if (direction === OrderDirection.ASC) {
        if (a.phaseNum === b.phaseNum) {
            return (a[field] as any) > (b[field] as any) ? 1 : -1;
        }
    }
    if (direction === OrderDirection.DESC) {
        if (a.phaseNum === b.phaseNum) {
            return (a[field] as any) > (b[field] as any) ? -1 : 1;
        }
    }

    return 0;
};

export const sortByTime = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection
) => {
    if (direction === OrderDirection.ASC && a.phaseNum === b.phaseNum) {
        return a.timeRemaining > b.timeRemaining ? -1 : 1;
    }
    if (direction === OrderDirection.DESC && a.phaseNum === b.phaseNum) {
        return a.timeRemaining > b.timeRemaining ? 1 : -1;
    }

    return 0;
};

export const sortByAssetPrice = (
    a: HistoricalOptionsMarketInfo,
    b: HistoricalOptionsMarketInfo,
    direction: OrderDirection,
    exchangeRates: Rates | null
) => {
    const assetPriceA = exchangeRates?.[a.currencyKey] || 0;
    const assetPriceB = exchangeRates?.[b.currencyKey] || 0;
    if (direction === OrderDirection.ASC) {
        if (a.phaseNum === b.phaseNum) {
            return assetPriceA > assetPriceB ? 1 : -1;
        }
    }
    if (direction === OrderDirection.DESC) {
        if (a.phaseNum === b.phaseNum) {
            return assetPriceA > assetPriceB ? -1 : 1;
        }
    }

    return 0;
};

export default ExploreMarketsDesktop;
