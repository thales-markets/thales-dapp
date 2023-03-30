import ElectionsBanner from 'components/ElectionsBanner';
import OpRewardsBanner from 'components/OpRewardsBanner';
import SPAAnchor from 'components/SPAAnchor';
import ROUTES from 'constants/routes';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { buildHref, navigateTo } from 'utils/routes';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from '../../constants/network';
import BlogPosts from './components/BlogPosts';
import Footer from './components/Footer';
import GridLayout from './components/GridLayout';

const INFORMATION_BANNER_ACTIVE = false;

const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Background>
            <OpRewardsBanner isLandingPage={true} />
            <ElectionsBanner isLandingPage={true} />
            {INFORMATION_BANNER_ACTIVE && (
                <Info>
                    <Trans
                        i18nKey="options.home.polygon-trading-competition-1"
                        components={{
                            bold: (
                                <strong
                                    onClick={() => {
                                        SUPPORTED_MAINNET_NETWORK_IDS_MAP[137].changeNetwork(137, () => {
                                            navigateTo(buildHref(ROUTES.Options.Home));
                                        });
                                    }}
                                />
                            ),
                        }}
                    />
                    ,
                    <Trans
                        i18nKey="options.home.polygon-trading-competition-2"
                        components={{
                            bold: (
                                <a
                                    href="https://docs.thalesmarket.io/competitions-and-events/thales-polygon-trading-competition"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    <strong />
                                </a>
                            ),
                        }}
                    />
                </Info>
            )}
            <GridLayout />
            <FlexWrapper>
                <Title> {t('landing-page.initiatives')}</Title>
                <FlexDiv className="initiatives">
                    <SPAAnchor href={buildHref(ROUTES.Options.Home)}>
                        <Thales className="icon-home icon-home--thales" />
                    </SPAAnchor>
                    <SPAAnchor href={buildHref(ROUTES.Options.Royal)}>
                        <ThalesRoyale className="icon-home icon-home--royale" />
                    </SPAAnchor>
                    <SPAAnchor href={buildHref(ROUTES.Options.Game)}>
                        <ThalesGame className="icon-home icon-home--game" />
                    </SPAAnchor>
                </FlexDiv>
                <Title style={{ marginBottom: '1em' }}> {t('landing-page.integrations')}</Title>
                <FlexDiv>
                    <a target="_blank" rel="noreferrer" href="https://synthetix.io/">
                        <SNX className="icon-home icon-home--snx" />
                    </a>
                    <a target="_blank" rel="noreferrer" href="https://1inch.io/">
                        <INCH className="icon-home icon-home--inch" />
                    </a>
                </FlexDiv>
                <FlexDiv>
                    <a target="_blank" rel="noreferrer" href="https://chain.link/">
                        <LINK className="icon-home icon-home--link" />
                    </a>
                    <a target="_blank" rel="noreferrer" href="https://www.optimism.io/">
                        <OPTIMISM className="icon-home icon-home--optimism" />
                    </a>
                </FlexDiv>
                <FlexDiv>
                    <a target="_blank" rel="noreferrer" href="https://polygon.technology/">
                        <OPTIMISM className="icon-home icon-home--polygon" />
                    </a>
                </FlexDiv>
                <Title style={{ marginBottom: '1em' }}> {t('landing-page.featured-in')}</Title>
                <FlexDiv>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://finance.yahoo.com/news/thales-announces-launch-referral-program-121249063.html"
                    >
                        <FeatureLogo className="icon-home logo--yahoo" />
                    </a>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.bloomberg.com/press-releases/2022-06-07/thales-announces-the-launch-of-its-new-referral-program"
                    >
                        <FeatureLogo className="icon-home logo--bloomberg" />
                    </a>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.nasdaq.com/press-release/thales-announces-the-launch-of-its-new-referral-program-2022-06-07"
                    >
                        <FeatureLogo className="icon-home logo--nasdaq" />
                    </a>
                </FlexDiv>
                <FlexDiv>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.benzinga.com/content/27585212/thales-announces-the-launch-of-its-new-referral-program"
                    >
                        <FeatureLogo className="icon-home logo--benzinga" />
                    </a>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://newsletter.banklesshq.com/p/your-guide-to-the-synthetix-ecosystem?s=r"
                    >
                        <FeatureLogo className="icon-home logo--bankless" />
                    </a>
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
                <Footer />
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

    background: #052040;
    --main-background: #052040;
    --color: #f7f7f7;
    --background: #1b314f;
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
    color: var(--color-white);
`;

const FlexDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    color: var(--color-white);
    flex-wrap: wrap;
    &.initiatives {
        & > a > i {
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
    @media (max-width: 450px) {
        padding: 0 10px;
    }
`;
const ThalesRoyale = styled(IconAbs)`
    font-size: 12em;
    @media (max-width: 600px) {
        font-size: 7em;
    }
    @media (max-width: 450px) {
        padding: 0 10px;
    }
`;
const ThalesGame = styled(IconAbs)`
    font-size: 16em;
    @media (max-width: 650px) {
        line-height: 0.6em;
        margin-bottom: 90px;
    }
    @media (max-width: 600px) {
        font-size: 10em;
        line-height: 0.2em;
        margin-bottom: 0px;
    }
    @media (max-width: 450px) {
        margin-bottom: 90px;
        padding: 0 10px;
    }
`;

const FeatureLogo = styled(IconAbs)`
    font-size: 16em;
    line-height: 0.5em;
    @media (max-width: 600px) {
        font-size: 10em;
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
    color: var(--color-white);
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
    color: var(--color-white);
    &:not(:last-child) {
        border-bottom: 1px solid var(--color-white);
        padding-bottom: 2em;
        margin-bottom: 2em;
        @media (max-width: 600px) {
            margin-bottom: 30px;
            padding-bottom: 24px;
        }
    }
`;

const Info = styled.div`
    width: 100%;
    color: var(--color-white);
    text-align: center;
    padding: 10px;
    font-size: 16px;
    background-color: var(--background);
    box-shadow: 0px 0px 20px rgb(0 0 0 / 40%);
    z-index: 2;
    position: absolute;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: #91bced;
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: #91bced;
    }
`;
