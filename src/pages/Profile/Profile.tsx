import PieChartOptionsAllocated from 'components/Charts/PieChartOptionsAllocated';
import SearchField from 'components/TableInputs/SearchField';
import TableGridSwitch from 'components/TableInputs/TableGridSwitch';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useAllPositions from 'queries/user/useAllPositions';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import MaturedPositions from './components/MaturedPositions/MaturedPositions';
import MyPositions from './components/MyPositions/MyPositions';
import History from './components/History/History';
import Wrapper from './components/styled-components/UserData';
import Container from './components/styled-components/Layout';
import useCalculateDataQuery from 'queries/user/useCalculateDataQuery';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import ThalesBalance from 'components/ThalesBalance/ThalesBalance';
import Loader from '../../components/Loader';
import { getIsPolygon } from '../../utils/network';
import useRangedPositions from 'queries/user/useRangedPositions';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';

enum NavItems {
    MyPositions = 'My Positions',
    MaturedPositions = 'Matured Positions',
    History = 'History',
}

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });
    const markets = marketsQuery.isSuccess ? marketsQuery.data : undefined;
    const rangedMarketsQuery = useRangedMarketsQuery(networkId, { enabled: isAppReady });
    const rangedMarkets = rangedMarketsQuery.isSuccess ? rangedMarketsQuery.data : [];
    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, markets as any, {
        enabled: isAppReady && markets !== undefined && markets?.length > 0,
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;
    const isPolygon = getIsPolygon(networkId);

    const userPositionsQuery = useAllPositions(networkId, walletAddress as any, {
        enabled: isAppReady && walletAddress !== null,
    });

    const positions = userPositionsQuery.isSuccess
        ? userPositionsQuery.data
        : { claimable: 0, claimableAmount: 0, matured: [], live: [], claimed: [] };

    const userRangePositionsQuery = useRangedPositions(networkId, walletAddress as any, {
        enabled: isAppReady && walletAddress !== null,
    });

    const userRangePositions = userRangePositionsQuery.isSuccess
        ? userRangePositionsQuery.data
        : { claimable: 0, claimableAmount: 0, matured: [], live: [], claimed: [] };

    const allTxAndDataQuery = useCalculateDataQuery(networkId, walletAddress as any, { enabled: isAppReady });
    const DataForUi = allTxAndDataQuery.isSuccess ? allTxAndDataQuery.data : undefined;

    const [isSimpleView, setSimpleView] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [view, setView] = useState(NavItems.MyPositions);

    const claimable = useMemo(() => {
        return positions.claimable + userRangePositions.claimable;
    }, [positions, userRangePositions]);
    console.log(positions, userRangePositions);

    return (
        <>
            <Container layout={isSimpleView}>
                <Container.Fixed>
                    <SearchField
                        placeholder={t('options.trading-profile.search-placeholder')}
                        text={searchText}
                        handleChange={(value) => setSearchText(value)}
                    />
                    <TableGridSwitch
                        value={!isSimpleView}
                        clickEventHandler={setSimpleView.bind(this, !isSimpleView)}
                        labels={['Grid', 'Table']}
                    />
                </Container.Fixed>
                <Container.Left layout={isSimpleView}>
                    <Nav justifyContent={isSimpleView ? 'space-between' : 'flex-start'}>
                        <NavItem
                            onClick={setView.bind(this, NavItems.MyPositions)}
                            className={view === NavItems.MyPositions ? 'active' : ''}
                        >
                            {NavItems.MyPositions}
                        </NavItem>
                        <NavItem
                            onClick={setView.bind(this, NavItems.MaturedPositions)}
                            className={view === NavItems.MaturedPositions ? 'active' : ''}
                        >
                            {NavItems.MaturedPositions}
                            {claimable > 0 && (
                                <>
                                    <Notification> {claimable} </Notification>
                                </>
                            )}
                        </NavItem>
                        <NavItem
                            onClick={setView.bind(this, NavItems.History)}
                            className={view === NavItems.History ? 'active' : ''}
                        >
                            {NavItems.History}
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
                                searchText={searchText}
                                isLoading={userPositionsQuery.isLoading}
                            />
                        )}
                        {view === NavItems.MaturedPositions && (
                            <MaturedPositions
                                isSimpleView={isSimpleView}
                                positions={positions.matured}
                                claimed={positions.claimed}
                                claimedRange={userRangePositions.claimed}
                                searchText={searchText}
                                isLoading={userPositionsQuery.isLoading}
                                rangedPositions={userRangePositions.matured}
                            />
                        )}
                        {view === NavItems.History && (
                            <History
                                markets={[...(markets as any), ...(rangedMarkets as any)]}
                                trades={DataForUi ? DataForUi.trades : []}
                                searchText={searchText}
                                isLoading={allTxAndDataQuery.isLoading}
                            />
                        )}
                    </ContentWrapper>
                </Container.Left>
                <Container.Right layout={isSimpleView}>
                    <PieChartOptionsAllocated claimable={positions.claimableAmount} />
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
