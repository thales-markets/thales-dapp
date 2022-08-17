import { AnimationSvg } from 'pages/LandingPage/articles/Token/Token';
import Header from 'pages/LandingPage/components/Header/Header';
import { Theme } from 'pages/LandingPage/Home';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
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

    const rawParams = useLocation();
    const queryParams = queryString.parse(rawParams?.search);
    const salesFunnelType = queryParams?.type || 0;
    console.log('queryParams ', queryParams);
    const [theme, setTheme] = useState(Number(cookies.get('home-theme')) === 0 ? Theme.Light : Theme.Dark);
    return (
        <Background className={theme === Theme.Light ? 'light' : 'dark'}>
            <Wrapper>
                <Header theme={theme} setTheme={setTheme} />
                <Content>
                    {salesFunnelType == 0 && (
                        <>
                            <H1>{t('sales-landing.title')}</H1>
                            <SectionWrapper>
                                <ListWrapper>
                                    <List>
                                        <NestedList>
                                            <ListItem>
                                                <HashLink to="#section1">
                                                    {t('sales-landing.sections.1.heading')}
                                                </HashLink>
                                            </ListItem>
                                            <ListItem>
                                                <HashLink to="#section2">
                                                    {t('sales-landing.sections.2.heading')}
                                                </HashLink>
                                            </ListItem>
                                            <ListItem>
                                                <HashLink to="#section3">
                                                    {t('sales-landing.sections.3.heading')}
                                                </HashLink>
                                            </ListItem>
                                            <ListItem>
                                                <HashLink to="#section4">
                                                    {t('sales-landing.sections.4.heading')}
                                                </HashLink>
                                            </ListItem>
                                            <ListItem>
                                                <HashLink to="#section5">
                                                    {t('sales-landing.sections.5.heading')}
                                                </HashLink>
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
                                        marginLeft: '20px',
                                    }}
                                >
                                    <AnimationSvg type="image/svg+xml" data={GroupImg}></AnimationSvg>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <H2 id="section1">{t('sales-landing.sections.1.heading')}</H2>
                            <SectionWrapper>
                                <ParagraphContainer width="30%">
                                    <Paragraph>{t('sales-landing.sections.1.content')}</Paragraph>
                                </ParagraphContainer>
                                <IllustrationContainer width="70%">
                                    <iframe
                                        width="100%"
                                        height="480"
                                        src="https://www.youtube.com/embed/e8EKlUeQGLA"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <H2 id="section2">{t('sales-landing.sections.2.heading')}</H2>
                            <SectionWrapper>
                                <ParagraphContainer width="60%">
                                    <Paragraph>{t('sales-landing.sections.2.content')}</Paragraph>
                                </ParagraphContainer>
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={UPMarket}></AnimationSvg>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={UPChart}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2 id="section3">{t('sales-landing.sections.3.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.3.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <ParagraphContainer width="60%">
                                    <H2 id="section4">{t('sales-landing.sections.4.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.4.content')}</Paragraph>
                                </ParagraphContainer>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={DOWNChart}></AnimationSvg>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={DOWNMarket}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2 id="section5">{t('sales-landing.sections.5.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.5.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="90%" style={{ margin: '70px auto' }}>
                                    <iframe
                                        width="100%"
                                        height="480"
                                        src="https://www.youtube.com/embed/8oIgCT8GTd0"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper style={{ marginTop: '80px' }}>
                                <ParagraphContainer width="60%">
                                    <H2 id="section6">{t('sales-landing.sections.6.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.5.content')}</Paragraph>
                                </ParagraphContainer>
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={INMarket}></AnimationSvg>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={INChart}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2 id="section7">{t('sales-landing.sections.7.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.7.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper style={{ marginTop: '80px' }}>
                                <ParagraphContainer width="60%">
                                    <H2 id="section8">{t('sales-landing.sections.8.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.8.content')}</Paragraph>
                                </ParagraphContainer>
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={OUTMarket}></AnimationSvg>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={OUTChart}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2 id="section9">{t('sales-landing.sections.9.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.9.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="90%" style={{ margin: '70px auto' }}>
                                    <iframe
                                        width="100%"
                                        height="480"
                                        src="https://www.youtube.com/embed/oHSSOnXqLwU"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <ParagraphContainer width="100%">
                                    <H2 id="section10">{t('sales-landing.sections.10.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.10.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                        </>
                    )}
                    {salesFunnelType == 1 && (
                        <>
                            <H1>{t('sales-landing.title')}</H1>
                            <SectionWrapper>
                                <ParagraphContainer width="30%">
                                    <H2>{t('sales-landing.sections-short-version.1.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections-short-version.1.content')}</Paragraph>
                                </ParagraphContainer>
                                <IllustrationContainer width="70%">
                                    <iframe
                                        width="100%"
                                        height="480"
                                        src="https://www.youtube.com/embed/e8EKlUeQGLA"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={UPMarket}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2>{t('sales-landing.sections-short-version.2.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections.2.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={DOWNMarket}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2>{t('sales-landing.sections-short-version.3.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections-short-version.3.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={INMarket}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2>{t('sales-landing.sections-short-version.4.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections-short-version.4.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <IllustrationContainer width="40%" style={{ marginRight: '30px' }}>
                                    <AnimationSvg type="image/svg+xml" data={OUTMarket}></AnimationSvg>
                                </IllustrationContainer>
                                <ParagraphContainer width="60%">
                                    <H2>{t('sales-landing.sections-short-version.5.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections-short-version.5.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                            <SectionWrapper
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: '50px',
                                }}
                            >
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={DOWNChart}></AnimationSvg>
                                </IllustrationContainer>
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={UPChart}></AnimationSvg>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={INChart}></AnimationSvg>
                                </IllustrationContainer>
                                <IllustrationContainer width="40%">
                                    <AnimationSvg type="image/svg+xml" data={OUTChart}></AnimationSvg>
                                </IllustrationContainer>
                            </SectionWrapper>
                            <SectionWrapper>
                                <ParagraphContainer width="100%">
                                    <H2>{t('sales-landing.sections-short-version.6.heading')}</H2>
                                    <Paragraph>{t('sales-landing.sections-short-version.6.content')}</Paragraph>
                                </ParagraphContainer>
                            </SectionWrapper>
                        </>
                    )}
                </Content>
            </Wrapper>
        </Background>
    );
};

export default SalesLanding;
