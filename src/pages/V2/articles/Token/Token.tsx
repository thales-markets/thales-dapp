import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import Header from '../../components/Header/Header';
import pic from 'assets/images/landing-page/articles/token-white.svg';
import picBlack from 'assets/images/landing-page/articles/token-black.svg';
import { Background, Theme } from '../../Home';
import Footer from 'pages/V2/components/Footer';

const cookies = new Cookies();

const Token: React.FC = () => {
    const [theme, setTheme] = useState(Number(cookies.get('home-theme')) === 0 ? Theme.Light : Theme.Dark);
    const { t } = useTranslation();
    return (
        <Background className={theme === Theme.Light ? 'light' : 'dark'}>
            <Wrapper size={window.innerWidth}>
                <Header theme={theme} setTheme={setTheme} />
                <Content>
                    <H1>{t('articles.token.title')}</H1>
                    <ListWrapper>
                        <List>
                            <ListItem>THALES Token</ListItem>
                            <NestedList>
                                <ListItem>
                                    <a href="#section1">{t('articles.token.list.1')}</a>
                                </ListItem>
                                <ListItem>
                                    <a href="#section2">{t('articles.token.list.2')}</a>
                                </ListItem>
                                <ListItem>
                                    <a href="#section3">{t('articles.token.list.3')}</a>
                                </ListItem>
                                <ListItem>
                                    <a href="#section4">{t('articles.token.list.4')}</a>
                                </ListItem>
                                <ListItem>
                                    <a href="#section5">{t('articles.token.list.5')}</a>
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
                        <AnimationSvg type="image/svg+xml" data={theme !== Theme.Dark ? pic : picBlack}></AnimationSvg>
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
                    <Footer className="article" theme={theme} setTheme={setTheme} />
                </Content>
            </Wrapper>
        </Background>
    );
};

const Wrapper = styled.div<{ size: number }>`
    display: grid;
    width: 100%;
    margin: auto;
    max-width: 1122px;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(89, 2em);
    @media (max-width: 1025px) {
        grid-template-rows: repeat(${(props) => Math.round((1024 - props.size) / 8) + 89}, 2em);
    }
    @media (max-width: 768px) {
        grid-template-rows: repeat(${(props) => Math.round((768 - props.size) / 8) + 89}, 2em);
    }
    @media (max-width: 450px) {
        grid-template-rows: repeat(${(props) => Math.round((450 - props.size) / 2) + 89}, 2em);
    }
`;

const Content = styled.div`
    grid-column-start: 7;
    grid-column-end: 48;
    grid-row-start: 8;
    grid-row-end: 80;
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
    color: var(--color);
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
    color: var(--color);
    margin-top: 2em;
    margin-bottom: 1em;
`;
const Paragraph = styled.p`
    font-size: 1.4em;
    line-height: 1em;
    &,
    & * {
        color: var(--color);
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
    border: 1px solid var(--color);
    border-radius: 7px;
    width: 38em;
    margin-bottom: 4em;
}
`;

const List = styled.ul`
    list-style: disc;
    color: var(--color);
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
`;

const NestedList = styled.ul`
    list-style: none;
    color: var(--color);
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
            color: var(--color);
            &:hover {
                font-size: 1.6em;
                transition: 0.2s;
            }
        }
    }
`;

const ListItem = styled.li`
    height: 3em;
    color: var(--color);
`;

export default Token;
