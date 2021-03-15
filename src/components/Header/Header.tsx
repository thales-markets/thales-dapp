import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { showWalletPopup } from '../../redux/modules/ui';
import { Link } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import { Button, Icon, Label, Menu, Message } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getWalletInfo } from 'redux/modules/wallet';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { currentWallet, networkName } = useSelector((state: RootState) => getWalletInfo(state));

    return (
        <Menu>
            <Link to={ROUTES.Home} className="item">
                {t('header.links.home')}
            </Link>
            <Link to={ROUTES.Options.Home} className="item">
                {t('header.links.options')}
            </Link>
            <Menu.Menu position="right">
                {currentWallet != null ? (
                    <Message>
                        <Icon name="dot circle" color="green" />
                        <span>{currentWallet}</span>
                        <Label>{networkName}</Label>
                    </Message>
                ) : (
                    <Button
                        secondary
                        onClick={() => {
                            dispatch(showWalletPopup());
                        }}
                    >
                        {t('header.connect-wallet')}
                    </Button>
                )}
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
