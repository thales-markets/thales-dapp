import starsBlack from 'assets/images/landing-page/stars-black.svg';
import systemBlack from 'assets/images/landing-page/system-black.svg';
import thalesIW from 'assets/images/landing-page/thales1-white.webp';
import thalesIIW from 'assets/images/landing-page/thales2-white.webp';
import thalesIIIW from 'assets/images/landing-page/thales3-white.webp';
import ROUTES from 'constants/routes';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { navigateTo } from 'utils/routes';
import Header from './Header/Header';

const GridLayout: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Header />
            <SystemImage>
                <AnimationSvg type="image/svg+xml" data={systemBlack}></AnimationSvg>
            </SystemImage>
            <TitleContainer>
                <Title> {t('landing-page.title')}</Title>
                <Subtitle> {t('landing-page.subtitle')}</Subtitle>
            </TitleContainer>
            <ButtonContainer>
                <ThalesButton>
                    <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}></Link>
                    <Logo className="icon icon--logo" />
                </ThalesButton>
                <LearnButton>
                    <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                        {t('landing-page.learn-more')}
                    </Link>
                </LearnButton>
            </ButtonContainer>

            <ContI>
                <ContTitle>{t('landing-page.q1')}</ContTitle>
                <ContSubTitle>
                    <Trans i18nKey="landing-page.a1" components={{ bold: <span style={{ fontWeight: 700 }} /> }} />
                </ContSubTitle>
            </ContI>
            <ContII>
                <ContTitle>{t('landing-page.q2')}</ContTitle>
                <ContSubTitle>
                    <Trans i18nKey="landing-page.a2" components={{ bold: <span style={{ fontWeight: 700 }} /> }} />
                </ContSubTitle>
            </ContII>
            <ContIII>
                <ContTitle>{t('landing-page.q3')}</ContTitle>
                <ContSubTitle>
                    <Trans i18nKey="landing-page.a3" components={{ bold: <span style={{ fontWeight: 700 }} /> }} />
                </ContSubTitle>
            </ContIII>
            <ContIV>
                <ContTitle>{t('landing-page.q4')}</ContTitle>
                <ContSubTitle>
                    <Trans i18nKey="landing-page.a4" components={{ bold: <span style={{ fontWeight: 700 }} /> }} />
                </ContSubTitle>
            </ContIV>
            <ThalesImageI>
                <Image src={thalesIW}></Image>
            </ThalesImageI>
            <ThalesImageII>
                <Image src={thalesIIW}></Image>
            </ThalesImageII>
            <ThalesImageIII>
                <Image src={thalesIIIW}></Image>
            </ThalesImageIII>
            <StarsImage>
                <AnimationSvg type="image/svg+xml" data={starsBlack}></AnimationSvg>
            </StarsImage>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    width: 100%;
    margin: auto;
    max-width: 1122px;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(77, 2em);
    z-index: 1;
    @media (max-width: 600px) {
        grid-template-rows: repeat(104, 2em);
    }
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;

const TitleContainer = styled(CenteredDiv)`
    flex-direction: column;
    grid-column-start: 9;
    grid-column-end: 44;
    grid-row-start: 6;
    grid-row-end: 18;
    @media (max-width: 600px) {
        grid-column-start: 3;
        grid-column-end: 50;
        grid-row-start: 6;
        grid-row-end: 18;
    }
`;

const Title = styled.h1`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 5.5em;
    line-height: 92.3%;
    text-align: center;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    @media (max-width: 600px) {
        font-size: 38px;
    }
`;
const Subtitle = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 2.5em;
    line-height: 95%;
    text-align: center;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    margin-top: 20px;
    @media (max-width: 600px) {
        font-size: 20px;
        margin-bottom: 91px;
    }
`;

const Button = styled.div`
    background: ${(props) => props.theme.landingPage.background.secondary};
    color: ${(props) => props.theme.landingPage.textColor.primary};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 56px;
    z-index: 2;
`;

const ButtonContainer = styled.div`
    display: contents;
    @media (max-width: 600px) {
        grid-column-start: 1;
        grid-column-end: 52;
        grid-row-start: 13;
        grid-row-end: 22;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 16px;
    }
`;

const ThalesButton = styled(Button)`
    grid-column-start: 19;
    grid-column-end: 26;
    grid-row-start: 20;
    grid-row-end: 22;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        transform: scale(1.2);
    }
    &:before {
        pointer-events: none;
    }
    @media (max-width: 600px) {
        grid-column-start: 4;
        grid-column-end: 20;
    }
`;

const LearnButton = styled(Button)`
    grid-column-start: 27;
    grid-column-end: 33;
    grid-row-start: 20;
    grid-row-end: 22;
    font-family: Nunito !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 91.91%;
    text-align: center;
    text-transform: capitalize;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    cursor: pointer;
    transition: 0.2s;
    z-index: 4;
    & > a {
        width: 100%;
        height: 100%;
    }
    &:hover {
        transform: scale(1.2);
    }
    &:before {
        pointer-events: none;
    }
    @media (max-width: 600px) {
        grid-column-start: 27;
        grid-column-end: 50;
    }
`;

const ContWrapper = styled.div`
    background: ${(props) => props.theme.landingPage.background.secondary};
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    padding: 2em;
    z-index: 2;
`;

const ContI = styled(ContWrapper)`
    grid-column-start: 7;
    grid-column-end: 31;
    grid-row-start: 24;
    grid-row-end: 35;
    @media (max-width: 600px) {
        grid-column-start: 4;
        grid-column-end: 49;
        grid-row-start: 21;
        grid-row-end: 32;
    }
    @media (max-width: 400px) {
        grid-row-end: 33;
    }
`;

const ContII = styled(ContWrapper)`
    grid-column-start: 24;
    grid-column-end: 49;
    grid-row-start: 36;
    grid-row-end: 48;
    @media (max-width: 600px) {
        grid-column-start: 4;
        grid-column-end: 49;
        grid-row-start: 43;
        grid-row-end: 54;
    }
    @media (max-width: 400px) {
        grid-row-end: 55;
    }
`;
const ContIII = styled(ContWrapper)`
    grid-column-start: 4;
    grid-column-end: 29;
    grid-row-start: 49;
    grid-row-end: 60;
    padding-right: 90px;
    @media (max-width: 800px) {
        padding-right: 3em;
    }
    @media (max-width: 600px) {
        grid-column-start: 4;
        grid-column-end: 49;
        grid-row-start: 60;
        grid-row-end: 71;
        padding-right: 28px;
        padding-top: 42px;
    }
`;
const ContIV = styled(ContWrapper)`
    grid-column-start: 24;
    grid-column-end: 49;
    grid-row-start: 61;
    grid-row-end: 76;
    padding-top: 5em;
    padding-left: 50px;
    @media (max-width: 800px) {
        grid-row-end: 77;
    }
    @media (max-width: 600px) {
        padding-left: 28px;
        grid-column-start: 4;
        grid-column-end: 49;
        grid-row-start: 77;
        grid-row-end: 92;
    }
    @media (max-width: 400px) {
        grid-row-end: 94;
    }
`;

const Image = styled.img`
    height: 100%;
    object-fit: contain;
    @media (max-width: 600px) {
        position: absolute;
    }
`;

const AnimationSvg = styled.object``;

const ThalesImageI = styled.div`
    grid-column-start: 30;
    grid-column-end: 46;
    grid-row-start: 20;
    grid-row-end: 38;
    z-index: 3;
    @media (max-width: 600px) {
        grid-column-start: 21;
        grid-column-end: 48;
        grid-row-start: 31;
        grid-row-end: 44;
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
    }
    @media (max-width: 400px) {
        grid-row-start: 32;
    }
`;

const ThalesImageII = styled.div`
    position: relative;
    left: -14em;
    grid-column-start: 1;
    grid-column-end: 23;
    grid-row-start: 35;
    grid-row-end: 56;
    z-index: 3;

    @media (max-width: 800px) {
        grid-column-start: 1;
        grid-column-end: 23;
        grid-row-start: 37;
        grid-row-end: 55;
    }
    @media (max-width: 600px) {
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
        position: static !important;
        grid-column-start: 37;
        grid-column-end: 45;
        grid-row-start: 52;
        grid-row-end: 64;
    }
    @media (max-width: 400px) {
        grid-row-start: 54;
        grid-row-end: 63;
    }
`;

const ThalesImageIII = styled.div`
    grid-column-start: 19;
    grid-column-end: 45;
    grid-row-start: 49;
    grid-row-end: 69;
    z-index: 3;

    @media (max-width: 800px) {
        grid-column-start: 22;
        grid-column-end: 42;
        grid-row-start: 51;
        grid-row-end: 68;
    }

    @media (max-width: 600px) {
        grid-column-start: 10;
        grid-column-end: 48;
        grid-row-start: 70;
        grid-row-end: 82;
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
    }
`;

const StarsImage = styled.div`
    grid-column-start: 4;
    grid-column-end: 18;
    grid-row-start: 58;
    grid-row-end: 78;
    z-index: 1;
    @media (max-width: 800px) {
        grid-column-end: 23;
    }
    @media (max-width: 600px) {
        grid-column-start: 8;
        grid-column-end: 45;
        grid-row-start: 85;
        grid-row-end: 97;
        margin-bottom: -130px;
        & > img {
            width: 100%;
        }
    }
`;

const SystemImage = styled.div`
    position: relative;
    top: -5em;
    left: -20em;
    opacity: 0.3;
    grid-column-start: 1;
    grid-column-end: 53;
    grid-row-start: 15;
    grid-row-end: 66;
    z-index: 1;
    transform: scale(1.7);
    @media (max-width: 600px) {
        top: 10em;
        left: -6em;
    }
`;

const ContTitle = styled.h2`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 3.5em;
    line-height: 95%;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    margin-top: 10px;
    margin-bottom: 0.75em;
    @media (max-width: 800px) {
        font-size: 3em;
    }
    @media (max-width: 600px) {
        font-size: 28px;
        padding-right: 120px;
    }
`;
const ContSubTitle = styled.p`
    font-size: 1.1em;
    line-height: 1.2em;
    &,
    & * {
        font-family: Nunito !important;
        font-style: normal;
        font-weight: 300;

        text-align: justify;
        white-space: pre-line;
        color: ${(props) => props.theme.landingPage.textColor.primary};
        @media (max-width: 600px) {
            padding-top: 20px;
        }
    }
`;

const Link = styled.a`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 91.91%;
    text-align: center;
    text-transform: capitalize;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    cursor: pointer;
    display: flex;
    align-items: inherit;
    justify-content: center;
    height: 100%;
    width: 100%;
    z-index: 1;
`;

const Logo = styled.i`
    margin-top: 4px;
    font-size: 5.2em;
    line-height: 1.75em;
    color: ${(props) => props.theme.landingPage.textColor.primary} !important;
    position: absolute;
`;

export default GridLayout;
