import React from 'react';
import { Button, FlexDiv, Image, Side, Text } from 'theme/common';
import image from 'assets/images/create-market.svg';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { navigateTo } from 'utils/routes';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import onboardConnector from 'utils/onboardConnector';

const MarketCreation: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <FlexDiv>
            <Side>
                <Text className="text-xxxl">{t('options.home.market-creation.no-markets.title')}</Text>
                <Button
                    className="primary"
                    style={{ padding: '8px 40px', marginTop: '40px' }}
                    onClick={() =>
                        isWalletConnected ? navigateTo(ROUTES.Options.CreateMarket) : onboardConnector.connectWallet()
                    }
                >
                    {isWalletConnected
                        ? t('options.home.market-creation.create-market-button-label')
                        : t('common.wallet.connect-your-wallet')}
                </Button>
            </Side>
            <Side>
                <Image src={image}></Image>
            </Side>
        </FlexDiv>
    );
};

export default MarketCreation;
