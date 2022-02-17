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
import TileTable from '../../components/TileTable';
import MaturedPositions from './components/MaturedPositions/MaturedPositions';
import MyPositions from './components/MyPositions/MyPositions';

const rows = [
    'December 18, 2021',
    {
        color: '#50CE99',
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'buy', value: '7.24 pm', flexDirection: 'row' },
            { title: 'strike', value: '$ 7,500.00' },
            { title: 'price', value: '$ 0.35' },
            { title: 'amount', value: '1352 long' },
            { title: 'paid', value: '$ 1000.00' },
            { title: 'expired @', value: '17.50 21.07.2022' },
            { title: 'market', value: 'down' },
        ],
    },
    'December 19, 2021',
    {
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
    {
        color: '#C3244A',
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
    {
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
    {
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
];

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

    const positions = userPositionsQuery.isSuccess ? userPositionsQuery.data : { claimable: 0, matured: [], live: [] };

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
                ></TableGridSwitch>
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
                        {positions.claimable > 0 && <Notification> {positions.claimable} </Notification>}
                    </NavItem>
                    <NavItem
                        onClick={setView.bind(this, NavItems.History)}
                        className={view === NavItems.History ? 'active' : ''}
                    >
                        {NavItems.History}
                    </NavItem>
                </Nav>
                <LineUnderNav />
                {view === NavItems.MyPositions && (
                    <MyPositions exchangeRates={exchangeRates} positions={positions.live} />
                )}
                {view === NavItems.MaturedPositions && (
                    <MaturedPositions exchangeRates={exchangeRates} positions={positions.matured} />
                )}
                {view === NavItems.History && <TileTable rows={rows} />}
            </ContainerLeft>
            <ContainerRight></ContainerRight>
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
    justify-content: space-between;
    position: fixed;
    top: 24px;
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
    background: #276d83;
    box-sizing: border-box;
    box-shadow: 0px 0px 30px rgb(100 217 254 / 30%);
    border-radius: 30px;
    margin-left: 20px;
    width: 32px;
    text-align: center;
    font-size: 18px;
    line-height: 26px;
    position: relative;
    top: 0px;
    margin-top: 6px;
    margin-bottom: 8px;
    display: inline-block;
`;

export default Profile;
