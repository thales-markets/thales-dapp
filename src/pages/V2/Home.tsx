import React, { useState } from 'react';
import styled from 'styled-components';
import GridLayout from './components/GridLayout';
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';
import BlogPosts from './components/BlogPosts';

export enum Theme {
    Light,
    Dark,
}

const cookies = new Cookies();

const Home: React.FC = () => {
    const { t } = useTranslation();
    const [theme, setTheme] = useState(Number(cookies.get('home-theme')) === 0 ? Theme.Light : Theme.Dark);

    return (
        <Background className={theme === Theme.Light ? 'light' : 'dark'}>
            <GridLayout theme={theme} setTheme={setTheme} />
            <FlexWrapper>
                <Title> {t('landing-page.initiatives')}</Title>
                <FlexDiv>
                    <Thales className="icon-home icon-home--thales" />
                    <ThalesRoyale className="icon-home icon-home--royale" />
                    <ThalesGame className="icon-home icon-home--game" />
                </FlexDiv>
                <Title> {t('landing-page.integrations')}</Title>
                <FlexDiv style={{ marginBottom: 50 }}>
                    <SNX className="icon-home icon-home--snx" />
                    <INCH className="icon-home icon-home--inch" />
                </FlexDiv>
                <FlexDiv>
                    <LINK className="icon-home icon-home--link" />
                    <OPTIMISM className="icon-home icon-home--optimism" />
                </FlexDiv>
                <Title> {t('landing-page.newest-blog-posts')}</Title>
                <BlogPosts />
            </FlexWrapper>
        </Background>
    );
};

export default Home;

const Background = styled.div`
    width: 100%;
    &.light {
        background: #f7f7f7;
        --color: #052040;
        --background: #ffffff;
    }
    &.dark {
        background: #052040;
        --color: #f7f7f7;
        --background: #1b314f;
    }
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1440px;
    align-items: center;
`;

const Title = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 70px;
    line-height: 91.91%;
    text-align: center;
    color: var(--color);
    margin-bottom: 90px;
`;

const FlexDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    color: var(--color);
    margin-bottom: 90px;
`;

const Thales = styled.i`
    font-size: 400px;
    line-height: 92px;
`;
const ThalesRoyale = styled.i`
    font-size: 220px;
    line-height: 110px;
`;
const ThalesGame = styled.i`
    font-size: 320px;
    line-height: 124px;
`;

const SNX = styled.i`
    font-size: 400px;
    line-height: 40px;
`;
const OPTIMISM = styled.i`
    font-size: 440px;
    line-height: 60px;
`;
const LINK = styled.i`
    font-size: 440px;
    line-height: 140px;
`;
const INCH = styled.i`
    font-size: 420px;
    line-height: 210px;
`;
