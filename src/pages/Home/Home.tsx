import React from 'react';
import Header from 'components/Header';
import {
    InfoText,
    SideTitle,
    SideContent,
    ListHeader,
    Li,
    LaunchApp,
    WhoIsThales,
    MarketButton,
    List,
} from './components';
import { FlexDiv, FlexDivColumn, Image, Section, Side, SubTitle } from 'theme/common';
import { useTranslation } from 'react-i18next';
import onboardConnector from 'utils/onboardConnector';
import img3 from 'assets/images/img3.svg';
import Footer from './components/Footer';

const Home: React.FC = () => {
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
                        <Side></Side>
                    </FlexDiv>
                </FlexDivColumn>
            </Section>
            <Section>
                <Side></Side>
                <Side>
                    <SubTitle color="#04045a">{t('landing-page.markets.title')}</SubTitle>
                    <SideContent color="#04045a">{t('landing-page.markets.description')}</SideContent>
                    <MarketButton>{t('landing-page.markets.create-market')}</MarketButton>
                </Side>
            </Section>
            <Section>
                <Side>
                    <SubTitle color="white">{t('landing-page.options.title')}</SubTitle>
                    <ListHeader>{t('landing-page.options.description')}</ListHeader>
                    <List>
                        <Li>{t('landing-page.options.option1')}</Li>
                        <Li>{t('landing-page.options.option2')}</Li>
                        <Li>{t('landing-page.options.option3')}</Li>
                    </List>
                    <MarketButton>{t('landing-page.options.view-market')}</MarketButton>
                </Side>
                <Side></Side>
            </Section>
            <Section>
                <Side>
                    <Image src={img3}></Image>
                </Side>
                <Side>
                    <SubTitle color="#04045a">{t('landing-page.who-is-thales')}</SubTitle>
                    <SideContent color="#04045a">{t('landing-page.thales-is')}</SideContent>
                </Side>
            </Section>
            <Footer></Footer>
        </>
    );
};

export default Home;
