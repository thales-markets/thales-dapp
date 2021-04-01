import ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import logo from 'assets/images/logo.svg';

const Header: React.FC = () => {
    const Header = styled.div`
        width: 100%;
        display: flex;
        height: 100px;
        align-items: center;
    `;

    const Logo = styled(Link)`
        display: flex;
        flex: 1;
        margin-left: 75px;
        &:before {
            content: ' ';
            background-image: url(${logo});
            height: 52px;
            width: 52px;
            margin-right: 20px;
        }
        font-family: Titillium Web;
        font-style: normal;
        font-weight: bold;
        font-size: 36px;
        line-height: 55px;
        color: white;
    `;

    const Links = styled.div`
        flex: 3;
        display: flex;
        justify-content: flex-end;
    `;

    const NavLink = styled(Link)`
        margin-right: 40px;
        font-family: Titillium Web;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 32px;
        letter-spacing: 0.15px;
        color: white;
        &:last-child {
            margin-right: 75px;
        }
    `;

    const UsedApp = styled.button`
        margin-left: 60px;
        width: 140px;
        height: 40px;
        color: white;
        background: #3936c7;
        border-radius: 23px;
        cursor: pointer;
        border: none;
        text-transform: none !important;
        font-family: Titillium Web;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        &:hover {
            background: #44e1e2;
        }
    `;

    const { t } = useTranslation();
    // const { walletAddress, networkName } = useSelector((state: RootState) => getWalletInfo(state));

    return (
        <Header>
            <Logo to={ROUTES.Home}>{t('header.links.home')}</Logo>
            <Links>
                <NavLink to="">Products</NavLink>
                <NavLink to="">Markets</NavLink>
                <NavLink to="">Partners</NavLink>
                <NavLink to="">Comunnity</NavLink>
                <NavLink to={ROUTES.Options.Home}>
                    <UsedApp>Used App</UsedApp>
                </NavLink>
            </Links>
        </Header>
    );
};

export default Header;
