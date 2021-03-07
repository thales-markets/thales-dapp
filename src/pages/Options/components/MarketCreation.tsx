import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ROUTES from '../../../constants/routes';
import NewToBinaryOptions from './NewToBinaryOptions';
import { toggleWalletPopup } from '../../../redux/modules/ui';
import { Button, Header, Segment } from 'semantic-ui-react';
import { navigateTo } from 'utils/routes';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet/walletDetails';

const MarketCreation: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <Segment placeholder textAlign="center">
            {!isWalletConnected ? (
                <>
                    <Header as="h1">{t('options.home.market-creation.not-connected.title')}</Header>
                    <NewToBinaryOptions />
                    <Button primary onClick={() => dispatch(toggleWalletPopup(true))}>
                        {t('common.wallet.connect-your-wallet')}
                    </Button>
                </>
            ) : (
                <>
                    <Header as="h1">{t('options.home.market-creation.no-markets.title')}</Header>
                    <NewToBinaryOptions />
                    <Button primary onClick={() => navigateTo(ROUTES.Options.CreateMarket)}>
                        {t('options.home.market-creation.create-market-button-label')}
                    </Button>
                </>
            )}
        </Segment>
    );
};

export default MarketCreation;
