import PieChartOptionsAllocated from 'components/Charts/PieChartOptionsAllocated';
import ElectionsBanner from 'components/ElectionsBanner';
import Footer from 'components/Footer';
import OpRewardsBanner from 'components/OpRewardsBanner';
import SearchInput from 'components/SearchInput/SearchInput';
import TableGridSwitch from 'components/TableGridSwitch';
import ThalesBalance from 'components/ThalesBalance/ThalesBalance';
import { USD_SIGN } from 'constants/currency';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useAllPositions from 'queries/user/useAllPositions';
import useCalculateDataQuery from 'queries/user/useCalculateDataQuery';
import useRangedPositions from 'queries/user/useRangedPositions';
import queryString from 'query-string';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import localStore from 'utils/localStore';
import { history } from 'utils/routes';
import { getIsOVM, getIsPolygon } from '../../utils/network';
import History from './components/History/History';
import MaturedPositions from './components/MaturedPositions/MaturedPositions';
import MyPositions from './components/MyPositions/MyPositions';
import {
    Container,
    ContainerFixed,
    ContainerLeft,
    ContainerRight,
    ContentWrapper,
    Label,
    Nav,
    NavItem,
    Notification,
    PriceContainer,
    Row,
    Value,
    Wrapper,
} from './styled-components';

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

    const [searchAddress, setSearchAddress] = useState<string>('');

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });
    const markets = marketsQuery.isSuccess ? marketsQuery.data : [];

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, markets as any, {
        enabled: isAppReady && markets !== undefined && markets?.length > 0,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const userPositionsQuery = useAllPositions(networkId, (searchAddress ? searchAddress : walletAddress) as any, {
        enabled: isAppReady && walletAddress !== null,
    });

    const positions = userPositionsQuery.isSuccess
        ? userPositionsQuery.data
        : { claimable: 0, claimableAmount: 0, matured: [], live: [], claimed: [] };

    const userRangePositionsQuery = useRangedPositions(
        networkId,
        (searchAddress ? searchAddress : walletAddress) as any,
        {
            enabled: isAppReady && walletAddress !== null,
        }
    );

    const userRangePositions = userRangePositionsQuery.isSuccess
        ? userRangePositionsQuery.data
        : { claimable: 0, claimableAmount: 0, matured: [], live: [], claimed: [] };

    const allTxAndDataQuery = useCalculateDataQuery(networkId, (searchAddress ? searchAddress : walletAddress) as any, {
        enabled: isAppReady && walletAddress !== null,
    });
    const dataForUI = allTxAndDataQuery.isSuccess ? allTxAndDataQuery.data : undefined;

    const tableViewStorageKey = LOCAL_STORAGE_KEYS.PROFILE_TABLE_VIEW + networkId;
    const tableViewLocalStorageValue: boolean = localStore.get(tableViewStorageKey) || false;

    const [isSimpleView, setSimpleView] = useState<boolean>(!tableViewLocalStorageValue);
    const [searchText, setSearchText] = useState('');
    const queryParamTab = queryString.parse(location.search).tab as NavItems;
    const [view, setView] = useState(
        Object.values(NavItems).includes(queryParamTab) ? queryParamTab : NavItems.MyPositions
    );

    const tableViewSwitchClickhandler = () => {
        setSimpleView(!isSimpleView);
        localStore.set(tableViewStorageKey, isSimpleView);
    };

    const showOPBanner = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);

    const claimable = useMemo(() => {
        return positions.claimable + userRangePositions.claimable;
    }, [positions, userRangePositions]);

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
            <Container layout={isSimpleView}>
                <ContainerFixed>
                    <SearchInput
                        placeholder={t('options.trading-profile.search-placeholder')}
                        text={searchText}
                        handleChange={(value) => setSearchText(value)}
                    />
                    <TableGridSwitch
                        value={!isSimpleView}
                        clickEventHandler={tableViewSwitchClickhandler}
                        labels={[t(`options.home.markets-table.menu.grid`), t(`options.home.markets-table.menu.table`)]}
                    />
                </ContainerFixed>
                <ContainerLeft layout={isSimpleView}>
                    <Nav justifyContent={isSimpleView ? 'space-between' : 'flex-start'}>
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
                            {claimable > 0 && <Notification> {claimable} </Notification>}
                        </NavItem>
                        <NavItem
                            onClick={() => onTabClickHandler(NavItems.History)}
                            className={view === NavItems.History ? 'active' : ''}
                        >
                            {t('options.trading-profile.tabs.history')}
                        </NavItem>
                    </Nav>
                    <ContentWrapper isScrollable={isSimpleView || view === NavItems.History}>
                        {view === NavItems.MyPositions && (
                            <MyPositions
                                isSimpleView={isSimpleView}
                                exchangeRates={exchangeRates}
                                positions={positions.live}
                                rangedPositions={userRangePositions.live}
                                searchText={searchAddress ? '' : searchText}
                                isLoading={userPositionsQuery.isLoading}
                            />
                        )}
                        {view === NavItems.MaturedPositions && (
                            <MaturedPositions
                                isSimpleView={isSimpleView}
                                positions={positions.matured}
                                claimed={positions.claimed}
                                claimedRange={userRangePositions.claimed}
                                searchText={searchAddress ? '' : searchText}
                                isLoading={userPositionsQuery.isLoading || userRangePositionsQuery.isLoading}
                                rangedPositions={userRangePositions.matured}
                            />
                        )}
                        {view === NavItems.History && (
                            <History
                                markets={[...(markets as any)]}
                                trades={dataForUI ? dataForUI.trades : []}
                                searchText={searchAddress ? '' : searchText}
                                isLoading={allTxAndDataQuery.isLoading || marketsQuery.isLoading}
                            />
                        )}
                    </ContentWrapper>
                </ContainerLeft>
                <ContainerRight layout={isSimpleView}>
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
                </ContainerRight>
            </Container>
            <Footer />
        </>
    );
};

export default Profile;
