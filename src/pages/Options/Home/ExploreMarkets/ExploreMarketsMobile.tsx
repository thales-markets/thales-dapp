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
import { navigateTo } from 'utils/routes';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { Overlay } from 'components/Header/Header';

type ExploreMarketsMobileProps = {
    exchangeRates: Rates | null;
    optionsMarkets: OptionsMarkets;
    phaseFilter: any;
    setPhaseFilter: (data: any) => void;
    userFilter: any;
    setUserFilter: (data: any) => void;
    assetSearch: any;
    setAssetSearch: (data: any) => void;
};

export enum PhaseFilterEnum {
    trading = 'trading',
    maturity = 'maturity',
    expiry = 'expiry',
    all = 'all',
}

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
    }) => {
        const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
        const { t } = useTranslation();
        const [showDropdownPhase, setShowDropwodnPhase] = useState(false);
        const [showDropdownUserFilters, setShowDropwodnUserFilters] = useState(false);

        const [showDropdownSort, setShowDropwodnSort] = useState(false);
        const [orderBy, setOrderBy] = useState(SortByEnum.Time_Remaining);
        const orderDirection = OrderDirection.DESC;

        const sortedMarkets = useMemo(() => {
            if (userFilter === UserFilterEnum.Olympics) {
                return optionsMarkets.filter((market) => market.customMarket);
            } else {
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
            }
        }, [optionsMarkets, orderDirection, exchangeRates, orderBy]);

        const onClickUserFilter = (filter: UserFilterEnum, isDisabled: boolean) => {
            if (!isDisabled) {
                setUserFilter(userFilter === filter ? UserFilterEnum.All : filter);
            }
            return;
        };

        const resetFilters = () => {
            setPhaseFilter(PhaseFilterEnum.all);
            setUserFilter(UserFilterEnum.All);
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
                                {Object.keys(UserFilterEnum)
                                    .filter((key) => isNaN(Number(UserFilterEnum[key as keyof typeof UserFilterEnum])))
                                    .map((key, index) => {
                                        const isDisabled = !isWalletConnected && index < 4;
                                        return (
                                            <Text
                                                key={key}
                                                onClick={onClickUserFilter.bind(
                                                    this,
                                                    UserFilterEnum[key as keyof typeof UserFilterEnum],
                                                    isDisabled
                                                )}
                                                className={`${
                                                    !isDisabled &&
                                                    userFilter === UserFilterEnum[key as keyof typeof UserFilterEnum]
                                                        ? 'selected'
                                                        : ''
                                                } text-s lh32 pale-grey`}
                                            >
                                                {UserFilterEnum[key as keyof typeof UserFilterEnum]}
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
                            {userFilter !== UserFilterEnum.MyMarkets && (
                                <>
                                    <Text className="text-m bold pale-grey">
                                        {t('options.home.explore-markets.table.no-markets-found')}
                                    </Text>
                                    <Button className="primary" onClick={resetFilters}>
                                        {t('options.home.explore-markets.table.view-all-markets')}
                                    </Button>
                                </>
                            )}
                            {userFilter === UserFilterEnum.MyMarkets && (
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
