import React from 'react';
import Header from 'components/Header';
import { SideContent, List } from './components';
import { Button, FlexDiv, FlexDivColumn, Section, Side, Text, Li, Image } from 'theme/common';
import { useTranslation } from 'react-i18next';
import onboardConnector from 'utils/onboardConnector';
import Footer from './Footer/Footer';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import ethOlive from 'assets/images/eth-olive.svg';
import scaleSstars from 'assets/images/weight-scale-stars.png';
import thalesTheWhite from 'assets/images/thales-white.png';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <>
            <Section class="hero">
                <FlexDivColumn>
                    <Header />
                    <HeroSection className="landing-hero">
                        <Side>
                            <Text className="title">{t('landing-page.title')}</Text>
                            <Text className="text-m pale-grey" style={{ marginBottom: 60, marginTop: 6 }}>
                                {t('landing-page.description')}
                            </Text>
                            <FlexDiv>
                                <Button
                                    className="secondary"
                                    style={{ padding: '8px 35px', marginRight: '20px' }}
                                    onClick={() => navigateTo(ROUTES.Options.Home)}
                                >
                                    {t('landing-page.use-app')}
                                </Button>
                                <Button className="tertiary">{t('landing-page.who-is-thales')}</Button>
                            </FlexDiv>
                        </Side>
                        <Side></Side>
                    </HeroSection>
                </FlexDivColumn>
            </Section>
            <Section>
                <Side>
                    <Olive src={ethOlive} />
                </Side>
                <Side>
                    <Text className="text-xxl dark" style={{ marginBottom: 26 }}>
                        {t('landing-page.markets.title')}
                    </Text>
                    <SideContent className="text-m dark">{t('landing-page.markets.description')}</SideContent>
                    <Button
                        className="primary"
                        style={{ marginTop: '40px' }}
                        onClick={() =>
                            isWalletConnected
                                ? navigateTo(ROUTES.Options.CreateMarket)
                                : onboardConnector.connectWallet()
                        }
                    >
                        {t('landing-page.markets.create-market')}
                    </Button>
                </Side>
            </Section>
            <Section>
                <Side>
                    <Text className="text-xxl white" style={{ marginBottom: 26 }}>
                        {t('landing-page.options.title')}
                    </Text>
                    <Text className="text-lm bold white" style={{ marginBottom: 26 }}>
                        {t('landing-page.options.description')}
                    </Text>
                    <List>
                        <Li className="text-m white">{t('landing-page.options.option1')}</Li>
                        <Li className="text-m white">{t('landing-page.options.option2')}</Li>
                        <Li className="text-m white">{t('landing-page.options.option3')}</Li>
                    </List>
                    <Button className="primary" style={{ marginTop: '40px' }}>
                        {t('landing-page.options.view-market')}
                    </Button>
                </Side>
                <Side>
                    <Image src={scaleSstars} />
                </Side>
            </Section>
            <Section>
                <Side>
                    <ThalesTheWhite src={thalesTheWhite} />
                </Side>
                <Side>
                    <Text className="text-xxl dark" style={{ marginBottom: 26 }}>
                        {t('landing-page.who-is-thales')}
                    </Text>
                    <SideContent className="text-m dark">{t('landing-page.thales-is')}</SideContent>
                </Side>
            </Section>
            <Footer></Footer>
        </>
    );
};

const HeroSection = styled(FlexDiv)`
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
    }
`;

const ThalesTheWhite = styled(Image)`
    object-fit: contain;
    max-height: 500px;
`;

const Olive = styled(Image)`
    object-fit: contain;
    max-height: 400px;
`;

export default Home;
