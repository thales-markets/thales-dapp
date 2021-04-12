import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Logo } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';

const MarketHeaderWrapper = styled.div`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
`;

const ConnectWallet = styled(Button)`
    align-self: center;
    color: white;
    background: #3936c7;
    &:hover {
        background: #44e1e2;
    }
    font-size: 16px;
`;

const MarketHeader: React.FC = () => {
    const { t } = useTranslation();
    return (
        <MarketHeaderWrapper>
            <Logo to={ROUTES.Home}>{t('header.links.home')}</Logo>
            <ConnectWallet onClick={() => onboardConnector.connectWallet()}>
                {t('common.wallet.connect-your-wallet')}
            </ConnectWallet>
        </MarketHeaderWrapper>
    );
};

export default MarketHeader;
