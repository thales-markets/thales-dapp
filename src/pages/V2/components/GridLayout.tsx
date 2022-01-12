import React from 'react';
import styled from 'styled-components';
import thalesI from 'assets/images/landing-page/thales1.png';
import thalesII from 'assets/images/landing-page/thales2.png';
import thalesIII from 'assets/images/landing-page/thales3.png';
import stars from 'assets/images/landing-page/stars.svg';
import system from 'assets/images/landing-page/system.svg';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { Theme } from '../Home';

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
                <Image src={system}></Image>
            </SystemImage>
            <TitleContainer>
                <Title> {t('landing-page.title')}</Title>
                <Subtitle> {t('landing-page.subtitle')}</Subtitle>
            </TitleContainer>
            <ThalesButton>
                <Logo className="icon icon--logo" />
            </ThalesButton>
            <LearnButton> {t('landing-page.learn-more')}</LearnButton>
            <ContI>
                <ContTitle>{t('landing-page.q1')}</ContTitle>
                <ContSubTitle>{t('landing-page.a1')}</ContSubTitle>
            </ContI>
            <ContII>
                <ContTitle>{t('landing-page.q2')}</ContTitle>
                <ContSubTitle>{t('landing-page.a2')}</ContSubTitle>
            </ContII>
            <ContIII>
                <ContTitle>{t('landing-page.q3')}</ContTitle>
                <ContSubTitle>{t('landing-page.a3')}</ContSubTitle>
            </ContIII>
            <ContIV>
                <ContTitle>{t('landing-page.q4')}</ContTitle>
                <ContSubTitle>{t('landing-page.a4')}</ContSubTitle>
            </ContIV>
            <ThalesImageI>
                <Image src={thalesI}></Image>
            </ThalesImageI>
            <ThalesImageII>
                <Image src={thalesII}></Image>
            </ThalesImageII>
            <ThalesImageIII>
                <Image src={thalesIII}></Image>
            </ThalesImageIII>
            <StarsImage>
                <Image src={stars}></Image>
            </StarsImage>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    width: 100%;
    margin: auto;
    max-width: 1080px;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(81, 2em);
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
    grid-row-start: 4;
    grid-row-end: 16;
`;

const Title = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 4.2em;
    line-height: 92.3%;
    text-align: center;
    color: var(--color);
`;
const Subtitle = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 2em;
    line-height: 95%;
    text-align: center;
    color: var(--color);
    margin-top: 20px;
`;

const Button = styled.div`
    background: #1b314f;
    color: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 2;
`;

const ThalesButton = styled(Button)`
    grid-column-start: 20;
    grid-column-end: 26;
    grid-row-start: 16;
    grid-row-end: 18;
`;

const LearnButton = styled(Button)`
    grid-column-start: 27;
    grid-column-end: 33;
    grid-row-start: 16;
    grid-row-end: 18;
    font-family: Nunito;
    font-style: normal;
    font-weight: bold;
    font-size: 1em;
    line-height: 91.91%;
    text-align: center;
    text-transform: capitalize;
    color: #ffffff;
`;

const ContWrapper = styled.div`
    background: var(--background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    padding: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
`;

const ContI = styled(ContWrapper)`
    grid-column-start: 7;
    grid-column-end: 32;
    grid-row-start: 21;
    grid-row-end: 33;
`;

const ContII = styled(ContWrapper)`
    grid-column-start: 24;
    grid-column-end: 49;
    grid-row-start: 35;
    grid-row-end: 47;
`;
const ContIII = styled(ContWrapper)`
    grid-column-start: 4;
    grid-column-end: 29;
    grid-row-start: 49;
    grid-row-end: 61;
`;
const ContIV = styled(ContWrapper)`
    grid-column-start: 24;
    grid-column-end: 49;
    grid-row-start: 63;
    grid-row-end: 80;
`;

const Image = styled.img`
    height: 100%;
    object-fit: contain;
`;

const ThalesImageI = styled.div`
    grid-column-start: 29;
    grid-column-end: 46;
    grid-row-start: 16;
    grid-row-end: 38;
    z-index: 3;
`;

const ThalesImageII = styled.div`
    position: relative;
    left: -280px;
    grid-column-start: 1;
    grid-column-end: 23;
    grid-row-start: 33;
    grid-row-end: 57;
    z-index: 3;
`;

const ThalesImageIII = styled.div`
    grid-column-start: 19;
    grid-column-end: 45;
    grid-row-start: 51;
    grid-row-end: 71;
    z-index: 3;
`;

const StarsImage = styled.div`
    grid-column-start: 1;
    grid-column-end: 18;
    grid-row-start: 59;
    grid-row-end: 82;
    z-index: 1;
`;

const SystemImage = styled.div`
    position: relative;
    top: -630px;
    left: -900px;
    grid-column-start: 1;
    grid-column-end: 22;
    grid-row-start: 1;
    grid-row-end: 46;
    z-index: 1;
`;

const ContTitle = styled.p`
    font-family: Playfair Display;
    font-style: normal;
    font-weight: bold;
    font-size: 3.8em;
    line-height: 95%;
    color: var(--color);
`;
const ContSubTitle = styled.p`
    font-family: Nunito;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 95%;
    text-align: justify;
    text-transform: capitalize;
    color: var(--color);
`;

const Logo = styled.i`
    font-size: 5.2em;
    line-height: 1.75em;
    color: #ffffff !important;
`;

export default GridLayout;
