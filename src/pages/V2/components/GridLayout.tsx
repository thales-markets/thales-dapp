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
    max-width: 1440px;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(110, 28.125px);
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;

const TitleContainer = styled(CenteredDiv)`
    flex-direction: column;
    grid-column-start: 11;
    grid-column-end: 42;
    grid-row-start: 4;
    grid-row-end: 23;
`;

const Title = styled.p`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 88px;
    line-height: 92.3%;
    text-align: center;
    color: var(--color);
`;
const Subtitle = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 39.5px;
    line-height: 45px;
    text-align: center;
    color: var(--color);
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
    grid-row-start: 23;
    grid-row-end: 25;
`;

const LearnButton = styled(Button)`
    grid-column-start: 27;
    grid-column-end: 33;
    grid-row-start: 23;
    grid-row-end: 25;
    font-family: Nunito;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
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
    grid-row-start: 28;
    grid-row-end: 44;
`;

const ContII = styled(ContWrapper)`
    grid-column-start: 24;
    grid-column-end: 49;
    grid-row-start: 46;
    grid-row-end: 62;
`;
const ContIII = styled(ContWrapper)`
    grid-column-start: 4;
    grid-column-end: 29;
    grid-row-start: 64;
    grid-row-end: 80;
`;
const ContIV = styled(ContWrapper)`
    grid-column-start: 24;
    grid-column-end: 49;
    grid-row-start: 82;
    grid-row-end: 103;
    padding-top: 120px;
`;

const Image = styled.img`
    height: 100%;
    object-fit: contain;
`;

const ThalesImageI = styled.div`
    grid-column-start: 31;
    grid-column-end: 46;
    grid-row-start: 23;
    grid-row-end: 47;
    z-index: 3;
`;

const ThalesImageII = styled.div`
    position: relative;
    left: -270px;
    grid-column-start: 1;
    grid-column-end: 23;
    grid-row-start: 44;
    grid-row-end: 75;
    z-index: 3;
`;

const ThalesImageIII = styled.div`
    grid-column-start: 19;
    grid-column-end: 44;
    grid-row-start: 63;
    grid-row-end: 95;
    z-index: 3;
}
`;

const StarsImage = styled.div`
    grid-column-start: 2;
    grid-column-end: 22;
    grid-row-start: 74;
    grid-row-end: 110;
    z-index: 1;
`;

const SystemImage = styled.div`
    position: relative;
    top: -630px;
    left: -900px;
    grid-column-start: 1;
    grid-column-end: 22;
    grid-row-start: 1;
    grid-row-end: 62;
    z-index: 1;
`;

const ContTitle = styled.p`
    font-family: Playfair Display;
    font-style: normal;
    font-weight: bold;
    font-size: 77px;
    line-height: 95%;
    color: var(--color);
`;
const ContSubTitle = styled.p`
    font-family: Nunito;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 27px;
    text-align: justify;
    text-transform: capitalize;
    color: var(--color);
`;

const Logo = styled.i`
    font-size: 94px;
    line-height: 24px;
    color: #ffffff !important;
`;

export default GridLayout;
