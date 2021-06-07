import React, { useEffect } from 'react';
import Header from 'components/Header';
import { Button, FlexDiv, FlexDivColumn, Section, Side, Text, Li, Image } from 'theme/common';
import { useTranslation } from 'react-i18next';
import Footer from './Footer/Footer';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import styled from 'styled-components';
import market from 'assets/images/market.png';
import thalesTheWhite from 'assets/images/thales-white.png';
import coins from 'assets/images/coins-thales.png';
import scale from 'assets/images/weight-scale-gradient.png';
import { setupThreeJS } from './Three';

const Home: React.FC = () => {
    const { t } = useTranslation();

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
                            <Text className="text-m pale-grey" style={{ marginBottom: 120, marginTop: 30 }}>
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
                    </HeroSection>
                </FlexDivColumn>
            </Section>
            <Section>
                <Cards>
                    <Image src={coins} style={{ height: 200, width: 200, margin: '10px auto' }}></Image>
                    <FlexDivColumn style={{ paddingLeft: 70, paddingRight: 24 }}>
                        <Text className="white text-l">{t('landing-page.markets.title')}</Text>.
                        <Text className="white text-s" style={{ marginBottom: 30 }}>
                            {t('landing-page.markets.option1')}
                        </Text>
                        <Text className="white text-s" style={{ marginBottom: 30 }}>
                            {t('landing-page.markets.option2')}
                        </Text>
                        <Text className="white texts">{t('landing-page.markets.option3')}</Text>
                    </FlexDivColumn>
                    <Button className="primary" style={{ margin: '50px auto' }}>
                        {t('landing-page.markets.view-markets')}
                    </Button>
                </Cards>
                <Cards>
                    <Image src={scale} style={{ height: 200, width: 200, margin: '10px auto' }}></Image>
                    <FlexDivColumn style={{ paddingLeft: 70, paddingRight: 24 }}>
                        <Text className="white text-l">{t('landing-page.options.title')}</Text>.
                        <Text className="white text-s" style={{ marginBottom: 30 }}>
                            {t('landing-page.options.option1')}
                        </Text>
                        <Text className="white text-s" style={{ marginBottom: 30 }}>
                            {t('landing-page.options.option2')}
                        </Text>
                        <Text className="white texts">{t('landing-page.options.option3')}</Text>
                    </FlexDivColumn>
                    <Button className="primary" style={{ margin: '50px auto' }}>
                        {t('landing-page.options.view-markets')}
                    </Button>
                </Cards>
            </Section>
            <Section>
                <Side>
                    <Text className="text-xxl white" style={{ marginBottom: 26 }}>
                        {t('landing-page.options.title')}
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

const Cards = styled(FlexDivColumn)`
    height: 600px;
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    box-shadow: 0px 25px 30px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(4px);
    border-radius: 23px;
    border: 2px solid rgb(106, 193, 213, 0.4);
    &:first-child {
        margin: 50px 50px 50px 120px;
    }
    &:nth-child(2) {
        margin: 50px 120px 50px 50px;
    }
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
