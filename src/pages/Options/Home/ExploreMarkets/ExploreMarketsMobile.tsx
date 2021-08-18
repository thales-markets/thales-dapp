import React, { useState, useMemo } from 'react';
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
import { sortByAssetPrice, sortByField, sortByTime } from '../MarketsTable/MarketsTable';
import { SortyByMobile } from './Mobile/SortByMobile';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import { memo } from 'react';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { Overlay } from 'components/Header/Header';
import { PhaseFilterEnum, PrimaryFilters, SecondaryFilters } from './ExploreMarketsDesktop';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { history, navigateTo } from 'utils/routes';

type ExploreMarketsMobileProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    phaseFilter: any;
    setPhaseFilter: (data: any) => void;
    userFilter: any;
    setUserFilter: (data: any) => void;
    secondLevelUserFilter: any;
    setSecondLevelUserFilter: (data: any) => void;
    assetSearch: any;
    setAssetSearch: (data: any) => void;
};

export enum SortByEnum {
    Asset = 'Asset',
    Asset_Price = 'Asset Price',
    Strike_Price = 'Strike Price',
    Pool_Size = 'Pool Size',
    Time_Remaining = 'Time Remaining',
    Open_Orders = 'Open Orders',
}

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

export const ExploreMarketsMobile: React.FC<ExploreMarketsMobileProps> = memo(
    ({
        optionsMarkets,
        phaseFilter,
        setPhaseFilter,
        userFilter,
        setUserFilter,
        assetSearch,
        setAssetSearch,
        exchangeRates,
        setSecondLevelUserFilter,
        secondLevelUserFilter,
    }) => {
        const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
        const { t } = useTranslation();
        const [showDropdownPhase, setShowDropwodnPhase] = useState(false);
        const [showDropdownUserFilters, setShowDropwodnUserFilters] = useState(false);

        const [showDropdownSort, setShowDropwodnSort] = useState(false);
        const [orderBy, setOrderBy] = useState(SortByEnum.Time_Remaining);
        const orderDirection = OrderDirection.DESC;
        const searchFilter = useLocation();

        const sortedMarkets = useMemo(() => {
            return optionsMarkets.sort((a, b) => {
                switch (orderBy) {
                    case SortByEnum.Asset:
                        return sortByField(a, b, orderDirection, 'asset');
                    case SortByEnum.Asset_Price:
                        return sortByAssetPrice(a, b, orderDirection, exchangeRates);
                    case SortByEnum.Strike_Price:
                        return sortByField(a, b, orderDirection, 'strikePrice');
                    case SortByEnum.Pool_Size:
                        return sortByField(a, b, orderDirection, 'poolSize');
                    case SortByEnum.Time_Remaining:
                        return sortByTime(a, b, orderDirection);
                    case SortByEnum.Open_Orders:
                        return b.openOrders - a.openOrders;
                    default:
                        return 0;
                }
            });
        }, [optionsMarkets, orderDirection, exchangeRates, orderBy]);

        const onClickUserFilter = (filter: PrimaryFilters, isDisabled: boolean) => {
            if (!isDisabled) {
                setUserFilter(userFilter === filter ? PrimaryFilters.All : filter);
            }
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
                                                } text-s lh32 pale-grey`}
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
                                            SecondaryFilters[key as keyof typeof SecondaryFilters] !==
                                                SecondaryFilters.All
                                    )
                                    .map((key, index) => {
                                        const isDisabled = !isWalletConnected && index < 4;
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
                                                } text-s lh32 pale-grey`}
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
                                    .filter((key) =>
                                        isNaN(Number(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum]))
                                    )
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

                <SortyByMobile onClick={setShowDropwodnSort.bind(this, !showDropdownSort)} filter={orderBy}>
                    <DropDownWrapper hidden={!showDropdownSort}>
                        <DropDown>
                            {Object.keys(SortByEnum)
                                .filter((key) => isNaN(Number(SortByEnum[key as keyof typeof SortByEnum])))
                                .map((key) => (
                                    <Text
                                        className={`${
                                            orderBy === SortByEnum[key as keyof typeof SortByEnum] ? 'selected' : ''
                                        } text-s lh32 pale-grey capitalize`}
                                        onClick={() => setOrderBy(SortByEnum[key as keyof typeof SortByEnum])}
                                        key={key}
                                    >
                                        {SortByEnum[key as keyof typeof SortByEnum]}
                                    </Text>
                                ))}
                        </DropDown>
                    </DropDownWrapper>
                </SortyByMobile>

                {sortedMarkets.length > 0 ? (
                    <MarketCardMobile exchangeRates={exchangeRates} optionsMarkets={sortedMarkets}></MarketCardMobile>
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
    }
);

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
