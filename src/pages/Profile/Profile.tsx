import PieChartOptionsAllocated from 'components/Charts/PieChartOptionsAllocated';
import SearchField from 'pages/Markets/components/Input/SearchField';
import TableGridSwitch from 'pages/Markets/components/Input/TableGridSwitch';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useAllPositions from 'queries/user/useAllPositions';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import MaturedPositions from './components/MaturedPositions/MaturedPositions';
import MyPositions from './components/MyPositions/MyPositions';
import History from './components/History/History';

enum NavItems {
    MyPositions = 'My Positions',
    MaturedPositions = 'Matured Positions',
    History = 'History',
}

const Profile: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });
    const markets = marketsQuery.isSuccess ? marketsQuery.data : undefined;
    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, markets as any, {
        enabled: isAppReady && markets !== undefined && markets?.length > 0,
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const userPositionsQuery = useAllPositions(networkId, walletAddress as any, {
        enabled: isAppReady && walletAddress !== null,
    });

    const positions = userPositionsQuery.isSuccess
        ? userPositionsQuery.data
        : { claimable: undefined, claimableAmount: undefined, allocated: undefined, matured: [], live: [] };

    const [isSimpeView, setSimpleView] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [view, setView] = useState(NavItems.MyPositions);

    return (
        <Container>
            <ContainerFixed>
                <PageTitle>Trading Profile</PageTitle>
                <SearchField text={searchText} handleChange={(value) => setSearchText(value)} />
                <TableGridSwitch
                    value={!isSimpeView}
                    clickEventHandler={setSimpleView.bind(this, !isSimpeView)}
                    labels={['Simple View', 'In Depth View']}
                />
            </ContainerFixed>
            <ContainerLeft>
                <Nav>
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
                        {positions.claimable && positions.claimable > 0 && (
                            <Notification> {positions.claimable} </Notification>
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
                        <MyPositions exchangeRates={exchangeRates} positions={positions.live} />
                    )}
                    {view === NavItems.MaturedPositions && (
                        <MaturedPositions exchangeRates={exchangeRates} positions={positions.matured} />
                    )}
                    {view === NavItems.History && <History markets={markets} />}
                </ContentWrapper>
            </ContainerLeft>
            <ContainerRight>
                <PieChartOptionsAllocated claimable={positions.claimableAmount} allocated={positions.allocated} />
            </ContainerRight>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    margin-top: 20px;
`;

const ContainerFixed = styled.div`
    height: 130px;
    display: flex;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    position: absolute;
    top: -140px;
`;

const PageTitle = styled.p`
    font-family: Titillium Web !important;
    font-style: normal;
    font-weight: 600;
    font-size: 35px;
    line-height: 53px;
    color: var(--primary-color);
`;

const ContainerLeft = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 50%;
`;

const LineUnderNav = styled.div`
    height: 4px;
    border-radius: 3px;
    background: rgba(100, 217, 254, 0.5);
    width: 100%;
`;

const ContainerRight = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const Nav = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const NavItem = styled.p`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: bold;
    line-height: 40px;
    font-size: 15px;
    text-transform: uppercase;
    color: var(--primary-color);
    cursor: pointer;
    padding: 0 50px;
    &.active {
        box-shadow: 0px 4px var(--primary-filter-menu-active);
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
`;

const ContentWrapper = styled.div`
    width: calc(100% + 100px);
    padding-right: 50px;
    max-height: calc(100vh - 250px);
    overflow: hidden;
    overflow-y: auto;
    padding-left: 50px;
    position: relative;
    left: -50px;
    padding-bottom: 40px;
`;

export default Profile;
