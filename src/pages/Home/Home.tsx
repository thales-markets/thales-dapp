import React, { useEffect } from 'react';
import Header from 'components/Header';
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
import market from 'assets/images/market.png';
import scaleSstars from 'assets/images/weight-scale-stars.png';
import thalesTheWhite from 'assets/images/thales-white.png';
import { setupThreeJS } from './Three';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    useEffect(() => {
        setupThreeJS();
    }, []);

    return (
        <>
            <Section id="landing-hero" class="hero">
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
                                    id="use-app"
                                    className="secondary"
                                    style={{ padding: '8px 35px', marginRight: '20px' }}
                                    onClick={() => navigateTo(ROUTES.Options.Home)}
                                >
                                    {t('landing-page.use-app')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        document
                                            .getElementById('who-is-thales')
                                            ?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="tertiary"
                                >
                                    {t('landing-page.who-is-thales')}
                                </Button>
                            </FlexDiv>
                        </Side>
                        <Side></Side>
                    </HeroSection>
                </FlexDivColumn>
            </Section>
            <Section>
                <Side>
                    <Scale src={scaleSstars} />
                </Side>
                <Side>
                    <Text className="text-xxl white" style={{ marginBottom: 26 }}>
                        {t('landing-page.markets.title')}
                    </Text>
                    <Text className="text-m white">{t('landing-page.markets.description')}</Text>
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
                    <Button
                        className="primary"
                        style={{ marginTop: '40px' }}
                        onClick={() => navigateTo(ROUTES.Options.Home + '#explore-markets')}
                    >
                        {t('landing-page.options.view-market')}
                    </Button>
                </Side>
                <Side>
                    <Market src={market} />
                </Side>
            </Section>
            <Section id="who-is-thales">
                <Side>
                    <ThalesTheWhite src={thalesTheWhite} />
                </Side>
                <Side>
                    <Text className="text-xxl white" style={{ marginBottom: 26 }}>
                        {t('landing-page.who-is-thales')}
                    </Text>
                    <Text className="text-m white">{t('landing-page.thales-is')}</Text>
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

const Scale = styled(Image)`
    object-fit: contain;
    max-height: 500px;
    min-height: 400px;
    min-width: 300px;
`;

const ThalesTheWhite = styled(Image)`
    object-fit: contain;
    max-height: 500px;
    min-height: 400px;
    min-width: 300px;
`;

const Market = styled(Image)`
    object-fit: contain;
    max-height: 400px;
    min-height: 400px;
    min-width: 300px;
`;

const List = styled.ul`
    list-style-position: outside;
    padding-left: 20px;
    list-style: disc;
`;

export default Home;
