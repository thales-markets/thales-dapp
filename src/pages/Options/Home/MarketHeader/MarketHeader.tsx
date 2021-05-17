import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button, Logo } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';
import UserInfo from 'components/UserInfo';

const MarketHeaderWrapper = styled.div`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
`;

const MarketHeader: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <MarketHeaderWrapper id="market-header">
            <Logo to={ROUTES.Home} />
            {!isWalletConnected ? (
                <Button
                    className="primary"
                    style={{ fontSize: '16px', alignSelf: 'center' }}
                    onClick={() => onboardConnector.connectWallet()}
                >
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            ) : (
                <UserInfo />
            )}
        </MarketHeaderWrapper>
    );
};

export default MarketHeader;
