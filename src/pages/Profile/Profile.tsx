import PieChartOptionsAllocated from 'components/Charts/PieChartOptionsAllocated';
import ElectionsBanner from 'components/ElectionsBanner';
import Footer from 'components/Footer';
import OpRewardsBanner from 'components/OpRewardsBanner';
import SearchField from 'components/TableInputs/SearchField';
import TableGridSwitch from 'components/TableInputs/TableGridSwitch';
import ThalesBalance from 'components/ThalesBalance/ThalesBalance';
import { USD_SIGN } from 'constants/currency';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
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
import styled from 'styled-components';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import localStore from 'utils/localStore';
import { history } from 'utils/routes';
import Loader from '../../components/Loader';
import { getIsOVM, getIsPolygon } from '../../utils/network';
import History from './components/History/History';
import MaturedPositions from './components/MaturedPositions/MaturedPositions';
import MyPositions from './components/MyPositions/MyPositions';
import Container from './components/styled-components/Layout';
import Wrapper from './components/styled-components/UserData';

enum NavItems {
    MyPositions = 'my-positions',
    MaturedPositions = 'matured-positions',
    History = 'history',
}

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    const [searchAddress, setSearchAddress] = useState<string>('');

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });
    const markets = marketsQuery.isSuccess ? marketsQuery.data : [];
    const rangedMarketsQuery = useRangedMarketsQuery(networkId, { enabled: isAppReady });
    const rangedMarkets = rangedMarketsQuery.isSuccess ? rangedMarketsQuery.data : [];

    const showOPBanner = getIsOVM(networkId);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, markets as any, {
        enabled: isAppReady && markets !== undefined && markets?.length > 0,
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;
    const isPolygon = getIsPolygon(networkId);

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
    const DataForUi = allTxAndDataQuery.isSuccess ? allTxAndDataQuery.data : undefined;

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
                <Container.Fixed>
                    <SearchField
                        placeholder={t('options.trading-profile.search-placeholder')}
                        text={searchText}
                        handleChange={(value) => setSearchText(value)}
                    />
                    <TableGridSwitch
                        value={!isSimpleView}
                        clickEventHandler={tableViewSwitchClickhandler}
                        labels={[t(`options.home.markets-table.menu.grid`), t(`options.home.markets-table.menu.table`)]}
                    />
                </Container.Fixed>
                <Container.Left layout={isSimpleView}>
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
                            {claimable > 0 && (
                                <>
                                    <Notification> {claimable} </Notification>
                                </>
                            )}
                        </NavItem>
                        <NavItem
                            onClick={() => onTabClickHandler(NavItems.History)}
                            className={view === NavItems.History ? 'active' : ''}
                        >
                            {t('options.trading-profile.tabs.history')}
                        </NavItem>
                    </Nav>
                    <LineUnderNav />
                    <ContentWrapper>
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
                                isLoading={userPositionsQuery.isLoading}
                                rangedPositions={userRangePositions.matured}
                            />
                        )}
                        {view === NavItems.History && (
                            <History
                                markets={[...(markets as any), ...(rangedMarkets as any)]}
                                trades={DataForUi ? DataForUi.trades : []}
                                searchText={searchAddress ? '' : searchText}
                                isLoading={allTxAndDataQuery.isLoading}
                            />
                        )}
                    </ContentWrapper>
                </Container.Left>
                <Container.Right layout={isSimpleView}>
                    <PieChartOptionsAllocated
                        claimable={positions.claimableAmount + userRangePositions.claimableAmount}
                    />
                    <Wrapper>
                        <Wrapper.Row>
                            <Wrapper.Label>{t('options.leaderboard.table.netprofit-col')}: </Wrapper.Label>
                            <Wrapper.Value color={DataForUi?.userData.gain > 0 ? '#50ec99' : '#c3244a'}>
                                {formatCurrencyWithSign(USD_SIGN, DataForUi?.userData.profit, 2)}
                            </Wrapper.Value>
                        </Wrapper.Row>
                        <Wrapper.Row>
                            <Wrapper.Label>{t('options.leaderboard.table.gain-col')}: </Wrapper.Label>
                            <Wrapper.Value color={DataForUi?.userData.gain > 0 ? '#50ec99' : '#c3244a'}>
                                {formatCurrencyWithSign('', DataForUi?.userData.gain * 100, 2)}%
                            </Wrapper.Value>
                        </Wrapper.Row>
                        <Wrapper.Row>
                            <Wrapper.Label>{t('options.leaderboard.table.trades-col')}: </Wrapper.Label>
                            <Wrapper.Value>{DataForUi?.userData.trades}</Wrapper.Value>
                        </Wrapper.Row>
                        <Wrapper.Row>
                            <Wrapper.Label>{t('options.leaderboard.table.volume-col')}: </Wrapper.Label>
                            <Wrapper.Value>
                                {formatCurrencyWithSign(USD_SIGN, DataForUi?.userData.volume, 2)}
                            </Wrapper.Value>
                        </Wrapper.Row>
                        <Wrapper.Row>
                            <Wrapper.Label>{t('options.leaderboard.table.investment-col')}: </Wrapper.Label>
                            <Wrapper.Value>
                                {formatCurrencyWithSign(USD_SIGN, DataForUi?.userData.investment, 2)}
                            </Wrapper.Value>
                        </Wrapper.Row>
                        {!isPolygon && (
                            <PriceContainer style={{ maxWidth: isSimpleView ? 500 : 400, marginLeft: 0 }}>
                                <ThalesBalance showTitle={true} />
                            </PriceContainer>
                        )}
                    </Wrapper>
                </Container.Right>
            </Container>
            <Footer />
            {networkId === 1 && <Loader hideMainnet={true} />}
        </>
    );
};

const LineUnderNav = styled.div`
    height: 4px;
    border-radius: 3px;
    background: rgba(100, 217, 254, 0.5);
    width: 100%;
`;

const Nav = styled.div<{ justifyContent: string }>`
    display: flex;
    align-items: center;
    justify-content: ${(_props) => _props.justifyContent};
    @media (max-width: 768px) {
        margin-top: 20px;
    }
`;

const NavItem = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    line-height: 40px;
    font-size: 15px;
    text-transform: uppercase;
    color: var(--primary-color);
    cursor: pointer;
    padding: 0 50px;
    white-space: pre;
    &.active {
        box-shadow: 0px 4px var(--primary-filter-menu-active);
    }
    @media (max-width: 768px) {
        font-size: 14px;
        padding: 0 20px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
        padding: 0;
    }
`;

const Notification = styled.span`
    background: rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    box-shadow: 0px 0px 30px rgb(100 217 254 / 30%);
    border-radius: 30px;
    margin-left: 20px;
    width: 28px;
    text-align: center;
    font-size: 18px;
    line-height: 28px;
    position: relative;
    top: 0px;
    margin-top: 6px;
    margin-bottom: 8px;
    display: inline-block;
    @media (max-width: 512px) {
        font-size: 12px;
        line-height: 20px;
        width: 22px;
        margin-left: 10px;
    }
`;

const ContentWrapper = styled.div`
    width: calc(100% + 100px);
    padding-right: 50px;
    max-height: 870px;
    overflow: hidden;
    overflow-y: auto;
    padding-left: 50px;
    position: relative;
    left: -50px;
    padding-bottom: 40px;
    height: 100%;
`;

const PriceContainer = styled.div`
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    margin-top: 20px;
`;

export default Profile;
