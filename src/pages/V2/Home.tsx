import React, { useState } from 'react';
import styled from 'styled-components';
import GridLayout from './components/GridLayout';
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';
import BlogPosts from './components/BlogPosts';
import Footer from './components/Footer';

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
                <FlexDiv className="initiatives">
                    <Thales className="icon-home icon-home--thales" />
                    <ThalesRoyale className="icon-home icon-home--royale" />
                    <ThalesGame className="icon-home icon-home--game" />
                </FlexDiv>
                <Title style={{ marginBottom: '1em' }}> {t('landing-page.integrations')}</Title>
                <FlexDiv>
                    <SNX
                        className="icon-home icon-home--snx"
                        onClick={() => window.open('https://synthetix.io/', '_blank')}
                    />
                    <INCH
                        className="icon-home icon-home--inch"
                        onClick={() => window.open('https://1inch.io/', '_blank')}
                    />
                </FlexDiv>
                <FlexDiv>
                    <LINK
                        className="icon-home icon-home--link"
                        onClick={() => window.open('https://chain.link/', '_blank')}
                    />
                    <OPTIMISM
                        className="icon-home icon-home--optimism"
                        onClick={() => window.open('https://www.optimism.io/', '_blank')}
                    />
                </FlexDiv>
                <Title style={{ marginTop: 100 }}> {t('landing-page.newest-blog-posts')}</Title>
                <BlogPosts />
                <Title id="faq-section" style={{ marginTop: 50 }}>
                    {t('landing-page.faq.title')}
                </Title>
                <Faq>
                    <FaqQuestion>{t('landing-page.faq.firstQ')}</FaqQuestion>
                    <FaqAnswer>{t('landing-page.faq.firstA')}</FaqAnswer>
                    <FaqQuestion>{t('landing-page.faq.secondQ')}</FaqQuestion>
                    <FaqAnswer>{t('landing-page.faq.secondA')}</FaqAnswer>
                    <FaqQuestion>{t('landing-page.faq.thirdQ')}</FaqQuestion>
                    <FaqAnswer>{t('landing-page.faq.thirdA')}</FaqAnswer>
                </Faq>
                <Footer theme={theme} setTheme={setTheme} />
            </FlexWrapper>
        </Background>
    );
};

export default Home;

export const Background = styled.div`
    width: 100%;
    font-size: 16px;

    @media (max-width: 1440px) {
        font-size: 14px;
    }

    &.light {
        background: #f7f7f7;
        --main-background: #f7f7f7;
        --color: #052040;
        --background: #ffffff;
    }
    &.dark {
        background: #052040;
        --main-background: #052040;
        --color: #f7f7f7;
        --background: #1b314f;
    }
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1122px;
    align-items: center;
    padding: 0 20px;
`;

const Title = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 4.4em;
    @media (max-width: 600px) {
        font-size: 2em;
    }
    line-height: 91.91%;
    text-align: center;
    color: var(--color);
`;

const FlexDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    color: var(--color);
    flex-wrap: wrap;
    &.initiatives {
        & > i {
            @media (max-width: 600px) {
                flex: 1 40%;
                text-align: center;
            }
        }
    }
`;

const IconAbs = styled.i`
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        transform: scale(1.2);
    }
    &:before {
        pointer-events: none;
    }
`;

const Thales = styled(IconAbs)`
    font-size: 16em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;
const ThalesRoyale = styled(IconAbs)`
    font-size: 12em;
    @media (max-width: 600px) {
        font-size: 7em;
    }
`;
const ThalesGame = styled(IconAbs)`
    font-size: 16em;
    @media (max-width: 600px) {
        font-size: 10em;
        line-height: 0.2em;
        margin-bottom: 90px;
    }
`;

const SNX = styled(IconAbs)`
    font-size: 16em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;
const OPTIMISM = styled(IconAbs)`
    font-size: 20em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;
const LINK = styled(IconAbs)`
    font-size: 20em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;
const INCH = styled(IconAbs)`
    font-size: 20em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
    }
`;

const Faq = styled.div`
    background: var(--background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    margin: 3em 4em;
    padding: 2em;
    @media (max-width: 600px) {
        margin-left: 0;
        margin-right: 0;
        padding: 36px 30px 24px;
    }
`;

const FaqQuestion = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 1.5em;
    line-height: 91.91%;
    color: var(--color);
    margin-bottom: 1em;
    @media (max-width: 600px) {
        margin-bottom: 24px;
    }
`;

const FaqAnswer = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 1.2em;
    color: var(--color);
    &:not(:last-child) {
        border-bottom: 1px solid var(--color);
        padding-bottom: 2em;
        margin-bottom: 2em;
        @media (max-width: 600px) {
            margin-bottom: 30px;
            padding-bottom: 24px;
        }
    }
`;
