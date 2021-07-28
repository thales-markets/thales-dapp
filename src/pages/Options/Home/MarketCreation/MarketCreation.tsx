import React from 'react';
import { Button, FlexDivCentered, FlexDivColumn, Side, Text } from 'theme/common';
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
                        style={{ padding: '13px 24px', fontSize: 20 }}
                        onClick={() =>
                            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' })
                        }
                    >
                        {t('options.home.market-creation.explore-markets-button-label')}
                    </Button>
                    {isWalletConnected && (
                        <>
                            <Text className="text-m pale-grey" style={{ margin: '0 135px' }}>
                                or
                            </Text>
                            <Button
                                className="primary"
                                style={{ padding: '13px 24px', fontSize: 20 }}
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
                        </>
                    )}
                </FlexDivCentered>
            </SideWrapper>
        </FlexDivColumn>
    );
};

const SideWrapper = styled(Side)`
    padding-top: 0px !important;
    padding-bottom: 40px !important;
    top: -20px;
    position: relative;
`;

// const CreateMarket = styled(FlexDivColumn)`
//     color: white;
//     align-items: center;
//     position: relative;
//     background-color: #1c1a71;
//     background-clip: padding-box;
//     border: solid 2px transparent;
//     border-radius: 24px;
//     color: #f6f6fe;
//     margin: 75px;
//     height: 280px;
//     &:before {
//         content: '';
//         position: absolute;
//         top: 0;
//         right: 0;
//         bottom: 0;
//         left: 0;
//         z-index: -1;
//         margin: -2px;
//         border-radius: inherit;
//         background: linear-gradient(#6ac1d5, #ca91dc);
//         border: 2px dashed #04045a;
//     }
// `;

// const Description = styled.p`
//     margin: 0;
//     margin-top: 28px !important;
//     text-align: center;
//     font-weight: bold;
//     font-size: 25px;
//     line-height: 45px;
//     letter-spacing: 0.25px;
//     color: #f6f6fe;
//     width: 747px;
// `;

// const CreateMarketButtonWrapper = styled(FlexDivColumn)`
//     margin-top: 80px;
//     margin-bottom: 30px;
// `;

export default MarketCreation;
