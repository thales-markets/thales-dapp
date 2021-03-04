import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showWalletPopup } from '../../redux/modules/ui';
import { Link } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import { Button, Menu } from 'semantic-ui-react';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link to={ROUTES.Home}>
                <a className="item">{t('header.links.home')}</a>
            </Link>
            <Link to={ROUTES.Options}>
                <a className="item">{t('header.links.options')}</a>
            </Link>
            <Menu.Menu position="right">
                <Button
                    secondary
                    onClick={() => {
                        dispatch(showWalletPopup());
                    }}
                >
                    {t('header.connect-wallet')}
                </Button>
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
