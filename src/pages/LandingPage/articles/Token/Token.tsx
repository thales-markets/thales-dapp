import picBlack from 'assets/images/landing-page/articles/token-black.svg';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import styled from 'styled-components';
import Footer from '../../components/Footer';
import Header from '../../components/Header/Header';
import { Background } from '../../Home';

const Token: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Background className={'dark'}>
            <Wrapper>
                <Header />
                <Content>
                    <H1>{t('articles.token.title')}</H1>
                    <ListWrapper>
                        <List>
                            <ListItem>THALES Token</ListItem>
                            <NestedList>
                                <ListItem>
                                    <HashLink to="#section1">{t('articles.token.list.1')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section2">{t('articles.token.list.2')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section3">{t('articles.token.list.3')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section4">{t('articles.token.list.4')}</HashLink>
                                </ListItem>
                                <ListItem>
                                    <HashLink to="#section5">{t('articles.token.list.5')}</HashLink>
                                </ListItem>
                            </NestedList>
                        </List>
                    </ListWrapper>

                    <H2 id="section1">{t('articles.token.list.1')}</H2>
                    <Paragraph>
                        <Trans i18nKey="articles.token.paragraphs.1" components={{ bold: <strong /> }} />
                    </Paragraph>

                    <H2 id="section2">{t('articles.token.list.2')}</H2>
                    <Paragraph>
                        <Trans i18nKey="articles.token.paragraphs.2" components={{ bold: <strong /> }} />
                    </Paragraph>
                    <PieChart>
                        <AnimationSvg type="image/svg+xml" data={picBlack}></AnimationSvg>
                    </PieChart>

                    <Paragraph>
                        <Trans
                            i18nKey="articles.token.paragraphs.3"
                            components={{
                                bold: <strong />,
                                bold2: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://github.com/thales-markets/thales-improvement-proposals/blob/main/TIPs/TIP-18.md"
                                    />
                                ),
                            }}
                        />
                    </Paragraph>

                    <H2 id="section3">{t('articles.token.list.3')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.token.paragraphs.4"
                            components={{
                                bold: <a target="_blank" rel="noreferrer" href="https://app.dodoex.io/" />,
                                bold2: <a target="_blank" rel="noreferrer" href="https://app.uniswap.org/#/swap" />,
                                bold3: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://github.com/thales-markets/thales-improvement-proposals/blob/main/TIPs/TIP-17.md"
                                    />
                                ),
                            }}
                        />
                    </Paragraph>

                    <H2 id="section4">{t('articles.token.list.4')}</H2>
                    <Paragraph>
                        <Trans i18nKey="articles.token.paragraphs.5" components={{ bold: <strong /> }} />
                    </Paragraph>

                    <H2 id="section5">{t('articles.token.list.5')}</H2>
                    <Paragraph>
                        <Trans i18nKey="articles.token.paragraphs.6" components={{ bold: <strong /> }} />
                    </Paragraph>
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
    grid-template-rows: repeat(89, 2em);
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

const PieChart = styled.div`
    padding: 0 20px;
    object-fit: contain;
    width: 100%;
    margin: 4em auto;
`;

const H1 = styled.h1`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 3.8em;
    line-height: 91.91%;
    text-align: justify;
    text-transform: uppercase;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    margin-top: 1em;
    margin-bottom: 1.3em;
`;
const H2 = styled.h2`
    font-family: NunitoSemiBold !important;
    font-size: 1.4em;
    font-style: normal;
    font-weight: 700;
    line-height: 1em;
    letter-spacing: 0em;
    text-align: justified;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    margin-top: 2em;
    margin-bottom: 1em;
`;
const Paragraph = styled.p`
    font-size: 1.4em;
    line-height: 1em;
    &,
    & * {
        color: ${(props) => props.theme.landingPage.textColor.primary};
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
    a {
        font-family: NunitoSemiBold !important;
        text-decoration: underline;
    }
`;

const AnimationSvg = styled.object``;

const ListWrapper = styled.div`
    border: 1px solid ${(props) => props.theme.landingPage.textColor.primary};
    border-radius: 7px;
    width: 38em;
    margin-bottom: 4em;
    @media (max-width: 600px) {
        width: 100%;
    }
}
`;

const List = styled.ul`
    list-style: disc;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    margin-left: 2em;
    padding: 1.5em;
    & > li {
        font-family: Nunito !important;
        font-style: normal;
        font-size: 1.4em;
        font-weight: 700;
        line-height: 170%;
        height: 2em;
    }
    @media (max-width: 600px) {
        margin-left: 1em;
    }
`;

const NestedList = styled.ul`
    list-style: none;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    & li {
        &:before {
            content: '\\25BA \\0020';
            padding-right: 0.5em;
            vertical-align: text-top;
        }
        & > a {
            font-family: Nunito !important;
            font-style: normal;
            font-size: 1.4em;
            font-weight: 300;
            line-height: 170%;
            color: ${(props) => props.theme.landingPage.textColor.primary};
            &:hover {
                font-size: 1.6em;
                transition: 0.2s;
            }
        }
        @media (max-width: 450px) {
            &:nth-child(3),
            &:nth-child(4),
            &:nth-child(5) {
                padding-bottom: 5em;
            }
        }
    }
`;

const ListItem = styled.li`
    height: 3em;
    color: ${(props) => props.theme.landingPage.textColor.primary};
`;

export default Token;
