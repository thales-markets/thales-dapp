import React from 'react';
import styled from 'styled-components';
import thalesI from 'assets/images/landing-page/thales1.png';
import thalesII from 'assets/images/landing-page/thales2.png';
import thalesIII from 'assets/images/landing-page/thales3.png';
import starsBlack from 'assets/images/landing-page/stars-black.svg';
import starsWhite from 'assets/images/landing-page/stars-white.svg';
import systemBlack from 'assets/images/landing-page/system-black.svg';
import systemWhite from 'assets/images/landing-page/system-white.svg';
import thalesIW from 'assets/images/landing-page/thales1-white.png';
import thalesIIW from 'assets/images/landing-page/thales2-white.png';
import thalesIIIW from 'assets/images/landing-page/thales3-white.png';
import Header from './Header/Header';
import { Trans, useTranslation } from 'react-i18next';
import { Theme } from '../Home';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';

type GridLayoutProps = {
    theme: Theme;
    setTheme: (data: any) => void;
};

const GridLayout: React.FC<GridLayoutProps> = ({ setTheme, theme }) => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Header theme={theme} setTheme={setTheme} />
            <SystemImage>
                <AnimationSvg
                    type="image/svg+xml"
                    data={theme !== Theme.Dark ? systemWhite : systemBlack}
                ></AnimationSvg>
            </SystemImage>
            <TitleContainer>
                <Title> {t('landing-page.title')}</Title>
                <Subtitle> {t('landing-page.subtitle')}</Subtitle>
            </TitleContainer>
            <ButtonContainer>
                <ThalesButton>
                    <Logo
                        onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}
                        className="icon icon--logo"
                    />
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
                <Image src={theme !== Theme.Dark ? thalesI : thalesIW}></Image>
            </ThalesImageI>
            <ThalesImageII>
                <Image src={theme !== Theme.Dark ? thalesII : thalesIIW}></Image>
            </ThalesImageII>
            <ThalesImageIII>
                <Image src={theme !== Theme.Dark ? thalesIII : thalesIIIW}></Image>
            </ThalesImageIII>
            <StarsImage>
                <AnimationSvg type="image/svg+xml" data={theme !== Theme.Dark ? starsWhite : starsBlack}></AnimationSvg>
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

const Title = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 5.5em;
    line-height: 92.3%;
    text-align: center;
    color: var(--color);
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
    color: var(--color);
    margin-top: 20px;
    @media (max-width: 600px) {
        font-size: 20px;
        margin-bottom: 91px;
    }
`;

const Button = styled.div`
    background: #1b314f;
    color: #f7f7f7;
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
    color: #ffffff;
    cursor: pointer;
    transition: 0.2s;
    z-index: 4;
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
    background: var(--background);
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
`;

const ContII = styled(ContWrapper)`
    grid-column-start: 24;
    grid-column-end: 49;
    grid-row-start: 36;
    grid-row-end: 48;
    @media (max-width: 600px) {
        grid-column-start: 4;
        grid-column-end: 49;
        grid-row-start: 44;
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
        grid-row-start: 63;
        grid-row-end: 74;
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
        grid-row-start: 82;
        grid-row-end: 97;
    }
    @media (max-width: 400px) {
        grid-row-end: 99;
    }
`;

const Image = styled.img`
    height: 100%;
    object-fit: contain;
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
        grid-row-start: 55;
        grid-row-end: 67;
    }
`;

const ThalesImageIII = styled.div`
    grid-column-start: 20;
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
        grid-row-start: 75;
        grid-row-end: 87;
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
    @media (max-width: 600px) {
        grid-column-start: 5;
        grid-column-end: 42;
        grid-row-start: 75;
        grid-row-end: 87;
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
`;

const ContTitle = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 3.5em;
    line-height: 95%;
    color: var(--color);
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
        color: var(--color);
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
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: inherit;
    justify-content: center;
`;

const Logo = styled.i`
    margin-top: 4px;
    font-size: 5.2em;
    line-height: 1.75em;
    color: #ffffff !important;
`;

export default GridLayout;
