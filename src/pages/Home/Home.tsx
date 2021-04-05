import React from 'react';
import img1 from 'assets/images/img1.svg';
import img2 from 'assets/images/img2.svg';
import img3 from 'assets/images/img3.svg';
import Header from 'components/Header';
import {
    InfoText,
    SideTitle,
    SideHeader,
    SideContent,
    ListHeader,
    List,
    Li,
    LaunchApp,
    WhoIsThales,
    MarketButton,
} from './components';
import { FlexDiv, FlexDivColumn, Section, Side, Image } from 'theme/common';
import { Footer } from './components/Footer';
import { useTranslation } from 'react-i18next';

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
                                <LaunchApp>{t('landing-page.launch-app')}</LaunchApp>
                                <WhoIsThales>{t('landing-page.who-is-thales')}</WhoIsThales>
                            </FlexDiv>
                        </Side>
                        <Side>
                            <Image src={img1}></Image>
                        </Side>
                    </FlexDiv>
                </FlexDivColumn>
            </Section>
            <Section>
                <Side>
                    <Image src={img2}></Image>
                </Side>
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
                    <List>
                        <Li>{t('landing-page.options.option1')}</Li>
                        <Li>{t('landing-page.options.option2')}</Li>
                        <Li>{t('landing-page.options.option3')}</Li>
                    </List>
                    <MarketButton>{t('landing-page.options.view-market')}</MarketButton>
                </Side>
                <Side>
                    <Image src={img3}></Image>
                </Side>
            </Section>
            <Section>
                <Side>
                    <Image src={img3}></Image>
                </Side>
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
