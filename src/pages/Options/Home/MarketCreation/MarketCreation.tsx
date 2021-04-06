import React from 'react';
import { Button, FlexDiv, Image, Side } from 'theme/common';
import image from 'assets/images/create-market.svg';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { navigateTo } from 'utils/routes';

const MarketCreation: React.FC = () => {
    const { t } = useTranslation();

    const Text = styled.h2`
        font-family: Open Sans !important;
        font-style: normal;
        font-weight: bold;
        font-size: 64px;
        line-height: 80px;
        letter-spacing: -1.5px;
        color: #f6f6fe;
    `;

    const CreateMarket = styled(Button)`
        padding: 8px 40px;
        background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    `;

    return (
        <FlexDiv>
            <Side>
                <Text>{t('options.home.market-creation.no-markets.title')}</Text>
                <CreateMarket onClick={() => navigateTo(ROUTES.Options.CreateMarket)}>
                    {t('options.home.market-creation.create-market-button-label')}
                </CreateMarket>
            </Side>
            <Side>
                <Image src={image}></Image>
            </Side>
        </FlexDiv>
    );
};

export default MarketCreation;

// const { t } = useTranslation();
// const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

// <Segment placeholder textAlign="center">
//     {!isWalletConnected ? (
//         <>
//             <Header as="h1">{t('options.home.market-creation.not-connected.title')}</Header>
//             <NewToBinaryOptions />
//             <Button primary onClick={() => onboardConnector.connectWallet()}>
//                 {t('common.wallet.connect-your-wallet')}
//             </Button>
//         </>
//     ) : (
//         <>
//             <Header as="h1">{t('options.home.market-creation.no-markets.title')}</Header>
//             <NewToBinaryOptions />
//             <Button primary onClick={() => navigateTo(ROUTES.Options.CreateMarket)}>
//                 {t('options.home.market-creation.create-market-button-label')}
//             </Button>
//         </>
//     )}
// </Segment>
