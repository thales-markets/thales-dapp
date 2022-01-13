import React, { useState } from 'react';
import styled from 'styled-components';
import GridLayout from './components/GridLayout';
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';
import BlogPosts from './components/BlogPosts';
import footer from 'assets/images/landing-page/footer.png';
import footerW from 'assets/images/landing-page/footer-white.png';
import { IconLink } from 'theme/common';

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
                <Title style={{ marginBottom: '1em' }}> {t('landing-page.integrations')}</Title>
                <FlexDiv>
                    <SNX className="icon-home icon-home--snx" />
                    <INCH className="icon-home icon-home--inch" />
                </FlexDiv>
                <FlexDiv>
                    <LINK className="icon-home icon-home--link" />
                    <OPTIMISM className="icon-home icon-home--optimism" />
                </FlexDiv>
                <Title style={{ marginTop: 50 }}> {t('landing-page.newest-blog-posts')}</Title>
                <BlogPosts />
                <Title style={{ marginTop: 50 }}> {t('landing-page.faq.title')}</Title>
                <Faq>
                    <FaqQuestion>{t('landing-page.faq.firstQ')}</FaqQuestion>
                    <FaqAnswer>{t('landing-page.faq.firstA')}</FaqAnswer>
                    <FaqQuestion>{t('landing-page.faq.secondQ')}</FaqQuestion>
                    <FaqAnswer>{t('landing-page.faq.secondA')}</FaqAnswer>
                    <FaqQuestion>{t('landing-page.faq.thirdQ')}</FaqQuestion>
                    <FaqAnswer>{t('landing-page.faq.thirdA')}</FaqAnswer>
                </Faq>
                <Footer>
                    <Image src={theme === Theme.Dark ? footerW : footer} />
                    <FooterIconsWrapper>
                        <IconLink target="_blank" rel="noreferrer" href="https://github.com/thales-markets">
                            <FooterIcon className="icon-home icon-home--github" />
                        </IconLink>
                        <IconLink target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                            <FooterIcon className="icon-home icon-home--discord" />
                        </IconLink>
                        <IconLink target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                            <FooterIcon className="icon-home icon-home--medium" />
                        </IconLink>
                        <IconLink target="_blank" rel="noreferrer" href="https://twitter.com/ThalesMarket">
                            <FooterIcon className="icon-home icon-home--twitter" />
                        </IconLink>

                        <IconLink target="_blank" rel="noreferrer" href="https://docs.thales.market/">
                            <FooterIcon className="icon-home icon-home--docs" />
                        </IconLink>
                    </FooterIconsWrapper>
                </Footer>
            </FlexWrapper>
        </Background>
    );
};

export default Home;

const Background = styled.div`
    width: 100%;
    font-size: 18px;
    @media (max-width: 512px) {
        font-size: 10px;
    }
    @media (max-width: 1024px) {
        font-size: 12px;
    }
    @media (max-width: 1440px) {
        font-size: 14px;
    }

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
    max-width: 1080px;
    align-items: center;
`;

const Title = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 3em;
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
`;

const Thales = styled.i`
    font-size: 16em;
`;
const ThalesRoyale = styled.i`
    font-size: 12em;
`;
const ThalesGame = styled.i`
    font-size: 16em;
`;

const IconAbs = styled.i`
    line-height: 0.5em;
`;

const SNX = styled(IconAbs)`
    font-size: 16em;
`;
const OPTIMISM = styled(IconAbs)`
    font-size: 20em;
`;
const LINK = styled(IconAbs)`
    font-size: 20em;
`;
const INCH = styled(IconAbs)`
    font-size: 20em;
`;

const Faq = styled.div`
    background: var(--background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    margin: 3em 4em;
    padding: 2em;
`;

const FaqQuestion = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 1.5em;
    line-height: 91.91%;
    color: var(--color);
    margin-bottom: 1em;
`;

const FaqAnswer = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 91.91%;
    color: var(--color);
    &:not(:last-child) {
        border-bottom: 1px solid var(--color);
        padding-bottom: 2em;
        margin-bottom: 2em;
    }
`;

const Footer = styled.div`
    position: relative;
    top: 20px;
`;

const Image = styled.img`
    height: 100%;
    object-fit: contain;
`;

const FooterIconsWrapper = styled(FlexDiv)`
    position: absolute;
    bottom: 2em;
`;
const FooterIcon = styled.i`
    font-size: 2em;
    color: #f7f7f7;
`;
