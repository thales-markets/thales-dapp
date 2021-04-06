import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Logo } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';

const Header = styled.div`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
`;

const ConnectWallet = styled(Button)`
    color: white;
    background: #3936c7;
    &:hover {
        background: #44e1e2;
    }
`;
const MarketHeader: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Header>
            <Logo to={ROUTES.Home}>{t('header.links.home')}</Logo>
            <ConnectWallet onClick={() => onboardConnector.connectWallet()}>
                {t('common.wallet.connect-your-wallet')}
            </ConnectWallet>
        </Header>
    );
};

export default MarketHeader;
