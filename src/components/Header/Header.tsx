import ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Logo } from 'theme/common';

const HeaderWrapper = styled.div`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
`;

const Links = styled.div`
    flex: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const NavLink = styled(Link)`
    margin-right: 40px;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.15px;
    color: white;
    &:last-child {
        margin-right: 0;
    }
    &:hover {
        color: #44e1e2;
    }
`;

const UsedApp = styled(Button)`
    padding: 8px 35px;
    margin-left: 60px;
    color: white;
    background: #3936c7;
`;

const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <HeaderWrapper>
            <Logo to={ROUTES.Home}>{t('header.links.home')}</Logo>
            <Links>
                <NavLink to="">Products</NavLink>
                <NavLink to="">Markets</NavLink>
                <NavLink to="">Partners</NavLink>
                <NavLink to="">Comunnity</NavLink>
                <NavLink to={ROUTES.Options.Home}>
                    <UsedApp>Use dApp</UsedApp>
                </NavLink>
            </Links>
        </HeaderWrapper>
    );
};

export default Header;
