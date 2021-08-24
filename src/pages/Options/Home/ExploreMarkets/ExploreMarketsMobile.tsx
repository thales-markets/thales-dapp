import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionsMarkets } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { Button, FlexDiv, FlexDivColumn, Text } from 'theme/common';
import SearchMarket from '../SearchMarket';
import { PhaseFilters } from './Mobile/PhaseFilters';
import { CategoryFilters, DropDown, DropDownWrapper } from './Mobile/CategoryFilters';
import { MarketCardMobile } from './Mobile/MarketCardMobile';
import { SortyByMobile } from './Mobile/SortByMobile';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { Overlay } from 'components/Header/Header';
import { PhaseFilterEnum, PrimaryFilters, SecondaryFilters } from './ExploreMarketsDesktop';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { history, navigateTo } from 'utils/routes';
import { SYNTHS_MAP } from 'constants/currency';
import { getSynthName } from 'utils/snxJSConnector';

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
    Asset = 'Asset',
    Asset_Price = 'Asset Price',
    Strike_Price = 'Strike Price',
    Pool_Size = 'Pool Size',
    Time_Remaining = 'Time Remaining',
    Open_Orders = 'Open Orders',
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
        } else if (userFilterValue === filter && userFilter !== PrimaryFilters.All) {
            history.replace({
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
        } else if (userFilter && secondLevelFilterValue === filter && secondLevelUserFilter !== SecondaryFilters.All) {
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
            setSecondLevelUserFilter(secondLevelUserFilter === filter ? SecondaryFilters.All : filter);
        }

        document.getElementsByClassName('markets-mobile')[0]?.scrollIntoView({ behavior: 'smooth' });
        return;
    };

    const resetFilters = () => {
        setPhaseFilter(PhaseFilterEnum.all);
        setUserFilter(PrimaryFilters.All);
        setSecondLevelUserFilter(SecondaryFilters.All);
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
                    filter={userFilter}
                >
                    <DropDownWrapper hidden={!showDropdownUserFilters}>
                        <DropDown>
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                Category
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
                                    return (
                                        <Text
                                            key={key}
                                            onClick={onClickUserFilter.bind(
                                                this,
                                                PrimaryFilters[key as keyof typeof PrimaryFilters],
                                                isDisabled
                                            )}
                                            className={`${
                                                !isDisabled &&
                                                userFilter === PrimaryFilters[key as keyof typeof PrimaryFilters]
                                                    ? 'selected'
                                                    : ''
                                            } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                            style={{ marginLeft: 20 }}
                                        >
                                            {PrimaryFilters[key as keyof typeof PrimaryFilters]}
                                        </Text>
                                    );
                                })}
                            <Text style={{ marginLeft: -20 }} className="text-m pale-grey">
                                Discover
                            </Text>
                            {Object.keys(SecondaryFilters)
                                .filter(
                                    (key) =>
                                        isNaN(Number(SecondaryFilters[key as keyof typeof SecondaryFilters])) &&
                                        SecondaryFilters[key as keyof typeof SecondaryFilters] !== SecondaryFilters.All
                                )
                                .map((key) => {
                                    const isCustomMarketsEmpty =
                                        allMarkets.filter(({ customMarket }) => customMarket).length === 0;
                                    const isBtcMarketsEmpty =
                                        allMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sBTC)
                                            .length === 0;
                                    const isEthMarketsEmpty =
                                        allMarkets.filter(({ currencyKey }) => currencyKey === SYNTHS_MAP.sETH)
                                            .length === 0;
                                    const assetSearchNoBtc =
                                        allMarkets.filter(({ asset, currencyKey }) => {
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
                                        allMarkets.filter(({ asset, currencyKey }) => {
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
                                        <Text
                                            key={key}
                                            onClick={onClickSecondLevelUserFilter.bind(
                                                this,
                                                SecondaryFilters[key as keyof typeof SecondaryFilters],
                                                isDisabled
                                            )}
                                            className={`${
                                                !isDisabled &&
                                                secondLevelUserFilter ===
                                                    SecondaryFilters[key as keyof typeof SecondaryFilters]
                                                    ? 'selected'
                                                    : ''
                                            } text-s lh32 pale-grey ${isDisabled ? 'greyed-out' : ''}`}
                                            style={{ marginLeft: 20 }}
                                        >
                                            {SecondaryFilters[key as keyof typeof SecondaryFilters]}
                                        </Text>
                                    );
                                })}
                        </DropDown>
                    </DropDownWrapper>
                </CategoryFilters>
                <PhaseFilters onClick={setShowDropwodnPhase.bind(this, !showDropdownPhase)} filter={phaseFilter}>
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
                filter={mapOrderByToEnum(orderBy)}
            >
                <DropDownWrapper className="markets-mobile__sorting-dropdown" hidden={!showDropdownSort}>
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

            {filteredMarkets.length > 0 ? (
                <MarketCardMobile exchangeRates={exchangeRates} optionsMarkets={filteredMarkets}></MarketCardMobile>
            ) : (
                <NoMarkets>
                    <Container>
                        {userFilter !== PrimaryFilters.MyMarkets && (
                            <>
                                <Text className="text-m bold pale-grey">
                                    {t('options.home.explore-markets.table.no-markets-found')}
                                </Text>
                                <Button className="primary" onClick={resetFilters}>
                                    {t('options.home.explore-markets.table.view-all-markets')}
                                </Button>
                            </>
                        )}
                        {userFilter === PrimaryFilters.MyMarkets && (
                            <>
                                <Text className="text-m bold pale-grey">You haven’t created any market yet.</Text>
                                <FlexDiv
                                    style={{
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Button
                                        className="primary"
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
                                        className="text-m bold pale-grey"
                                        style={{
                                            margin: '24px',
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
