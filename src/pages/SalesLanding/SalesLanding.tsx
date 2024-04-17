import Header from 'pages/LandingPage/components/Header/Header';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import {
    AnimationSvg,
    Background,
    ButtonContainer,
    Content,
    H1,
    H2,
    IllustrationContainer,
    List,
    ListItem,
    ListWrapper,
    NestedList,
    OrderedItem,
    OrderedList,
    OrderedListContrainer,
    Paragraph,
    ParagraphContainer,
    SectionWrapper,
    Wrapper,
} from './styled-components';

import DOWNChart from 'assets/images/sales-funnel/DOWNchart.svg';
import DOWNMarket from 'assets/images/sales-funnel/DOWNmarket.svg';
import INChart from 'assets/images/sales-funnel/INchart.svg';
import INMarket from 'assets/images/sales-funnel/INmarket.svg';
import OUTChart from 'assets/images/sales-funnel/OUTchart.svg';
import OUTMarket from 'assets/images/sales-funnel/OUTmarket.svg';
import UPChart from 'assets/images/sales-funnel/UPchart.svg';
import UPMarket from 'assets/images/sales-funnel/UPmarket.svg';
import ROUTES from 'constants/routes';
import { buildHref } from 'utils/routes';

import termsOfUseReferral from 'assets/docs/thales-terms-of-use.pdf';
import Footer from 'pages/LandingPage/components/Footer';
import styled from 'styled-components';

const SalesLanding: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Background>
            <Wrapper>
                <Header />
            </Wrapper>
            <Content>
                <H1>
                    <Trans
                        i18nKey="sales-landing.title"
                        components={{
                            bold: <BoldHeading />,
                        }}
                    />
                </H1>
                <FirstParagraph>
                    <Trans
                        i18nKey="sales-landing.first-section"
                        components={{
                            bold: <HighlightedUnderlined />,
                            br: <br />,
                        }}
                    />
                </FirstParagraph>
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
                </SectionWrapper>
                <H2 id="section1">{t('sales-landing.sections.1.heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.1.content'}
                        components={{
                            br: <br />,
                        }}
                    />
                </Paragraph>
                <H2 id="section1">{t('sales-landing.sections.2.heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.2.content'}
                        components={{
                            br: <br />,
                        }}
                    />
                </Paragraph>
                <H2 id="section1">{t('sales-landing.sections.3.heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.3.first-paragraph'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
                <OrderedListContrainer>
                    <OrderedList>
                        <OrderedItem>
                            <Trans i18nKey={'sales-landing.sections.3.list.1'} components={{ bold: <Bold /> }} />
                        </OrderedItem>
                        <OrderedItem>
                            <Trans i18nKey={'sales-landing.sections.3.list.2'} components={{ bold: <Bold /> }} />
                        </OrderedItem>
                        <OrderedItem>
                            <Trans i18nKey={'sales-landing.sections.3.list.3'} components={{ bold: <Bold /> }} />
                        </OrderedItem>
                        <OrderedItem>
                            <Trans i18nKey={'sales-landing.sections.3.list.4'} components={{ bold: <Bold /> }} />
                        </OrderedItem>
                        <OrderedItem>
                            <Trans i18nKey={'sales-landing.sections.3.list.5'} components={{ bold: <Bold /> }} />
                        </OrderedItem>
                    </OrderedList>
                </OrderedListContrainer>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.3.second-paragraph'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
                <ButtonContainer>
                    <Button>{t('sales-landing.buttons.go-to')}</Button>
                </ButtonContainer>
                <H2>{t('sales-landing.sections.4.content-heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.4.content'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
                <SectionWrapper>
                    <ParagraphContainer width="60%">
                        <IllustrationContainer width="100%" style={{ marginTop: '20px', marginBottom: '40px' }}>
                            <AnimationSvg type="image/svg+xml" data={UPMarket}></AnimationSvg>
                        </IllustrationContainer>
                        <Paragraph>
                            <Trans
                                i18nKey={'sales-landing.sections.2.content'}
                                components={{
                                    marketoverview: <a href={buildHref(ROUTES.Options.Overview)} />,
                                }}
                            />
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
                            <Trans
                                i18nKey={'sales-landing.sections.3.content'}
                                components={{
                                    marketoverview: <a href={buildHref(ROUTES.Options.Overview)} />,
                                }}
                            />
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
                            <Trans
                                i18nKey={'sales-landing.sections.4.content'}
                                components={{
                                    marketoverview: <a href={buildHref(ROUTES.Options.Overview)} />,
                                }}
                            />
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
                            <Trans
                                i18nKey={'sales-landing.sections.5.content'}
                                components={{
                                    marketoverview: <a href={buildHref(ROUTES.Options.Overview)} />,
                                }}
                            />
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
                                components={{ a: <a href={buildHref(ROUTES.Options.Referral)} /> }}
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
                                components={{ this: <a href={buildHref(termsOfUseReferral)} /> }}
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
                                components={{
                                    poslink: <a href={buildHref(ROUTES.Options.Overview)} />,
                                    rangelink: <a href={buildHref(ROUTES.Options.RangeMarkets)} />,
                                }}
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
                <ButtonContainer>
                    <Button href={buildHref(ROUTES.Options.Overview)}>
                        {t('sales-landing.button-positional-markets')}
                    </Button>
                    <Button href={buildHref(ROUTES.Options.RangeMarkets)}>
                        {t('sales-landing.button-range-markets')}
                    </Button>
                </ButtonContainer>
            </Content>
            <Footer />
        </Background>
    );
};

const BoldHeading = styled.span`
    font-weight: 700;
    color: ${(props) => props.theme.landingPage.textColor.tertiary};
    font-family: Playfair Display !important;
`;

const FirstParagraph = styled(Paragraph)`
    font-weight: 600;
    font-style: italic !important;
`;

const HighlightParagraph = styled.span`
    color: ${(props) => props.theme.landingPage.textColor.tertiary};
    font-weight: 800;
`;

const Bold = styled.span`
    font-weight: 800;
`;

const HighlightedUnderlined = styled.span`
    color: ${(props) => props.theme.landingPage.textColor.tertiary};
    text-decoration: underline;
    font-style: italic !important;
`;

const Button = styled.a`
    display: flex;
    align-items: center;
    font-family: Nunito !important;
    padding: 11px 36px;
    border-radius: 32px;
    font-weight: 800;
    font-size: 24px;
    cursor: pointer;
    color: ${(props) => props.theme.landingPage.button.textColor.primary};
    background-color: ${(props) => props.theme.landingPage.button.background.primary};
    &:after {
        font-family: Icons !important;
        content: '\\007A';
        color: ${(props) => props.theme.landingPage.button.textColor.primary};
        padding-left: 10px;
        font-weight: 900;
        vertical-align: text-top;
    }
`;

export default SalesLanding;
