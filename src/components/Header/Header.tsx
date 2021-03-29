import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import { Button, Icon, Label, Menu, Message } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getWalletInfo } from 'redux/modules/wallet';
import onboardConnector from 'utils/onboardConnector';
import { truncateAddress } from 'utils/formatters/string';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const { walletAddress, networkName } = useSelector((state: RootState) => getWalletInfo(state));

    return (
        <Menu>
            <Link to={ROUTES.Home} className="item">
                {t('header.links.home')}
            </Link>
            <Link to={ROUTES.Options.Home} className="item">
                {t('header.links.options')}
            </Link>
            <Menu.Menu position="right">
                {walletAddress != null ? (
                    <>
                        <Message style={{ margin: 0 }}>
                            <Icon name="dot circle" color="green" />
                            <span>{truncateAddress(walletAddress)}</span>
                            <Label>{networkName}</Label>
                        </Message>
                        <Button secondary onClick={() => onboardConnector.disconnectWallet()}>
                            {t('header.disconnect-wallet')}
                        </Button>
                    </>
                ) : (
                    <Button primary onClick={() => onboardConnector.connectWallet()}>
                        {t('header.connect-wallet')}
                    </Button>
                )}
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
