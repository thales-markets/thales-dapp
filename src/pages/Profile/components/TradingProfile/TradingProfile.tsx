import { USD_SIGN } from 'constants/currency';
import { MARKET_DURATION_IN_DAYS } from 'constants/options';
import { millisecondsToSeconds } from 'date-fns';
import { Positions } from 'enums/options';
import {
    Nav,
    NavItem,
    Notification,
    StatsContainer,
    StatsItem,
    StatsLabel,
    StatsValue,
} from 'pages/Profile/styled-components';
import useUserActiveChainedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveChainedSpeedMarketsDataQuery';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import usePythPriceQueries from 'queries/prices/usePythPriceQueries';
import useProfileDataQuery from 'queries/profile/useProfileDataQuery';
import useUserNotificationsQuery from 'queries/user/useUserNotificationsQuery';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { formatCurrencyWithSign, formatPercentage } from 'thales-utils';
import { UserProfileData } from 'types/profile';
import { ThemeInterface } from 'types/ui';
import { getPriceId } from 'utils/pyth';
import { history } from 'utils/routes';
import ClaimablePositions from '../ClaimablePositions';
import OpenPositions from '../OpenPositions';
import PositionHistory from '../PositionHistory';
import ProfileSection from '../ProfileSection';
import TransactionHistory from '../TransactionHistory';
import UserVaultsLp from '../UserVaultsLp';

enum NavItems {
    MyPositions = 'my-positions',
    History = 'history',
    VaultsLp = 'vaults-lp',
}

type TradingProfileProps = {
    searchText: string;
};

const TradingProfile: React.FC<TradingProfileProps> = ({ searchText }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [searchAddress, setSearchAddress] = useState<string>('');

    useEffect(() => {
        if (searchText.startsWith('0x') && searchText?.length == 42) {
            setSearchAddress(searchText.toLowerCase());
        } else {
            setSearchAddress('');
        }
    }, [searchText]);

    const notificationsQuery = useUserNotificationsQuery(networkId, searchAddress || walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const notifications = notificationsQuery.isSuccess && notificationsQuery.data ? notificationsQuery.data : 0;

    const userActiveSpeedMarketsDataQuery = useUserActiveSpeedMarketsDataQuery(
        networkId,
        searchAddress || walletAddress,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );
    const speedMarketsNotifications =
        userActiveSpeedMarketsDataQuery.isSuccess && userActiveSpeedMarketsDataQuery.data
            ? userActiveSpeedMarketsDataQuery.data.filter((marketData) => marketData.claimable).length
            : 0;

    const userActiveChainedSpeedMarketsDataQuery = useUserActiveChainedSpeedMarketsDataQuery(
        networkId,
        searchAddress || walletAddress,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );
    const userActiveChainedSpeedMarketsData =
        userActiveChainedSpeedMarketsDataQuery.isSuccess && userActiveChainedSpeedMarketsDataQuery.data
            ? userActiveChainedSpeedMarketsDataQuery.data
            : [];

    // Prepare active chained speed markets that become matured to fetch Pyth prices
    const maturedChainedMarkets = userActiveChainedSpeedMarketsData
        .filter((marketData) => marketData.isMatured)
        .map((marketData) => {
            const strikeTimes = marketData.strikeTimes.map((strikeTime) => millisecondsToSeconds(strikeTime));
            return {
                ...marketData,
                strikeTimes,
                pythPriceId: getPriceId(networkId, marketData.currencyKey),
            };
        });

    const priceRequests = maturedChainedMarkets
        .map((data) =>
            data.strikeTimes.map((strikeTime) => ({
                priceId: data.pythPriceId,
                publishTime: strikeTime,
                market: data.address,
            }))
        )
        .flat();
    const pythPricesQueries = usePythPriceQueries(networkId, priceRequests, { enabled: priceRequests.length > 0 });
    const pythPricesWithMarket = priceRequests.map((request, i) => ({
        market: request.market,
        price: pythPricesQueries[i]?.data || 0,
    }));

    // Based on Pyth prices determine if chained position is claimable
    const chainedSpeedMarketsNotifications = maturedChainedMarkets
        .map((marketData) => {
            const finalPrices = marketData.strikeTimes.map(
                (_, i) => pythPricesWithMarket.filter((pythPrice) => pythPrice.market === marketData.address)[i].price
            );
            const strikePrices = marketData.strikePrices.map((strikePrice, i) =>
                i > 0 ? finalPrices[i - 1] : strikePrice
            );
            const userWonStatuses = marketData.sides.map((side, i) =>
                finalPrices[i] > 0 && strikePrices[i] > 0
                    ? (side === Positions.UP && finalPrices[i] > strikePrices[i]) ||
                      (side === Positions.DOWN && finalPrices[i] < strikePrices[i])
                    : undefined
            );
            const claimable = userWonStatuses.every((status) => status);

            return { ...marketData, finalPrices, claimable };
        })
        .filter((marketData) => marketData.claimable).length;

    const totalNotifications = notifications + speedMarketsNotifications + chainedSpeedMarketsNotifications;

    const userProfileDataQuery = useProfileDataQuery(networkId, searchAddress || walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const profileData: UserProfileData =
        userProfileDataQuery.isSuccess && userProfileDataQuery.data
            ? userProfileDataQuery.data
            : {
                  profit: 0,
                  volume: 0,
                  numberOfTrades: 0,
                  gain: 0,
                  investment: 0,
              };

    const queryParamTab = queryString.parse(location.search).tab as NavItems;
    const [view, setView] = useState(
        Object.values(NavItems).includes(queryParamTab) ? queryParamTab : NavItems.MyPositions
    );

    useEffect(() => {
        if (searchText.startsWith('0x') && searchText?.length == 42) {
            setSearchAddress(searchText.toLowerCase());
        } else {
            setSearchAddress('');
        }
    }, [searchText]);

    const onTabClickHandler = (tab: NavItems) => {
        history.push({
            pathname: location.pathname,
            search: queryString.stringify({ tab }),
        });
        setView(tab);
    };

    return (
        <>
            <StatsContainer>
                <StatsItem>
                    <StatsLabel>{t('profile.leaderboard.table.netprofit-col')}:</StatsLabel>
                    <StatsValue
                        color={
                            profileData.profit > 0
                                ? theme.textColor.quaternary
                                : profileData.profit < 0
                                ? theme.textColor.tertiary
                                : theme.textColor.primary
                        }
                    >
                        {userProfileDataQuery.isLoading ? '-' : formatCurrencyWithSign(USD_SIGN, profileData.profit, 2)}
                    </StatsValue>
                </StatsItem>
                <StatsItem>
                    <StatsLabel>{t('profile.leaderboard.table.gain-col')}:</StatsLabel>
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
                    <StatsLabel>{t('profile.leaderboard.table.trades-col')}:</StatsLabel>
                    <StatsValue>{userProfileDataQuery.isLoading ? '-' : profileData.numberOfTrades}</StatsValue>
                </StatsItem>
                <StatsItem>
                    <StatsLabel>{t('profile.leaderboard.table.volume-col')}:</StatsLabel>
                    <StatsValue>
                        {userProfileDataQuery.isLoading ? '-' : formatCurrencyWithSign(USD_SIGN, profileData.volume, 2)}
                    </StatsValue>
                </StatsItem>
            </StatsContainer>
            <Nav>
                <NavItem onClick={() => onTabClickHandler(NavItems.MyPositions)} active={view === NavItems.MyPositions}>
                    {t('profile.tabs.my-positions')}
                    {totalNotifications > 0 && <Notification>{totalNotifications}</Notification>}
                </NavItem>
                <NavItem onClick={() => onTabClickHandler(NavItems.History)} active={view === NavItems.History}>
                    {t('profile.tabs.history')}
                </NavItem>
                <NavItem onClick={() => onTabClickHandler(NavItems.VaultsLp)} active={view === NavItems.VaultsLp}>
                    {t('profile.tabs.vaults-lp')}
                </NavItem>
            </Nav>
            <>
                {view === NavItems.MyPositions && (
                    <>
                        <ProfileSection
                            title={t('profile.accordions.claimable-positions')}
                            subtitle={t('profile.winnings-are-forfeit', { days: MARKET_DURATION_IN_DAYS })}
                            mobileMaxHeight="360px"
                        >
                            <ClaimablePositions
                                searchAddress={searchAddress}
                                searchText={searchAddress ? '' : searchText}
                            />
                        </ProfileSection>
                        <ProfileSection title={t('profile.accordions.open-positions')} mobileMaxHeight="360px">
                            <OpenPositions searchAddress={searchAddress} searchText={searchAddress ? '' : searchText} />
                        </ProfileSection>
                    </>
                )}
                {view === NavItems.History && (
                    <>
                        <ProfileSection
                            title={t('profile.accordions.transaction-history')}
                            subtitle={t('profile.history-limit', { days: MARKET_DURATION_IN_DAYS })}
                        >
                            <TransactionHistory
                                searchAddress={searchAddress}
                                searchText={searchAddress ? '' : searchText}
                            />
                        </ProfileSection>
                        <ProfileSection
                            title={t('profile.accordions.position-history')}
                            subtitle={t('profile.history-limit', { days: MARKET_DURATION_IN_DAYS })}
                        >
                            <PositionHistory
                                searchAddress={searchAddress}
                                searchText={searchAddress ? '' : searchText}
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
        </>
    );
};

export default TradingProfile;
