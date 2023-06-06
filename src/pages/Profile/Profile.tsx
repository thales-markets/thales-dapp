import ElectionsBanner from 'components/ElectionsBanner';
import Footer from 'components/Footer';
import OpRewardsBanner from 'components/OpRewardsBanner';
import SearchInput from 'components/SearchInput/SearchInput';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useAllPositions, { UserPositionsData } from 'queries/user/useAllPositions';
import useCalculateDataQuery from 'queries/user/useCalculateDataQuery';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { history } from 'utils/routes';
import { getIsOVM } from '../../utils/network';
import History from './components/History/History';
import MyPositions from './components/MyPositions/MyPositions';
import {
    Container,
    ContainerFixed,
    ContainerLeft,
    ContentWrapper,
    Nav,
    NavItem,
    Notification,
    StatsContainer,
    StatsItem,
    StatsLabel,
    StatsValue,
} from './styled-components';
import PositionHistory from './components/History copy/PositionHistory';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import MyClaimablePositions from './components/MyPositions copy/MyClaimablePositions';
import { Title } from './components/styled-components';

enum NavItems {
    MyPositions = 'my-positions',
    MaturedPositions = 'matured-positions',
    History = 'history',
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

    const allTxAndDataQuery = useCalculateDataQuery(networkId, (searchAddress ? searchAddress : walletAddress) as any, {
        enabled: isAppReady && walletAddress !== null,
    });
    const dataForUI = allTxAndDataQuery.isSuccess ? allTxAndDataQuery.data : undefined;

    const [searchText, setSearchText] = useState('');
    const queryParamTab = queryString.parse(location.search).tab as NavItems;
    const [view, setView] = useState(
        Object.values(NavItems).includes(queryParamTab) ? queryParamTab : NavItems.MyPositions
    );

    const showOPBanner = getIsOVM(networkId);

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
            {showOPBanner && <OpRewardsBanner />}
            <ElectionsBanner />
            <Container>
                <ContainerFixed>
                    <SearchInput
                        placeholder={t('options.trading-profile.search-placeholder')}
                        text={searchText}
                        handleChange={(value) => setSearchText(value)}
                    />
                </ContainerFixed>
                <ContainerLeft>
                    <StatsContainer>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.netprofit-col')}:</StatsLabel>
                            <StatsValue
                                color={
                                    dataForUI?.userData.profit === 0
                                        ? theme.textColor.primary
                                        : dataForUI?.userData.profit > 0
                                        ? theme.textColor.quaternary
                                        : theme.textColor.tertiary
                                }
                            >
                                {formatCurrencyWithSign(USD_SIGN, dataForUI?.userData.profit, 2)}
                            </StatsValue>
                        </StatsItem>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.gain-col')}:</StatsLabel>
                            <StatsValue
                                color={
                                    dataForUI?.userData.gain === 0
                                        ? theme.textColor.primary
                                        : dataForUI?.userData.gain > 0
                                        ? theme.textColor.quaternary
                                        : theme.textColor.tertiary
                                }
                            >
                                {formatCurrencyWithSign('', dataForUI?.userData.gain * 100, 2)}%
                            </StatsValue>
                        </StatsItem>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.trades-col')}:</StatsLabel>
                            <StatsValue>{dataForUI?.userData.trades}</StatsValue>
                        </StatsItem>
                        <StatsItem>
                            <StatsLabel>{t('options.leaderboard.table.volume-col')}:</StatsLabel>
                            <StatsValue>{formatCurrencyWithSign(USD_SIGN, dataForUI?.userData.volume, 2)}</StatsValue>
                        </StatsItem>
                    </StatsContainer>
                    <Nav justifyContent={'space-between'}>
                        <NavItem
                            onClick={() => onTabClickHandler(NavItems.MyPositions)}
                            className={view === NavItems.MyPositions ? 'active' : ''}
                        >
                            {t('options.trading-profile.tabs.my-positions')}
                        </NavItem>
                        <NavItem
                            onClick={() => onTabClickHandler(NavItems.MaturedPositions)}
                            className={view === NavItems.MaturedPositions ? 'active' : ''}
                        >
                            {t('options.trading-profile.tabs.matured-positions')}
                            {positions.claimableCount > 0 && <Notification> {positions.claimableCount} </Notification>}
                        </NavItem>
                        <NavItem
                            onClick={() => onTabClickHandler(NavItems.History)}
                            className={view === NavItems.History ? 'active' : ''}
                        >
                            {t('options.trading-profile.tabs.history')}
                        </NavItem>
                    </Nav>
                    <>
                        {view === NavItems.MyPositions && (
                            <>
                                <ContentWrapper isScrollable={true}>
                                    <Title>Claimable positions</Title>
                                    <MyClaimablePositions
                                        exchangeRates={exchangeRates}
                                        livePositions={positions.claimable}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={userPositionsQuery.isLoading}
                                    />
                                </ContentWrapper>
                                <ContentWrapper isScrollable={true}>
                                    <Title>Open positions</Title>
                                    <MyPositions
                                        exchangeRates={exchangeRates}
                                        livePositions={positions.live}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={userPositionsQuery.isLoading}
                                    />
                                </ContentWrapper>
                            </>
                        )}
                        {/* {view === NavItems.MaturedPositions && (
                            <MaturedPositions
                                isSimpleView={true}
                                positions={positions.matured}
                                claimed={positions.claimed}
                                claimedRange={userRangePositions.claimed}
                                searchText={searchAddress ? '' : searchText}
                                isLoading={userPositionsQuery.isLoading || userRangePositionsQuery.isLoading}
                                rangedPositions={userRangePositions.matured}
                            />
                        )} */}
                        {view === NavItems.History && (
                            <>
                                <ContentWrapper isScrollable={true}>
                                    <Title>Position history</Title>
                                    <PositionHistory
                                        claimedPositions={positions.claimed}
                                        ripPositions={positions.rip}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={userPositionsQuery.isLoading}
                                    />
                                </ContentWrapper>
                                <ContentWrapper isScrollable={true}>
                                    <Title>Transaction history</Title>
                                    <History
                                        markets={[...(markets as any)]}
                                        trades={dataForUI ? dataForUI.trades : []}
                                        searchText={searchAddress ? '' : searchText}
                                        isLoading={allTxAndDataQuery.isLoading || marketsQuery.isLoading}
                                    />
                                </ContentWrapper>
                            </>
                        )}
                    </>
                </ContainerLeft>
                {/* <ContainerRight layout={isSimpleView}>
                    <PieChartOptionsAllocated
                        claimable={positions.claimableAmount + userRangePositions.claimableAmount}
                    />
                    <Wrapper>
                        <Row>
                            <Label>{t('options.leaderboard.table.netprofit-col')}: </Label>
                            <Value
                                color={
                                    dataForUI?.userData.profit === 0
                                        ? theme.textColor.primary
                                        : dataForUI?.userData.profit > 0
                                        ? theme.textColor.quaternary
                                        : theme.textColor.tertiary
                                }
                            >
                                {formatCurrencyWithSign(USD_SIGN, dataForUI?.userData.profit, 2)}
                            </Value>
                        </Row>
                        <Row>
                            <Label>{t('options.leaderboard.table.gain-col')}: </Label>
                            <Value
                                color={
                                    dataForUI?.userData.gain === 0
                                        ? theme.textColor.primary
                                        : dataForUI?.userData.gain > 0
                                        ? theme.textColor.quaternary
                                        : theme.textColor.tertiary
                                }
                            >
                                {formatCurrencyWithSign('', dataForUI?.userData.gain * 100, 2)}%
                            </Value>
                        </Row>
                        <Row>
                            <Label>{t('options.leaderboard.table.trades-col')}: </Label>
                            <Value>{dataForUI?.userData.trades}</Value>
                        </Row>
                        <Row>
                            <Label>{t('options.leaderboard.table.volume-col')}: </Label>
                            <Value>{formatCurrencyWithSign(USD_SIGN, dataForUI?.userData.volume, 2)}</Value>
                        </Row>
                        <Row>
                            <Label>{t('options.leaderboard.table.investment-col')}: </Label>
                            <Value>{formatCurrencyWithSign(USD_SIGN, dataForUI?.userData.investment, 2)}</Value>
                        </Row>
                        {!isPolygon && (
                            <PriceContainer style={{ maxWidth: isSimpleView ? 500 : 400, marginLeft: 0 }}>
                                <ThalesBalance showTitle={true} />
                            </PriceContainer>
                        )}
                    </Wrapper>
                </ContainerRight> */}
            </Container>
            <Footer />
        </>
    );
};

export default Profile;
