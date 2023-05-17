import { ReactComponent as Chart1White } from 'assets/images/landing-page/articles/chart1b.svg';
import { ReactComponent as Chart2White } from 'assets/images/landing-page/articles/chart2b.svg';
import { ReactComponent as Chart3White } from 'assets/images/landing-page/articles/chart3b.svg';
import { ReactComponent as Chart4White } from 'assets/images/landing-page/articles/chart4b.svg';
import { ReactComponent as Chart5White } from 'assets/images/landing-page/articles/chart5b.svg';
import { ReactComponent as ThalesLogoWhitepaperWhite } from 'assets/images/landing-page/articles/thales-logo-whitepaper-white.svg';
import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Header/Header';
import { Background } from '../../Home';

import { Trans, useTranslation } from 'react-i18next';
import { FlexDivCentered } from '../../../../theme/common';
import Footer from '../../components/Footer';

const Whitepaper: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Background className={'dark'}>
            <Wrapper>
                <Header />
                <Content>
                    <FlexDivCentered>
                        <ThalesLogoWhitepaperWhite />
                    </FlexDivCentered>
                    <FlexDivCentered>
                        <H1>{t('articles.whitepaper.title')}</H1>
                    </FlexDivCentered>
                    <FlexDivCentered>
                        <Date>{t('articles.whitepaper.date')}</Date>
                    </FlexDivCentered>
                    <H2>{t('articles.whitepaper.paragraphs.abstract.title')}</H2>
                    <Paragraph>{t('articles.whitepaper.paragraphs.abstract.section1')}</Paragraph>
                    <H2>{t('articles.whitepaper.paragraphs.1.title')}</H2>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1.section1')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1.section2')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1.section3')}</Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.1-1.title')}</H3>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1-1.section1')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1-1.section2')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1-1.section3')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1-1.section4')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1-1.section5')}</Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.1-2.title')}</H3>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1-2.section1')}</Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.1-3.title')}</H3>
                    <Paragraph>{t('articles.whitepaper.paragraphs.1-3.section1')}</Paragraph>
                    <H2>{t('articles.whitepaper.paragraphs.2.title')}</H2>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2.section1')}</Paragraph>
                    <ListItem bold={true}>ParimutuelMarketManager.sol</ListItem>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2.section2')}</Paragraph>
                    <ListItem bold={true}>ParimutuelMarketFactory.sol</ListItem>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2.section3')}</Paragraph>
                    <ListItem bold={true}>ParimutuelMarket.sol</ListItem>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2.section4')}</Paragraph>
                    <ListItem bold={true}>ParimutuelPosition.sol</ListItem>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2.section5')}</Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.2-1.title')}</H3>
                    <ChartContainer>
                        <Chart1White />
                        <ChartLabel>{t('articles.whitepaper.paragraphs.2-1.chartlabel')}</ChartLabel>
                    </ChartContainer>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2-1.section1')}</Paragraph>
                    <List>
                        <ListItem bold={true}>{t('articles.whitepaper.paragraphs.2-1.listitem1')}</ListItem>
                        <ListItem bold={true}>{t('articles.whitepaper.paragraphs.2-1.listitem2')}</ListItem>
                        <ListItem bold={true}>{t('articles.whitepaper.paragraphs.2-1.listitem3')}</ListItem>
                        <ListItem bold={true} style={{ marginBottom: '1em' }}>
                            {t('articles.whitepaper.paragraphs.2-1.listitem4')}
                        </ListItem>
                    </List>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.whitepaper.paragraphs.2-1.section2"
                            components={{
                                bold: <strong />,
                            }}
                        />
                    </Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.2-2.title')}</H3>
                    <ChartContainer>
                        <Chart2White />
                        <ChartLabel>{t('articles.whitepaper.paragraphs.2-2.chartlabel')}</ChartLabel>
                    </ChartContainer>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2-2.section1')}</Paragraph>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.whitepaper.paragraphs.2-2.section2"
                            components={{
                                bold: <strong />,
                            }}
                        />
                    </Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.2-3.title')}</H3>
                    <ChartContainer>
                        <Chart3White />
                        <ChartLabel>{t('articles.whitepaper.paragraphs.2-3.chartlabel')}</ChartLabel>
                    </ChartContainer>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2-3.section1')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.2-3.section2')}</Paragraph>
                    <H2>{t('articles.whitepaper.paragraphs.3.title')}</H2>
                    <Paragraph>{t('articles.whitepaper.paragraphs.3.section1')}</Paragraph>
                    <ChartContainer>
                        <Chart4White />
                    </ChartContainer>
                    <Paragraph>{t('articles.whitepaper.paragraphs.3.section2')}</Paragraph>
                    <List>
                        <ListItem bold={true}>{t('articles.whitepaper.paragraphs.3.listitem1')}</ListItem>
                        <ListItem bold={true}>{t('articles.whitepaper.paragraphs.3.listitem2')}</ListItem>
                        <ListItem bold={true} style={{ marginBottom: '1em' }}>
                            {t('articles.whitepaper.paragraphs.3.listitem3')}
                        </ListItem>
                    </List>
                    <Paragraph>{t('articles.whitepaper.paragraphs.3.section3')}</Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.3-1.title')}</H3>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.whitepaper.paragraphs.3-1.section1"
                            components={{
                                bold: <strong />,
                            }}
                        />
                    </Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.3-1.section2')}</Paragraph>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.whitepaper.paragraphs.3-1.section3"
                            components={{
                                bold: <strong />,
                            }}
                        />
                    </Paragraph>
                    <List>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem1')}</ListItem>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem2')}</ListItem>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem3')}</ListItem>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem4')}</ListItem>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem5')}</ListItem>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem6')}</ListItem>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem7')}</ListItem>
                        <ListItem>{t('articles.whitepaper.paragraphs.3-1.listitem8')}</ListItem>
                    </List>
                    <H3>{t('articles.whitepaper.paragraphs.3-2.title')}</H3>
                    <Paragraph>{t('articles.whitepaper.paragraphs.3-2.section1')}</Paragraph>
                    <H3>{t('articles.whitepaper.paragraphs.3-3.title')}</H3>
                    <Paragraph>{t('articles.whitepaper.paragraphs.3-3.section1')}</Paragraph>
                    <H2>{t('articles.whitepaper.paragraphs.4.title')}</H2>
                    <ChartContainer>
                        <Chart5White />
                    </ChartContainer>
                    <Paragraph>{t('articles.whitepaper.paragraphs.4.section1')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.4.section2')}</Paragraph>
                    <Paragraph>{t('articles.whitepaper.paragraphs.4.section3')}</Paragraph>
                    <Footer className="article" />
                </Content>
            </Wrapper>
        </Background>
    );
};

const Wrapper = styled.div`
    display: grid;
    width: 100%;
    margin: auto;
    max-width: 1122px;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(325, 2em);
`;

const Content = styled.div`
    grid-column-start: 7;
    grid-column-end: 48;
    grid-row-start: 8;
    grid-row-end: 80;
    width: 100%;
    @media (max-width: 1024px) {
        position: absolute;
        display: block;
        top: 140px;
        width: 100vw;
        padding: 0 40px;
        z-index: 9;
        grid-column-start: unset;
        grid-column-end: unset;
        grid-row-start: unset;
        grid-row-end: unset;
    }
`;

const H1 = styled.h1`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 3.8em;
    line-height: 91.91%;
    text-align: justify;
    text-transform: uppercase;
    color: var(--color-white);
    margin-top: 0.2em;
    margin-bottom: 0.6em;
`;

const H2 = styled.h2`
    font-family: NunitoSemiBold !important;
    font-size: 1.7em;
    font-style: normal;
    line-height: 1em;
    letter-spacing: 0em;
    text-align: justified;
    color: var(--color-white);
    margin-top: 2em;
    margin-bottom: 1em;
`;

const H3 = styled.h3`
    font-family: NunitoSemiBold !important;
    font-size: 1.4em;
    font-style: normal;
    line-height: 1em;
    letter-spacing: 0em;
    text-align: justified;
    color: var(--color-white);
    margin-top: 2em;
    margin-bottom: 1em;
`;

const Paragraph = styled.p`
    font-size: 1.4em;
    line-height: 1em;
    margin-bottom: 1em;
    &,
    & * {
        color: var(--color-white);
        font-family: NunitoExtraLight !important;
        font-style: normal;
        font-weight: 300;
        letter-spacing: 0em;
        text-align: justified;
        white-space: pre-line;
    }
    strong {
        font-family: NunitoSemiBold !important;
    }
`;

const Date = styled.h1`
    font-family: NunitoExtraLight !important;
    color: var(--color-white);
    font-size: 1.2em;
`;

const List = styled.ul`
    list-style: disc;
    color: var(--color-white);
    list-style-position: inside;
`;

const ListItem = styled.li<{ bold?: boolean }>`
    font-family: ${(props) => (props.bold ? 'NunitoSemiBold !important' : 'NunitoExtraLight !important')};
    margin-bottom: 0.5em;
    color: var(--color-white);
    font-size: 1.3em;
`;

const ChartContainer = styled(FlexDivCentered)`
    position: relative;
    margin: 3em 0;
`;

const ChartLabel = styled.span`
    font-family: NunitoExtraLight !important;
    position: absolute;
    bottom: -1.55em;
    left: 0;
    right: 0;
    color: var(--color-white);
    text-align: center;
`;

export default Whitepaper;
