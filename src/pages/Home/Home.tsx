import React from 'react';
import Header from 'components/Header';
import {
    InfoText,
    SideTitle,
    SideHeader,
    SideContent,
    ListHeader,
    Li,
    LaunchApp,
    WhoIsThales,
    MarketButton,
} from './components';
import { FlexDiv, FlexDivColumn, Section, Side } from 'theme/common';
import { Footer } from './components/Footer';
import { useTranslation } from 'react-i18next';
import onboardConnector from 'utils/onboardConnector';

export const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Section>
                <FlexDivColumn>
                    <Header />
                    <FlexDiv>
                        <Side>
                            <SideTitle color="white">{t('landing-page.title')}</SideTitle>
                            <InfoText>{t('landing-page.description')}</InfoText>
                            <FlexDiv>
                                <LaunchApp onClick={() => onboardConnector.connectWallet()}>
                                    {t('common.wallet.connect-your-wallet')}
                                </LaunchApp>
                                <WhoIsThales>{t('landing-page.who-is-thales')}</WhoIsThales>
                            </FlexDiv>
                        </Side>
                    </FlexDiv>
                </FlexDivColumn>
            </Section>
            <Section>
                <Side>
                    <SideHeader color="#04045a">{t('landing-page.markets.title')}</SideHeader>
                    <SideContent color="#04045a">{t('landing-page.markets.description')}</SideContent>
                    <MarketButton>{t('landing-page.markets.create-market')}</MarketButton>
                </Side>
            </Section>
            <Section>
                <Side>
                    <SideHeader color="white">{t('landing-page.options.title')}</SideHeader>
                    <ListHeader>{t('landing-page.options.description')}</ListHeader>
                    <Li>{t('landing-page.options.option1')}</Li>
                    <Li>{t('landing-page.options.option2')}</Li>
                    <Li>{t('landing-page.options.option3')}</Li>
                    <MarketButton>{t('landing-page.options.view-market')}</MarketButton>
                </Side>
            </Section>
            <Section>
                <Side>
                    <SideHeader color="#04045a">{t('landing-page.who-is-thales')}</SideHeader>
                    <SideContent color="#04045a">{t('landing-page.thales-is')}</SideContent>
                </Side>
            </Section>
            <Footer></Footer>
        </>
    );
};

export default Home;
