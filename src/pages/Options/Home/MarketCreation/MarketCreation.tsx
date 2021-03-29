import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../../../constants/routes';
import NewToBinaryOptions from '../../components/NewToBinaryOptions';
import { Button, Header, Segment } from 'semantic-ui-react';
import { navigateTo } from 'utils/routes';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import onboardConnector from 'utils/onboardConnector';

const MarketCreation: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <Segment placeholder textAlign="center">
            {!isWalletConnected ? (
                <>
                    <Header as="h1">{t('options.home.market-creation.not-connected.title')}</Header>
                    <NewToBinaryOptions />
                    <Button primary onClick={() => onboardConnector.connectWallet()}>
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
