import SearchField from 'pages/Markets/components/Input/SearchField';
import TableGridSwitch from 'pages/Markets/components/Input/TableGridSwitch';
import React, { useState } from 'react';
import styled from 'styled-components';
import TileTable from '../../components/TileTable';
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
    OpenOrders = 'Open Orders',
    History = 'History',
}

const Profile: React.FC = () => {
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
                        onClick={setView.bind(this, NavItems.OpenOrders)}
                        className={view === NavItems.OpenOrders ? 'active' : ''}
                    >
                        {NavItems.OpenOrders}
                    </NavItem>
                    <NavItem
                        onClick={setView.bind(this, NavItems.History)}
                        className={view === NavItems.History ? 'active' : ''}
                    >
                        {NavItems.History}
                    </NavItem>
                </Nav>
                <LineUnderNav />
                {view === NavItems.MyPositions && <MyPositions />}
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

export default Profile;
