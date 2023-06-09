import ElectionsBanner from 'components/ElectionsBanner';
import Footer from 'components/Footer';
import SearchInput from 'components/SearchInput/SearchInput';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useAllPositions from 'queries/user/useAllPositions';
import useUserProfileDataQuery from 'queries/user/useUserProfileDataQuery';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { history } from 'utils/routes';
import {
    Container,
    Header,
    MainContainer,
    Nav,
    NavItem,
    Notification,
    StatsContainer,
    StatsItem,
    StatsLabel,
    StatsValue,
    Title,
} from './styled-components';
import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import BannerCarousel from 'pages/Trade/components/BannerCarousel';
import ClaimablePositions from './components/ClaimablePositions';
import PositionHistory from './components/PositionHistory';
import TransactionHistory from './components/TransactionHistory';
import OpenPositions from './components/OpenPositions';
import { UserPositionsData, UserProfileData } from 'types/options';
import ProfileSection from './components/ProfileSection';
import UserVaultsLp from './components/UserVaultsLp';

enum NavItems {
    MyPositions = 'my-positions',
    History = 'history',
    VaultsLp = 'vaults-lp',
}

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [searchAddress, setSearchAddress] = useState<string>('');

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });
    const markets = marketsQuery.isSuccess && marketsQuery.data ? marketsQuery.data : [];

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, markets as any, {
        enabled: isAppReady && markets.length > 0,
    });
    const exchangeRates =
        exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data
            ? exchangeRatesMarketDataQuery.data
            : null;

    const userPositionsQuery = useAllPositions(networkId, (searchAddress ? searchAddress : walletAddress) as any, {
        enabled: isAppReady && isWalletConnected,
    });

    const positions: UserPositionsData =
        userPositionsQuery.isSuccess && userPositionsQuery.data
            ? userPositionsQuery.data
            : {
                  live: [],
                  claimable: [],
                  claimed: [],
                  rip: [],
                  claimableCount: 0,
                  claimableAmount: 0,
              };

    const userProfileDataQuery = useUserProfileDataQuery(
        networkId,
        (searchAddress ? searchAddress : walletAddress) as any,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );
    const profileData: UserProfileData =
        userProfileDataQuery.isSuccess && userProfileDataQuery.data
            ? userProfileDataQuery.data
            : {
                  trades: [],
                  profit: 0,
                  volume: 0,
                  numberOfTrades: 0,
                  gain: 0,
                  investment: 0,
              };

    const [searchText, setSearchText] = useState('');
    const queryParamTab = queryString.parse(location.search).tab as NavItems;
    const [view, setView] = useState(
        Object.values(NavItems).includes(queryParamTab) ? queryParamTab : NavItems.MyPositions
    );

    useEffect(() => {
        if (searchText.startsWith('0x') && searchText?.length == 42) {
            setSearchAddress(searchText.toLowerCase());
        }

        if (searchText == '') {
            setSearchAddress('');
        }
    }, [searchText, searchAddress]);

    useEffect(() => {
        if (searchAddress?.toLowerCase() !== searchText?.toLowerCase() && searchText !== '') {
            setSearchAddress('');
        }
    }, [searchAddress]);

    const onTabClickHandler = (tab: NavItems) => {
        history.push({
            pathname: location.pathname,
            search: queryString.stringify({ tab }),
        });
        setView(tab);
    };

    return (
        <>
            <ElectionsBanner />
            <BannerCarousel />
            <Container>
                <Header>
                    <Title>{t('options.trading-profile.title')}</Title>
                    <SearchInput
                        placeholder={t('options.trading-profile.search-placeholder')}
                        text={searchText}
                        handleChange={(value) => setSearchText(value)}
                        width="300px"
                        height="28px"
                        iconTop="6px"
                    />
                </Header>
                <MainContainer>
                    <StatsContainer>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.netprofit-col')}:</StatsLabel>
                            <StatsValue
                                color={
                                    profileData.profit > 0
                                        ? theme.textColor.quaternary
                                        : profileData.profit < 0
                                        ? theme.textColor.tertiary
                                        : theme.textColor.primary
                                }
                            >
                                {userProfileDataQuery.isLoading
                                    ? '-'
                                    : formatCurrencyWithSign(USD_SIGN, profileData.profit, 2)}
                            </StatsValue>
                        </StatsItem>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.gain-col')}:</StatsLabel>
                            <StatsValue
                                color={
                                    profileData.gain > 0
                                        ? theme.textColor.quaternary
                                        : profileData.gain < 0
                                        ? theme.textColor.tertiary
                                        : theme.textColor.primary
                                }
                            >
                                {userProfileDataQuery.isLoading ? '-' : formatPercentage(profileData.gain)}
                            </StatsValue>
                        </StatsItem>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.trades-col')}:</StatsLabel>
                            <StatsValue>{userProfileDataQuery.isLoading ? '-' : profileData.numberOfTrades}</StatsValue>
                        </StatsItem>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.volume-col')}:</StatsLabel>
                            <StatsValue>
                                {userProfileDataQuery.isLoading
                                    ? '-'
                                    : formatCurrencyWithSign(USD_SIGN, profileData.volume, 2)}
                            </StatsValue>
                        </StatsItem>
                    </StatsContainer>
                    <Nav>
                        <NavItem
                            onClick={() => onTabClickHandler(NavItems.MyPositions)}
                            active={view === NavItems.MyPositions}
                        >
                            {t('options.trading-profile.tabs.my-positions')}
                            {positions.claimableCount > 0 && <Notification> {positions.claimableCount} </Notification>}
                        </NavItem>
                        <NavItem onClick={() => onTabClickHandler(NavItems.History)} active={view === NavItems.History}>
                            {t('options.trading-profile.tabs.history')}
                        </NavItem>
                        <NavItem
                            onClick={() => onTabClickHandler(NavItems.VaultsLp)}
                            active={view === NavItems.VaultsLp}
                        >
                            {t('options.trading-profile.tabs.vaults-lp')}
                        </NavItem>
                    </Nav>
                    <>
                        {view === NavItems.MyPositions && (
                            <>
                                <ProfileSection
                                    title={t('options.trading-profile.accordions.claimable-positions')}
                                    mobileMaxHeight="360px"
                                >
                                    <ClaimablePositions
                                        claimablePositions={positions.claimable}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={userPositionsQuery.isLoading}
                                    />
                                </ProfileSection>
                                <ProfileSection
                                    title={t('options.trading-profile.accordions.open-positions')}
                                    mobileMaxHeight="360px"
                                >
                                    <OpenPositions
                                        exchangeRates={exchangeRates}
                                        livePositions={positions.live}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={userPositionsQuery.isLoading}
                                    />
                                </ProfileSection>
                            </>
                        )}
                        {view === NavItems.History && (
                            <>
                                <ProfileSection title={t('options.trading-profile.accordions.position-history')}>
                                    <PositionHistory
                                        claimedPositions={positions.claimed}
                                        ripPositions={positions.rip}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={userPositionsQuery.isLoading}
                                    />
                                </ProfileSection>
                                <ProfileSection title={t('options.trading-profile.accordions.transaction-history')}>
                                    <TransactionHistory
                                        markets={markets}
                                        trades={profileData.trades}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={userProfileDataQuery.isLoading || marketsQuery.isLoading}
                                    />
                                </ProfileSection>
                            </>
                        )}
                        {view === NavItems.VaultsLp && (
                            <>
                                <UserVaultsLp />
                            </>
                        )}
                    </>
                </MainContainer>
            </Container>
            <Footer />
        </>
    );
};

export default Profile;
