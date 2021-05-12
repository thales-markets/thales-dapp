import React from 'react';
import { Button, FlexDiv, Image, Side, Text } from 'theme/common';
import image from 'assets/images/scale.png';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { navigateTo } from 'utils/routes';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';

const MarketCreation: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <FlexDiv>
            <SideWrapper>
                <Text className="text-xxxl">{t('options.home.market-creation.no-markets.title')}</Text>
                <FlexDiv style={{ marginTop: '40px' }}>
                    <Button
                        className="secondary"
                        style={{ marginRight: 20 }}
                        onClick={() =>
                            isWalletConnected
                                ? navigateTo(ROUTES.Options.CreateMarket)
                                : onboardConnector.connectWallet()
                        }
                    >
                        {isWalletConnected
                            ? t('options.home.market-creation.create-market-button-label')
                            : t('common.wallet.connect-your-wallet')}
                    </Button>
                    <Button
                        className="tertiary"
                        onClick={() =>
                            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' })
                        }
                    >
                        View Markets
                    </Button>
                </FlexDiv>
            </SideWrapper>
            <SideWrapper>
                <Image style={{ marginLeft: 90, height: 380, objectFit: 'contain' }} src={image}></Image>
            </SideWrapper>
        </FlexDiv>
    );
};

const SideWrapper = styled(Side)`
    padding-top: 40px !important;
    padding-bottom: 80px !important;
    @media (max-width: 1200px) {
        width: 100%;
        .text-xxxl {
            font-size: 42px;
            line-height: 60px;
        }
    }
`;

export default MarketCreation;
