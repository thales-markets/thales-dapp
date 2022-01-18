import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import Header from '../../components/Header';
import pic from 'assets/images/landing-page/articles/token.png';
import picBlack from 'assets/images/landing-page/articles/token-black.png';
import { Background, Theme } from '../../Home';

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
    grid-template-rows: repeat(77, 2em);
    @media (max-width: 600px) {
        grid-template-rows: repeat(104, 2em);
    }
`;

const Content = styled.div`
    grid-column-start: 7;
    grid-column-end: 48;
    grid-row-start: 8;
    grid-row-end: 76;
`;

const Image = styled.img`
    margin: 80px 0;
    object-fit: contain;
`;

const H1 = styled.h1`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 50px;
    line-height: 91.91%;
    text-align: justify;
    text-transform: uppercase;
    color: var(--color);
    margin-top: 80px;
    margin-bottom: 40px;
`;
const H2 = styled.h2`
    font-family: Nunito;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: justified;
    color: var(--color);
    margin-top: 40px;
    margin-bottom: 20px;
`;
const Paragraph = styled.p`
    &,
    & * {
        color: var(--color);
        font-family: Nunito;
        font-size: 20px;
        font-style: normal;
        font-weight: 300;
        line-height: 20px;
        letter-spacing: 0em;
        text-align: justified;
        white-space: pre-line;
    }
`;

const List = styled.ul`
    list-style: disc;
`;
const ListItem = styled.li`
    &,
    & a {
        font-family: Nunito !important;
        font-style: normal;
        font-weight: bold;
        font-size: 20px;
        line-height: 170%;
        color: var(--color);
    }
`;

export default Token;
