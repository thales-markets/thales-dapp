import { Overlay } from 'components/Header/Header';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumn, Text } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { getSynthName } from 'utils/currency';
import { getIsOVM, getIsPolygon } from 'utils/network';
import { history } from 'utils/routes';
import SearchMarket from '../SearchMarket';
import { PhaseFilterEnum, PrimaryFilters, SecondaryFilters } from './ExploreMarketsDesktop';
import { CategoryFilters, DropDown, DropDownWrapper } from './Mobile/CategoryFilters';
import { MarketCardMobile } from './Mobile/MarketCardMobile';
import { PhaseFilters } from './Mobile/PhaseFilters';
import { SortyByMobile } from './Mobile/SortByMobile';

type ExploreMarketsMobileProps = {
    exchangeRates: Rates | null;
    allMarkets: OptionsMarkets;
    filteredMarkets: OptionsMarkets;
    phaseFilter: any;
    setPhaseFilter: (data: any) => void;
    userFilter: any;
    setUserFilter: (data: any) => void;
    secondLevelUserFilter: any;
    setSecondLevelUserFilter: (data: any) => void;
    assetSearch: any;
    setAssetSearch: (data: any) => void;
    orderBy: number;
    setOrderBy: (data: any) => void;
};

export enum SortByEnum {
    Asset = 'asset-col',
    Asset_Price = 'asset-price-col',
    Strike_Price = 'strike-price-col',
    Pool_Size = 'pool-size-col',
    Amm_Size = 'amm-size-col',
    Time_Remaining = 'time-remaining-col',
    Open_Orders = 'open-orders-col',
}

export const ExploreMarketsMobile: React.FC<ExploreMarketsMobileProps> = ({
    allMarkets,
    filteredMarkets,
    phaseFilter,
    setPhaseFilter,
    userFilter,
    setUserFilter,
    assetSearch,
    setAssetSearch,
    exchangeRates,
    setSecondLevelUserFilter,
    secondLevelUserFilter,
    orderBy,
    setOrderBy,
}) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const { t } = useTranslation();
    const [showDropdownPhase, setShowDropwodnPhase] = useState(false);
    const [showDropdownUserFilters, setShowDropwodnUserFilters] = useState(false);

    const [showDropdownSort, setShowDropwodnSort] = useState(false);
    const searchFilter = useLocation();

    const onClickUserFilter = (filter: PrimaryFilters, isDisabled: boolean) => {
        const userFilterValue = queryString.parse(searchFilter.search).userFilter;
        if (!isDisabled && userFilterValue !== filter) {
            history.replace({
                pathname: searchFilter.pathname,
                search: queryString.stringify({ userFilter: [filter] }),
            });
        } else if (userFilterValue === filter && userFilter !== PrimaryFilters.all) {
            history.replace({
                pathname: searchFilter.pathname,
                search: '',
            });
        }

        if (!isDisabled && secondLevelUserFilter !== SecondaryFilters.all && filter !== PrimaryFilters.all) {
            setSecondLevelUserFilter(SecondaryFilters.all);
        }

        if (!isDisabled) {
            setUserFilter(userFilter === filter ? PrimaryFilters.all : filter);
        }

        document.getElementsByClassName('markets-mobile')[0]?.scrollIntoView({ behavior: 'smooth' });
        return;
    };

    const onClickSecondLevelUserFilter = (filter: SecondaryFilters, isDisabled: boolean) => {
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
        } else if (userFilter && secondLevelFilterValue === filter && secondLevelUserFilter !== SecondaryFilters.all) {
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

        if (!isDisabled) {
            setSecondLevelUserFilter(secondLevelUserFilter === filter ? SecondaryFilters.all : filter);
        }

        document.getElementsByClassName('markets-mobile')[0]?.scrollIntoView({ behavior: 'smooth' });
        return;
    };

    const resetFilters = () => {
        setPhaseFilter(PhaseFilterEnum.all);
        setUserFilter(PrimaryFilters.all);
        setSecondLevelUserFilter(SecondaryFilters.all);
    };

    return (
        <div className="markets-mobile">
            <SearchMarket
                className="markets-mobile__search"
                assetSearch={assetSearch}
                setAssetSearch={setAssetSearch}
            />
            <FlexDiv className="markets-mobile__filters">
                <CategoryFilters
                    onClick={setShowDropwodnUserFilters.bind(this, !showDropdownUserFilters)}
                    filter={t(`options.filters-labels.${userFilter}`)}
                >
                    <DropDownWrapper hidden={!showDropdownUserFilters}>
                        <DropDown>
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                {t(`options.filters-labels.category`)}
                            </Text>
                            {Object.keys(PrimaryFilters)
                                .filter(
                                    (key) =>
                                        isNaN(Number(PrimaryFilters[key as keyof typeof PrimaryFilters])) &&
                                        PrimaryFilters[key as keyof typeof PrimaryFilters] !==
                                            PrimaryFilters.MyWatchlist
                                )
                                .map((key, index) => {
                                    const isDisabled = !isWalletConnected && index < 4;
                                    const castedKey = key as keyof typeof PrimaryFilters;
                                    return (
                                        <Text
                                            key={key}
                                            onClick={onClickUserFilter.bind(
                                                this,
                                                PrimaryFilters[castedKey],
                                                isDisabled
                                            )}
                                            className={`${
                                                !isDisabled && userFilter === PrimaryFilters[castedKey]
                                                    ? 'selected'
                                                    : ''
                                            } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                            style={{ marginLeft: 20 }}
                                        >
                                            {t(`options.filters-labels.${PrimaryFilters[castedKey]}`)}
                                        </Text>
                                    );
                                })}
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                {t(`options.filters-labels.discover`)}
                            </Text>
                            {Object.keys(SecondaryFilters)
                                .filter(
                                    (key) =>
                                        isNaN(Number(SecondaryFilters[key as keyof typeof SecondaryFilters])) &&
                                        SecondaryFilters[key as keyof typeof SecondaryFilters] !== SecondaryFilters.all
                                )
                                .map((key) => {
                                    if (
                                        isL2 &&
                                        (SecondaryFilters[key as keyof typeof SecondaryFilters] ===
                                            SecondaryFilters.CustomMarkets ||
                                            SecondaryFilters[key as keyof typeof SecondaryFilters] ===
                                                SecondaryFilters.Competition)
                                    )
                                        return null;
                                    const isCustomMarketsEmpty =
                                        allMarkets.filter(({ customMarket }) => customMarket).length === 0;
                                    const isBtcMarketsEmpty =
                                        allMarkets.filter(
                                            ({ currencyKey }) =>
                                                currencyKey === SYNTHS_MAP.sBTC ||
                                                currencyKey === CRYPTO_CURRENCY_MAP.BTC
                                        ).length === 0;
                                    const isEthMarketsEmpty =
                                        allMarkets.filter(
                                            ({ currencyKey }) =>
                                                currencyKey === SYNTHS_MAP.sETH ||
                                                currencyKey === CRYPTO_CURRENCY_MAP.ETH
                                        ).length === 0;
                                    const assetSearchNoBtc =
                                        allMarkets.filter(({ asset, currencyKey }) => {
                                            return (
                                                (currencyKey === SYNTHS_MAP.sBTC ||
                                                    currencyKey === CRYPTO_CURRENCY_MAP.BTC) &&
                                                (asset.toLowerCase().includes(assetSearch.toLowerCase()) ||
                                                    getSynthName(currencyKey)
                                                        ?.toLowerCase()
                                                        .includes(assetSearch.toLowerCase()))
                                            );
                                        }).length === 0 &&
                                        assetSearch.length > 0 &&
                                        SecondaryFilters.Bitcoin === key;
                                    const assetSearchNoEth =
                                        allMarkets.filter(({ asset, currencyKey }) => {
                                            return (
                                                (currencyKey === SYNTHS_MAP.sETH ||
                                                    currencyKey === CRYPTO_CURRENCY_MAP.ETH) &&
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
                                        case SecondaryFilters.CustomMarkets:
                                            isCustomMarketsEmpty ? (isDisabled = true) : (isDisabled = false);
                                            break;
                                    }
                                    isDisabled = isDisabled || assetSearchNoBtc || assetSearchNoEth;
                                    const castedKey = key as keyof typeof SecondaryFilters;
                                    return (
                                        <Text
                                            key={key}
                                            onClick={onClickSecondLevelUserFilter.bind(
                                                this,
                                                SecondaryFilters[castedKey],
                                                isDisabled
                                            )}
                                            className={`${
                                                !isDisabled && secondLevelUserFilter === SecondaryFilters[castedKey]
                                                    ? 'selected'
                                                    : ''
                                            } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                            style={{ marginLeft: 20 }}
                                        >
                                            {t(`options.filters-labels.${SecondaryFilters[castedKey]}`)}
                                        </Text>
                                    );
                                })}
                        </DropDown>
                    </DropDownWrapper>
                </CategoryFilters>
                <PhaseFilters
                    onClick={setShowDropwodnPhase.bind(this, !showDropdownPhase)}
                    filter={t(`options.filters-labels.${phaseFilter}`)}
                >
                    <DropDownWrapper hidden={!showDropdownPhase}>
                        <DropDown>
                            {Object.keys(PhaseFilterEnum)
                                .filter((key) => isNaN(Number(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum])))
                                .map((key) => (
                                    <Text
                                        className={`${
                                            phaseFilter === PhaseFilterEnum[key as keyof typeof PhaseFilterEnum]
                                                ? 'selected'
                                                : ''
                                        } text-s lh32 pale-grey capitalize`}
                                        onClick={() =>
                                            setPhaseFilter(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum])
                                        }
                                        key={key}
                                    >
                                        {t(`options.phases.${key}`)}
                                    </Text>
                                ))}
                        </DropDown>
                    </DropDownWrapper>
                </PhaseFilters>
            </FlexDiv>

            <SortyByMobile
                onClick={setShowDropwodnSort.bind(this, !showDropdownSort)}
                filter={t(`options.home.markets-table.${mapOrderByToEnum(orderBy, networkId)}`)}
            >
                <DropDownWrapper className="markets-mobile__sorting-dropdown" hidden={!showDropdownSort}>
                    <DropDown>
                        {Object.keys(SortByEnum)
                            .filter((key) => isNaN(Number(SortByEnum[key as keyof typeof SortByEnum])))
                            .map((key) => {
                                if (
                                    (isL2 || isPolygon) &&
                                    SortByEnum[key as keyof typeof SortByEnum] === SortByEnum.Pool_Size
                                )
                                    return <></>;
                                if (
                                    !(isL2 || isPolygon) &&
                                    SortByEnum[key as keyof typeof SortByEnum] === SortByEnum.Amm_Size
                                )
                                    return <></>;
                                return (
                                    <Text
                                        className={`${
                                            mapOrderByToEnum(orderBy, networkId) ===
                                            SortByEnum[key as keyof typeof SortByEnum]
                                                ? 'selected'
                                                : ''
                                        } text-s lh32 pale-grey capitalize`}
                                        onClick={() =>
                                            setOrderBy(
                                                revertOrderToEnum(SortByEnum[key as keyof typeof SortByEnum], networkId)
                                            )
                                        }
                                        key={key}
                                    >
                                        {t(`options.home.markets-table.${SortByEnum[key as keyof typeof SortByEnum]}`)}
                                    </Text>
                                );
                            })}
                    </DropDown>
                </DropDownWrapper>
            </SortyByMobile>

            {filteredMarkets.length > 0 ? (
                <MarketCardMobile exchangeRates={exchangeRates} optionsMarkets={filteredMarkets}></MarketCardMobile>
            ) : (
                <NoMarkets>
                    <Container>
                        <Text className="text-m bold pale-grey">
                            {t('options.home.explore-markets.table.no-markets-found')}
                        </Text>
                        <Button className="primary" onClick={resetFilters}>
                            {t('options.home.explore-markets.table.view-all-markets')}
                        </Button>
                    </Container>
                </NoMarkets>
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

const mapOrderByToEnum = (data: number, networkId: number) => {
    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);

    switch (data) {
        case 1:
        case 2:
            return SortByEnum.Asset;
        case 3:
            return SortByEnum.Asset_Price;
        case 4:
            return SortByEnum.Strike_Price;
        case 5:
            return isL2 || isPolygon ? SortByEnum.Amm_Size : SortByEnum.Pool_Size;
        case 6:
            return SortByEnum.Time_Remaining;
        case 7:
            return SortByEnum.Open_Orders;
        default:
            return SortByEnum.Time_Remaining;
    }
};

const revertOrderToEnum = (data: SortByEnum, networkId: number) => {
    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);

    switch (data) {
        case SortByEnum.Asset:
            return 2;
        case SortByEnum.Asset_Price:
            return 3;
        case SortByEnum.Strike_Price:
            return 4;
        case isL2 || isPolygon ? SortByEnum.Amm_Size : SortByEnum.Pool_Size:
            return 5;
        case SortByEnum.Time_Remaining:
            return 6;
        case SortByEnum.Open_Orders:
            return 7;
        default:
            return SortByEnum.Time_Remaining;
    }
};

const NoMarkets = styled(FlexDivColumn)`
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
