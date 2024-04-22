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
                <H2>{t('sales-landing.sections.5.content-heading')}</H2>
                <SectionWrapper>
                    <ParagraphContainer width="60%">
                        <IllustrationContainer width="100%">
                            <AnimationSvg type="image/svg+xml" data={UPMarket}></AnimationSvg>
                        </IllustrationContainer>
                        <Paragraph>
                            <Trans
                                i18nKey={'sales-landing.sections.5.content'}
                                components={{
                                    br: <br />,
                                    highlight: <HighlightParagraph />,
                                    bold: <Bold />,
                                }}
                            />
                        </Paragraph>
                    </ParagraphContainer>
                    <IllustrationContainer width="40%">
                        <AnimationSvg type="image/svg+xml" data={UPChart}></AnimationSvg>
                    </IllustrationContainer>
                </SectionWrapper>
                <ButtonContainer>
                    <Button>{t('sales-landing.buttons.up-markets')}</Button>
                </ButtonContainer>
                <H2>{t('sales-landing.sections.6.content-heading')}</H2>
                <SectionWrapper>
                    <ParagraphContainer width="60%">
                        <IllustrationContainer width="100%">
                            <AnimationSvg type="image/svg+xml" data={DOWNMarket}></AnimationSvg>
                        </IllustrationContainer>
                        <Paragraph>
                            <Trans
                                i18nKey={'sales-landing.sections.6.content'}
                                components={{
                                    br: <br />,
                                    highlight: <HighlightParagraph />,
                                    bold: <Bold />,
                                }}
                            />
                        </Paragraph>
                    </ParagraphContainer>
                    <IllustrationContainer width="40%">
                        <AnimationSvg type="image/svg+xml" data={DOWNChart}></AnimationSvg>
                    </IllustrationContainer>
                </SectionWrapper>
                <ButtonContainer>
                    <Button>{t('sales-landing.buttons.down-markets')}</Button>
                </ButtonContainer>
                <H2>{t('sales-landing.sections.7.content-heading')}</H2>
                <SectionWrapper>
                    <ParagraphContainer width="60%">
                        <IllustrationContainer width="100%">
                            <AnimationSvg type="image/svg+xml" data={INMarket}></AnimationSvg>
                        </IllustrationContainer>
                        <Paragraph>
                            <Trans
                                i18nKey={'sales-landing.sections.7.content'}
                                components={{
                                    br: <br />,
                                    highlight: <HighlightParagraph />,
                                    bold: <Bold />,
                                }}
                            />
                        </Paragraph>
                    </ParagraphContainer>
                    <IllustrationContainer width="40%">
                        <AnimationSvg type="image/svg+xml" data={INChart}></AnimationSvg>
                    </IllustrationContainer>
                </SectionWrapper>
                <ButtonContainer>
                    <Button>{t('sales-landing.buttons.in-markets')}</Button>
                </ButtonContainer>
                <H2>{t('sales-landing.sections.8.content-heading')}</H2>
                <SectionWrapper>
                    <ParagraphContainer width="60%">
                        <IllustrationContainer width="100%">
                            <AnimationSvg type="image/svg+xml" data={OUTMarket}></AnimationSvg>
                        </IllustrationContainer>
                        <Paragraph>
                            <Trans
                                i18nKey={'sales-landing.sections.8.content'}
                                components={{
                                    br: <br />,
                                    highlight: <HighlightParagraph />,
                                    bold: <Bold />,
                                }}
                            />
                        </Paragraph>
                    </ParagraphContainer>
                    <IllustrationContainer width="40%">
                        <AnimationSvg type="image/svg+xml" data={OUTChart}></AnimationSvg>
                    </IllustrationContainer>
                </SectionWrapper>
                <ButtonContainer>
                    <Button>{t('sales-landing.buttons.out-markets')}</Button>
                </ButtonContainer>
                <H2>{t('sales-landing.sections.9.content-heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.9.first-paragraph'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
                <UnorderedList>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.btc'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.eth'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.btc'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.btc'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.btc'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.btc'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.btc'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.9.list.btc'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                </UnorderedList>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.9.second-paragraph'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
                <H2>{t('sales-landing.sections.10.content-heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.10.content'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                            link: <a href="test.com" target="_blank" />,
                        }}
                    />
                </Paragraph>
                <UnorderedList>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.10.list.1'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.10.list.2'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.10.list.3'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.10.list.4'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                    <li>
                        <Trans
                            i18nKey={'sales-landing.sections.10.list.5'}
                            components={{
                                br: <br />,
                                highlight: <HighlightParagraph />,
                                bold: <Bold />,
                            }}
                        />
                    </li>
                </UnorderedList>
                <ButtonContainer>
                    <Button>{t('sales-landing.buttons.speed-markets')}</Button>
                </ButtonContainer>
                <H2>{t('sales-landing.sections.11.content-heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.11.content'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
                <IllustrationContainer width="90%" style={{ margin: '70px auto' }}>
                    <iframe
                        width="100%"
                        height="480"
                        src="https://www.youtube.com/embed/oHSSOnXqLwU"
                        allowFullScreen
                    ></iframe>
                </IllustrationContainer>
                <H2>{t('sales-landing.sections.12.content-heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.12.content'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
                <IllustrationContainer width="90%" style={{ margin: '70px auto' }}>
                    <iframe
                        width="100%"
                        height="480"
                        src="https://www.youtube.com/embed/8oIgCT8GTd0"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </IllustrationContainer>
                <H2>{t('sales-landing.sections.13.content-heading')}</H2>
                <Paragraph>
                    <Trans
                        i18nKey={'sales-landing.sections.13.content'}
                        components={{
                            br: <br />,
                            highlight: <HighlightParagraph />,
                            bold: <Bold />,
                        }}
                    />
                </Paragraph>
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

const UnorderedList = styled.ul`
    margin: 20px 0px;
    list-style-position: inside !important;
    list-style: disc;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    li {
        color: ${(props) => props.theme.landingPage.textColor.primary};
        font-size: 21px;
        line-height: 30px;
        font-weight: 300;
    }
`;

export default SalesLanding;
