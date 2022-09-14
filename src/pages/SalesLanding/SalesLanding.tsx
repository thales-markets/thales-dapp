import { AnimationSvg } from 'pages/LandingPage/articles/Token/Token';
import Header from 'pages/LandingPage/components/Header/Header';
import { Theme } from 'pages/LandingPage/Home';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import Cookies from 'universal-cookie';
import {
    Background,
    Content,
    H1,
    H2,
    List,
    ListItem,
    ListWrapper,
    NestedList,
    Paragraph,
    ParagraphContainer,
    SectionWrapper,
    IllustrationContainer,
    Wrapper,
    OrderedListContrainer,
    OrderedList,
    OrderedItem,
} from './styled-components';

import UPMarket from 'assets/images/sales-funnel/UPmarket.svg';
import UPChart from 'assets/images/sales-funnel/UPchart.svg';
import DOWNMarket from 'assets/images/sales-funnel/DOWNmarket.svg';
import DOWNChart from 'assets/images/sales-funnel/DOWNchart.svg';
import INMarket from 'assets/images/sales-funnel/INmarket.svg';
import INChart from 'assets/images/sales-funnel/INchart.svg';
import OUTMarket from 'assets/images/sales-funnel/OUTmarket.svg';
import OUTChart from 'assets/images/sales-funnel/OUTchart.svg';
import GroupImg from 'assets/images/sales-funnel/Group606.svg';

const cookies = new Cookies();

const SalesLanding: React.FC = () => {
    const { t } = useTranslation();

    const [theme, setTheme] = useState(Number(cookies.get('home-theme')) === 0 ? Theme.Light : Theme.Dark);
    return (
        <Background className={theme === Theme.Light ? 'light' : 'dark'}>
            <Wrapper>
                <Header theme={theme} setTheme={setTheme} />
                <Content>
                    <H1>{t('sales-landing.title')}</H1>
                    <SectionWrapper>
                        <ListWrapper>
                            <List>
                                <NestedList>
                                    <ListItem>
                                        <HashLink to="#section1">{t('sales-landing.sections.1.heading')}</HashLink>
                                    </ListItem>
                                    <ListItem>
                                        <HashLink to="#section2">{t('sales-landing.sections.2.heading')}</HashLink>
                                    </ListItem>
                                    <ListItem>
                                        <HashLink to="#section3">{t('sales-landing.sections.3.heading')}</HashLink>
                                    </ListItem>
                                    <ListItem>
                                        <HashLink to="#section4">{t('sales-landing.sections.4.heading')}</HashLink>
                                    </ListItem>
                                    <ListItem>
                                        <HashLink to="#section5">{t('sales-landing.sections.5.heading')}</HashLink>
                                    </ListItem>
                                    <ListItem>
                                        <HashLink to="#section6">{t('sales-landing.sections.6.heading')}</HashLink>
                                    </ListItem>
                                </NestedList>
                            </List>
                        </ListWrapper>
                        <IllustrationContainer
                            width="40%"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: '30px',
                            }}
                        >
                            <AnimationSvg type="image/svg+xml" data={GroupImg}></AnimationSvg>
                        </IllustrationContainer>
                    </SectionWrapper>
                    <H2 id="section1">{t('sales-landing.sections.1.heading')}</H2>
                    <SectionWrapper flexDirection={'column'}>
                        <ParagraphContainer width="100%">
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.1.first-paragraph'} />
                            </Paragraph>
                        </ParagraphContainer>
                        <OrderedListContrainer>
                            <OrderedList>
                                <OrderedItem>
                                    <Trans i18nKey={'sales-landing.sections.1.ordered-list.1'} />
                                </OrderedItem>
                                <OrderedItem>
                                    <Trans i18nKey={'sales-landing.sections.1.ordered-list.2'} />
                                </OrderedItem>
                                <OrderedItem>
                                    <Trans i18nKey={'sales-landing.sections.1.ordered-list.3'} />
                                </OrderedItem>
                                <OrderedItem>
                                    <Trans i18nKey={'sales-landing.sections.1.ordered-list.4'} />
                                </OrderedItem>
                                <OrderedItem>
                                    <Trans i18nKey={'sales-landing.sections.1.ordered-list.5'} />
                                </OrderedItem>
                            </OrderedList>
                        </OrderedListContrainer>
                        <ParagraphContainer width="100%">
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.1.second-paragraph'} />
                            </Paragraph>
                        </ParagraphContainer>
                    </SectionWrapper>
                    <H2 id="section2">{t('sales-landing.sections.2.content-heading')}</H2>
                    <SectionWrapper>
                        <ParagraphContainer width="60%">
                            <IllustrationContainer width="100%" style={{ marginTop: '20px', marginBottom: '40px' }}>
                                <AnimationSvg type="image/svg+xml" data={UPMarket}></AnimationSvg>
                            </IllustrationContainer>
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.2.content'} />
                            </Paragraph>
                        </ParagraphContainer>
                        <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                            <AnimationSvg type="image/svg+xml" data={UPChart}></AnimationSvg>
                        </IllustrationContainer>
                    </SectionWrapper>
                    <H2 id="section3">{t('sales-landing.sections.3.content-heading')}</H2>
                    <SectionWrapper>
                        <ParagraphContainer width="60%">
                            <IllustrationContainer width="100%" style={{ marginTop: '20px', marginBottom: '40px' }}>
                                <AnimationSvg type="image/svg+xml" data={DOWNMarket}></AnimationSvg>
                            </IllustrationContainer>
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.3.content'} />
                            </Paragraph>
                        </ParagraphContainer>
                        <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                            <AnimationSvg type="image/svg+xml" data={DOWNChart}></AnimationSvg>
                        </IllustrationContainer>
                    </SectionWrapper>
                    <H2 id="section4">{t('sales-landing.sections.4.content-heading')}</H2>
                    <SectionWrapper>
                        <ParagraphContainer width="60%">
                            <IllustrationContainer width="100%" style={{ marginTop: '20px', marginBottom: '40px' }}>
                                <AnimationSvg type="image/svg+xml" data={INMarket}></AnimationSvg>
                            </IllustrationContainer>
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.4.content'} />
                            </Paragraph>
                        </ParagraphContainer>
                        <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                            <AnimationSvg type="image/svg+xml" data={INChart}></AnimationSvg>
                        </IllustrationContainer>
                    </SectionWrapper>
                    <H2 id="section5">{t('sales-landing.sections.5.content-heading')}</H2>
                    <SectionWrapper>
                        <ParagraphContainer width="60%">
                            <IllustrationContainer width="100%" style={{ marginTop: '20px', marginBottom: '40px' }}>
                                <AnimationSvg type="image/svg+xml" data={OUTMarket}></AnimationSvg>
                            </IllustrationContainer>
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.5.content'} />
                            </Paragraph>
                        </ParagraphContainer>
                        <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                            <AnimationSvg type="image/svg+xml" data={OUTChart}></AnimationSvg>
                        </IllustrationContainer>
                    </SectionWrapper>
                    <H2 id="section6">{t('sales-landing.sections.6.content-heading')}</H2>
                    <SectionWrapper flexDirection={'column'} style={{ marginTop: '80px' }}>
                        <ParagraphContainer width="100%">
                            <Paragraph>
                                <Trans
                                    i18nKey={'sales-landing.sections.6.first-paragraph'}
                                    components={{ a: <a href="#" /> }}
                                />
                            </Paragraph>
                        </ParagraphContainer>
                        <IllustrationContainer width="90%" style={{ margin: '70px auto' }}>
                            <iframe
                                width="100%"
                                height="480"
                                src="https://www.youtube.com/embed/oHSSOnXqLwU"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </IllustrationContainer>
                        <ParagraphContainer width="100%">
                            <Paragraph>
                                <Trans
                                    i18nKey={'sales-landing.sections.6.second-paragraph'}
                                    components={{ this: <a href="#" /> }}
                                />
                            </Paragraph>
                        </ParagraphContainer>
                    </SectionWrapper>
                    <H2 id="section7">{t('sales-landing.sections.7.content-heading')}</H2>
                    <SectionWrapper flexDirection={'column'}>
                        <ParagraphContainer width="100%">
                            <Paragraph>
                                <Trans
                                    i18nKey={'sales-landing.sections.7.first-paragraph'}
                                    components={{ poslink: <a href="#" />, rangelink: <a href="#" /> }}
                                />
                            </Paragraph>
                        </ParagraphContainer>
                        <IllustrationContainer width="90%" style={{ margin: '70px auto' }}>
                            <iframe
                                width="100%"
                                height="480"
                                src="https://www.youtube.com/embed/8oIgCT8GTd0"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </IllustrationContainer>
                        <ParagraphContainer width="100%">
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.7.second-paragraph'} />
                            </Paragraph>
                        </ParagraphContainer>
                        <IllustrationContainer width="90%" style={{ margin: '70px auto' }}>
                            <iframe
                                width="100%"
                                height="480"
                                src="https://www.youtube.com/embed/MXqt3itSCgw"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </IllustrationContainer>
                        <ParagraphContainer width="100%">
                            <Paragraph>
                                <Trans i18nKey={'sales-landing.sections.7.third-paragraph'} />
                            </Paragraph>
                        </ParagraphContainer>
                    </SectionWrapper>
                </Content>
            </Wrapper>
        </Background>
    );
};

export default SalesLanding;
