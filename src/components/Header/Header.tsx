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
        <Menu>
            <Link to={ROUTES.Home} className="item">
                {t('header.links.home')}
            </Link>
            <Link to={ROUTES.Options.Home} className="item">
                {t('header.links.options')}
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
