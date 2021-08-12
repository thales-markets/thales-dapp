/* eslint @typescript-eslint/no-var-requires: "off" */
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

export enum UserFilterEnum {
    All = 'All',
    MyMarkets = 'My Markets',
    MyOrders = 'My Orders',
    MyAssets = 'My Assets',
    MyWatchlist = 'Watchlist',
    Recent = 'Recently Added',
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

const ExploreMarkets: React.FC<ExploreMarketsProps> = ({ optionsMarkets, exchangeRates, olympics }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const { t } = useTranslation();
    const [phaseFilter, setPhaseFilter] = useState<PhaseFilterEnum>(PhaseFilterEnum.trading);
    const [userFilter, setUserFilter] = useState<UserFilterEnum>(UserFilterEnum.All);
    const [secondLevelUserFilter, setSecondLevelUserFilter] = useState<UserFilterEnum>(UserFilterEnum.All);
    const [assetSearch, setAssetSearch] = useState<string>('');
    const searchFilter = useLocation();
    const queryString = require('query-string');

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
            setUserFilter(UserFilterEnum.Olympics);
        } else {
            if (userFilter === UserFilterEnum.Olympics) setUserFilter(UserFilterEnum.All);
        }
    }, [olympics]);

    const filteredOptionsMarkets = useMemo(() => {
        let filteredMarkets = optionsMarkets;
        if (userFilter === UserFilterEnum.Olympics) {
            filteredMarkets = filteredMarkets.filter(({ customMarket }) => customMarket === true);
        } else {
            filteredMarkets = filteredMarkets.filter(({ customMarket }) => customMarket === false);
        }
        switch (userFilter) {
            case UserFilterEnum.MyMarkets:
                filteredMarkets = filteredMarkets.filter(
                    ({ creator }) => creator.toLowerCase() === walletAddress.toLowerCase()
                );
                break;
            case UserFilterEnum.MyWatchlist:
                filteredMarkets = filteredMarkets.filter(({ address }) => watchlistedMarkets?.includes(address));
                break;
            case UserFilterEnum.MyAssets:
                filteredMarkets = userAssets.reduce((acc: HistoricalOptionsMarketInfo[], { market, balances }) => {
                    if (balances.long || balances.short) {
                        acc.push(market);
                    }
                    return acc;
                }, []);
                break;
            case UserFilterEnum.MyOrders:
                filteredMarkets = filteredMarkets.filter((market) =>
                    userOrders.find((order) => isOrderInMarket(order.order, market))
                );
                break;
            case UserFilterEnum.Recent:
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

        if (userFilterParamValue && userFilter === UserFilterEnum.All) {
            setUserFilter(userFilterParamValue);
        }

        if (secondLevelUserFilterParamValue && secondLevelUserFilter === UserFilterEnum.All) {
            setSecondLevelUserFilter(secondLevelUserFilterParamValue);
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
            case UserFilterEnum.Bitcoin:
                secondLevelFilteredOptionsMarket = filteredOptionsMarkets.filter(
                    ({ currencyKey }) => currencyKey === SYNTHS_MAP.sBTC
                );
                break;
            case UserFilterEnum.Ethereum:
                secondLevelFilteredOptionsMarket = filteredOptionsMarkets.filter(
                    ({ currencyKey }) => currencyKey === SYNTHS_MAP.sETH
                );
                break;
        }

        if (phaseFilter !== PhaseFilterEnum.all) {
            secondLevelFilteredOptionsMarket = secondLevelFilteredOptionsMarket.filter((market) => {
                return market.phase === phaseFilter;
            });
        }

        return secondLevelFilteredOptionsMarket;
    }, [filteredOptionsMarkets, secondLevelUserFilter, phaseFilter]);

    const onClickUserFilter = (filter: UserFilterEnum, isDisabled: boolean) => {
        const userFilterValue = queryString.parse(searchFilter.search).userFilter;

        if (!isDisabled && userFilterValue !== filter) {
            history.replace({
                pathname: searchFilter.pathname,
                search: queryString.stringify({ userFilter: [filter] }),
            });
        } else if (userFilterValue === filter && userFilter !== UserFilterEnum.All) {
            history.replace({
                pathname: searchFilter.pathname,
                search: '',
            });
        }

        if (secondLevelUserFilter !== UserFilterEnum.All && userFilter !== UserFilterEnum.All && !isDisabled) {
            setSecondLevelUserFilter(UserFilterEnum.All);
        }
        if (!isDisabled) {
            setUserFilter(userFilter === filter ? UserFilterEnum.All : filter);
        }
        return;
    };

    const onClickSecondLevelUserFilter = (filter: UserFilterEnum, isDisabled: boolean) => {
        const userFilterValue = queryString.parse(searchFilter.search).userFilter;
        const secondLevelFilterValue = queryString.parse(searchFilter.search).userFilter2;

        if (!isDisabled && secondLevelFilterValue !== filter && userFilter) {
            history.replace({
                pathname: searchFilter.pathname,
                search: queryString.stringify({
                    userFilter: [userFilterValue],
                    userFilter2: [filter],
                }),
            });
        } else if (userFilter && secondLevelFilterValue === filter && secondLevelUserFilter !== UserFilterEnum.All) {
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

        if (!isDisabled && filter === UserFilterEnum.Olympics) {
            setUserFilter(userFilter === filter ? UserFilterEnum.All : filter);
        }

        if (!isDisabled) {
            setSecondLevelUserFilter(secondLevelUserFilter === filter ? UserFilterEnum.All : filter);
        }
        return;
    };

    const getImage = (filter: UserFilterEnum) => {
        switch (filter) {
            case UserFilterEnum.MyMarkets:
                return myMarkets;
            case UserFilterEnum.MyWatchlist:
                return myWatchlist;
            case UserFilterEnum.Recent:
                return recentlyAdded;
            case UserFilterEnum.Bitcoin:
                return bitcoin;
            case UserFilterEnum.Ethereum:
                return ethereum;
            case UserFilterEnum.MyAssets:
                return myAssets;
            case UserFilterEnum.MyOrders:
                return myOpenOrders;
            case UserFilterEnum.Olympics:
                return olympicsImg;
        }
    };

    const resetFilters = () => {
        setPhaseFilter(PhaseFilterEnum.all);
        setUserFilter(UserFilterEnum.All);
        setSecondLevelUserFilter(UserFilterEnum.All);
    };

    return (
        <div id="explore-markets" style={{ padding: '0 150px 50px 150px', width: '100%' }}>
            <FlexDivCentered style={{ flexFlow: 'wrap' }}>
                {Object.keys(UserFilterEnum)
                    .filter(
                        (key, index) =>
                            isNaN(Number(UserFilterEnum[key as keyof typeof UserFilterEnum])) &&
                            key !== UserFilterEnum.All &&
                            index <= 5
                    )
                    .map((key, index) => {
                        const isDisabled = !isWalletConnected && index < 4;
                        return (
                            <UserFilter
                                className={`${
                                    !isDisabled && userFilter === UserFilterEnum[key as keyof typeof UserFilterEnum]
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

            <FlexDivCentered style={{ flexFlow: 'wrap' }}>
                {Object.keys(UserFilterEnum)
                    .filter(
                        (key, index) =>
                            isNaN(Number(UserFilterEnum[key as keyof typeof UserFilterEnum])) &&
                            key !== UserFilterEnum.All &&
                            index > 5
                    )
                    .map((key) => {
                        const isBtcMarketsEmpty =
                            filteredOptionsMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sBTC)
                                .length === 0;
                        const isEthMarketsEmpty =
                            filteredOptionsMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sETH)
                                .length === 0;
                        const isDisabled =
                            (UserFilterEnum.Bitcoin === key &&
                                isBtcMarketsEmpty &&
                                userFilter !== UserFilterEnum.Ethereum) ||
                            (UserFilterEnum.Ethereum === key &&
                                isEthMarketsEmpty &&
                                userFilter !== UserFilterEnum.Bitcoin);
                        return (
                            <UserFilter
                                className={`${
                                    !isDisabled &&
                                    secondLevelUserFilter === UserFilterEnum[key as keyof typeof UserFilterEnum]
                                        ? 'selected'
                                        : ''
                                }`}
                                disabled={isDisabled}
                                onClick={onClickSecondLevelUserFilter.bind(
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
                                    onClick={() => setPhaseFilter(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum])}
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
                userFilter={userFilter}
                onChange={watchlistedMarketsQuery.refetch}
            >
                <NoMarkets>
                    {userFilter !== UserFilterEnum.MyMarkets && (
                        <>
                            <Text className="text-l bold pale-grey">
                                {t('options.home.explore-markets.table.no-markets-found')}
                            </Text>
                            <Button className="primary" onClick={resetFilters}>
                                {t('options.home.explore-markets.table.view-all-markets')}
                            </Button>
                        </>
                    )}
                    {userFilter === UserFilterEnum.MyMarkets && (
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

export default ExploreMarkets;
