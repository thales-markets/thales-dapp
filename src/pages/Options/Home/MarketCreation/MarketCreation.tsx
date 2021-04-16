import React from 'react';
import { FlexDiv, Image, Side } from 'theme/common';
import image from 'assets/images/create-market.svg';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { navigateTo } from 'utils/routes';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';
import { CreateMarketButton } from 'theme/common';

const Text = styled.h2`
    font-family: Open Sans !important;
    font-style: normal;
    font-weight: bold;
    font-size: 64px;
    line-height: 80px;
    letter-spacing: -1.5px;
    color: #f6f6fe;
`;

const MarketCreation: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <FlexDiv>
            <Side>
                <Text>{t('options.home.market-creation.no-markets.title')}</Text>
                <CreateMarketButton
                    style={{ marginTop: '40px' }}
                    onClick={() =>
                        isWalletConnected ? navigateTo(ROUTES.Options.CreateMarket) : onboardConnector.connectWallet()
                    }
                >
                    {isWalletConnected
                        ? t('options.home.market-creation.create-market-button-label')
                        : t('common.wallet.connect-your-wallet')}
                </CreateMarketButton>
            </Side>
            <Side>
                <Image src={image}></Image>
            </Side>
        </FlexDiv>
    );
};

export default MarketCreation;
