import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MarketsTable from '../MarketsTable';
import { HistoricalOptionsMarketInfo, OptionsMarkets, Trade } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getWalletAddress, getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { Button, FilterButton, FlexDiv, FlexDivCentered, FlexDivColumn, Text } from 'theme/common';
import styled from 'styled-components';
import myMarkets from 'assets/images/filters/my-markets.svg';
import olympicsImg from 'assets/images/filters/olympics.svg';
import myWatchlist from 'assets/images/filters/my-watchlist.svg';
import recentlyAdded from 'assets/images/filters/recently-added.svg';
import bitcoin from 'assets/images/filters/bitcoin.svg';
import ethereum from 'assets/images/filters/ethereum.svg';
import myAssets from 'assets/images/filters/my-assets.svg';
import myOpenOrders from 'assets/images/filters/my-open-orders.svg';
import UserFilter from './UserFilters';
import SearchMarket from '../SearchMarket';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import { history, navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import onboardConnector from 'utils/onboardConnector';
import useUserWatchlistedMarketsQuery from 'queries/watchlist/useUserWatchlistedMarketsQuery';
import snxJSConnector, { getSynthName } from 'utils/snxJSConnector';
import { SYNTHS_MAP } from '../../../../constants/currency';
import useAssetsBalanceQuery from '../../../../queries/user/useUserAssetsBalanceQuery';
import useUserOrdersQuery from '../../../../queries/user/useUserOrdersQuery';
import { Rates } from '../../../../queries/rates/useExchangeRatesQuery';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { ExploreMarketsMobile } from './ExploreMarketsMobile';
import './media.scss';

type ExploreMarketsProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    olympics?: boolean;
};

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

const ExploreMarketsDesktop: React.FC<ExploreMarketsProps> = ({ optionsMarkets, exchangeRates, olympics }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const { t } = useTranslation();
    const [phaseFilter, setPhaseFilter] = useState<PhaseFilterEnum>(PhaseFilterEnum.trading);
    const [userFilter, setUserFilter] = useState<PrimaryFilters>(PrimaryFilters.All);
    const [secondLevelUserFilter, setSecondLevelUserFilter] = useState<SecondaryFilters>(SecondaryFilters.All);
    const [assetSearch, setAssetSearch] = useState<string>('');
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
        if (olympics) {
            setSecondLevelUserFilter(SecondaryFilters.Olympics);
        }
        // else {
        //     const userFilterParamValue = queryString.parse(searchFilter.search).userFilter;
        //     if (userFilter === PrimaryFilters.Olympics && !userFilterParamValue) {
        //         setUserFilter(PrimaryFilters.All);
        //     }
        // }
    }, [olympics]);

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

        if (secondLevelUserFilterParamValue && secondLevelUserFilter === SecondaryFilters.All) {
            Object.keys(SecondaryFilters).forEach((key) => {
                if (SecondaryFilters[key as keyof typeof SecondaryFilters] === secondLevelUserFilterParamValue)
                    setSecondLevelUserFilter(secondLevelUserFilterParamValue);
            });
        }

        return filteredMarkets;
    }, [optionsMarkets, userFilter, phaseFilter, isWalletConnected, walletAddress, watchlistedMarkets, assetSearch]);

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

    const searchSecondLevelFilteredOptionsMarket = useMemo(() => {
        let secondLevelFilteredOptionsMarket = filteredOptionsMarkets;
        switch (secondLevelUserFilter) {
            case SecondaryFilters.Bitcoin:
                secondLevelFilteredOptionsMarket = filteredOptionsMarkets.filter(
                    ({ currencyKey }) => currencyKey === SYNTHS_MAP.sBTC
                );
                break;
            case SecondaryFilters.Ethereum:
                secondLevelFilteredOptionsMarket = filteredOptionsMarkets.filter(
                    ({ currencyKey }) => currencyKey === SYNTHS_MAP.sETH
                );
                break;
            case SecondaryFilters.Olympics:
                secondLevelFilteredOptionsMarket = filteredOptionsMarkets.filter(({ customMarket }) => customMarket);
                break;
        }

        if (phaseFilter !== PhaseFilterEnum.all) {
            secondLevelFilteredOptionsMarket = secondLevelFilteredOptionsMarket.filter((market) => {
                return market.phase === phaseFilter;
            });
        }

        return secondLevelFilteredOptionsMarket;
    }, [filteredOptionsMarkets, secondLevelUserFilter, phaseFilter]);

    const onClickUserFilter = (filter: PrimaryFilters, isDisabled: boolean) => {
        const userFilterValue = queryString.parse(searchFilter.search).userFilter;

        if (!isDisabled && userFilterValue !== filter) {
            history.replace({
                pathname: searchFilter.pathname,
                search: queryString.stringify({ userFilter: [filter] }),
            });
        } else if (userFilterValue === filter && userFilter !== PrimaryFilters.All) {
            history.replace({
                pathname: searchFilter.pathname,
                search: '',
            });
        }

        if (secondLevelUserFilter !== SecondaryFilters.All && filter !== PrimaryFilters.All && !isDisabled) {
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
        if (!isDisabled && filter === SecondaryFilters.Olympics) {
            history.replace({
                pathname: searchFilter.pathname,
                search: queryString.stringify({
                    userFilter: [filter],
                }),
            });
        }
        // else if (!isDisabled && filter === SecondaryFilters.Olympics && userFilter === filter) {
        //     history.replace({
        //         pathname: searchFilter.pathname,
        //         search: '',
        //     });
        // }

        if (filter !== SecondaryFilters.Olympics) {
            if (!isDisabled && secondLevelFilterValue !== filter && userFilter) {
                history.replace({
                    pathname: searchFilter.pathname,
                    search: queryString.stringify({
                        userFilter: [userFilterValue],
                        userFilter2: [filter],
                    }),
                });
            } else if (
                userFilter &&
                secondLevelFilterValue === filter &&
                secondLevelUserFilter !== SecondaryFilters.All
            ) {
                history.replace({
                    pathname: searchFilter.pathname,
                    search: queryString.stringify({
                        userFilter: [userFilterValue],
                    }),
                });
            } else if (!isDisabled && !userFilter && secondLevelFilterValue !== filter) {
                history.replace({
                    pathname: searchFilter.pathname,
                    search: queryString.stringify({
                        userFilter2: [filter],
                    }),
                });
            }
        }

        // if (!isDisabled && filter === SecondaryFilters.Olympics) {
        //     setUserFilter(userFilter === filter ? PrimaryFilters.All : filter);
        // }

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
                optionsMarkets={assetSearch ? searchFilteredOptionsMarkets : searchSecondLevelFilteredOptionsMarket}
            ></ExploreMarketsMobile>
            <div className="markets-desktop" style={{ padding: '0 150px 50px 150px', width: '100%' }}>
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
                            const isBtcMarketsEmpty =
                                filteredOptionsMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sBTC)
                                    .length === 0;
                            const isEthMarketsEmpty =
                                filteredOptionsMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sETH)
                                    .length === 0;
                            const isDisabled =
                                (SecondaryFilters.Bitcoin === key && isBtcMarketsEmpty) ||
                                (SecondaryFilters.Ethereum === key && isEthMarketsEmpty);
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
                    optionsMarkets={assetSearch ? searchFilteredOptionsMarkets : searchSecondLevelFilteredOptionsMarket}
                    watchlistedMarkets={watchlistedMarkets}
                    isLoading={false} // TODO put logic
                    phase={phaseFilter}
                    onChange={watchlistedMarketsQuery.refetch}
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

export default ExploreMarketsDesktop;
