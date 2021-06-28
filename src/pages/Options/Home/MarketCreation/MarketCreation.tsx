import React from 'react';
import { Button, FlexDivCentered, FlexDivColumn, Side } from 'theme/common';
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
        <FlexDivColumn id="market-creation">
            <SideWrapper>
                <FlexDivCentered>
                    <Button
                        className="secondary"
                        onClick={() =>
                            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' })
                        }
                    >
                        {t('options.home.market-creation.explore-markets-button-label')}
                    </Button>
                </FlexDivCentered>
                <CreateMarket>
                    <Description>{t('options.home.market-creation.no-markets.title')}</Description>
                    <CreateMarketButtonWrapper>
                        <Button
                            className="primary"
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
                    </CreateMarketButtonWrapper>
                </CreateMarket>
            </SideWrapper>
        </FlexDivColumn>
    );
};

const SideWrapper = styled(Side)`
    padding-top: 110px !important;
    padding-bottom: 80px !important;
`;

const CreateMarket = styled(FlexDivColumn)`
    color: white;
    align-items: center;
    position: relative;
    background-color: #1c1a71;
    background-clip: padding-box;
    border: solid 2px transparent;
    border-radius: 24px;
    color: #f6f6fe;
    margin: 50px 75px 50px 75px;
    cursor: pointer;
    height: 280px;
    &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        margin: -2px;
        border-radius: inherit;
        background: linear-gradient(#6ac1d5, #ca91dc);
        border: 2px dashed #04045a;
    }
`;

const Description = styled.p`
    margin: 0;
    margin-top: 28px !important;
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    line-height: 45px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    width: 747px;
`;

const CreateMarketButtonWrapper = styled(FlexDivColumn)`
    margin-top: 80px;
    margin-bottom: 30px;
`;

export default MarketCreation;
