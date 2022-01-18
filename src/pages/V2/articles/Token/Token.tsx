import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import Header from '../../components/Header';
import pic from 'assets/images/landing-page/articles/token.png';
import picBlack from 'assets/images/landing-page/articles/token-black.png';
import { Background, Theme } from '../../Home';
import Footer from 'pages/V2/components/Footer';

const cookies = new Cookies();

const Token: React.FC = () => {
    const [theme, setTheme] = useState(Number(cookies.get('home-theme')) === 0 ? Theme.Light : Theme.Dark);
    const { t } = useTranslation();
    return (
        <Background className={theme === Theme.Light ? 'light' : 'dark'}>
            <Wrapper>
                <Header theme={theme} setTheme={setTheme} />
                <Content>
                    <List>
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
                    </List>

                    <H1>{t('articles.token.title')}</H1>
                    <H2 id="section1">{t('articles.token.list.1')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.token.paragraphs.1"
                            components={{ bold: <span style={{ fontWeight: 700 }} /> }}
                        />
                    </Paragraph>

                    <H2 id="section2">{t('articles.token.list.2')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.token.paragraphs.2"
                            components={{ bold: <span style={{ fontWeight: 700 }} /> }}
                        />
                    </Paragraph>
                    <Image src={theme !== Theme.Dark ? pic : picBlack} />

                    <H2 id="section3">{t('articles.token.list.3')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.token.paragraphs.3"
                            components={{
                                bold: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://app.dodoex.io/"
                                        style={{ fontWeight: 700, textDecoration: 'underline' }}
                                    />
                                ),
                                bold2: (
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://app.uniswap.org/#/swap"
                                        style={{ fontWeight: 700, textDecoration: 'underline' }}
                                    />
                                ),
                            }}
                        />
                    </Paragraph>

                    <H2 id="section4">{t('articles.token.list.4')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.token.paragraphs.4"
                            components={{ bold: <span style={{ fontWeight: 700 }} /> }}
                        />
                    </Paragraph>

                    <H2 id="section5">{t('articles.token.list.5')}</H2>
                    <Paragraph>
                        <Trans
                            i18nKey="articles.token.paragraphs.5"
                            components={{ bold: <span style={{ fontWeight: 700 }} /> }}
                        />
                    </Paragraph>
                    <Footer className="article" theme={theme} />
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
    grid-template-rows: repeat(82, 2em);
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
        z-index: 10;
        grid-column-start: unset;
        grid-column-end: unset;
        grid-row-start: unset;
        grid-row-end: unset;
    }
`;

const Image = styled.img`
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
    margin-top: 2em;
    margin-bottom: 1.6em;
`;
const H2 = styled.h2`
    font-family: Nunito !important;
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
        font-family: Nunito !important;
        font-style: normal;
        font-weight: 300;
        letter-spacing: 0em;
        text-align: justified;
        white-space: pre-line;
    }
`;

const List = styled.ul`
    list-style: disc;
`;
const ListItem = styled.li`
    height: 3em;
    & > a {
        font-family: Nunito !important;
        font-style: normal;
        font-weight: bold;
        font-size: 1.4em;
        line-height: 170%;
        color: var(--color);
        &:hover {
            font-size: 1.6em;
            transition: 0.2s;
        }
    }
`;

export default Token;
