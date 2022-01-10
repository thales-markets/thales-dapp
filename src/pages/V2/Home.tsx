import React from 'react';
import styled from 'styled-components';
import thalesI from 'assets/images/landing-page/thales1.png';
import thalesII from 'assets/images/landing-page/thales2.png';
import thalesIII from 'assets/images/landing-page/thales3.png';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';

const Home: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Header />
            <TitleContainer>
                <Title> {t('landing-page.title')}</Title>
                <Subtitle> {t('landing-page.subtitle')}</Subtitle>
            </TitleContainer>
            <ThalesButton>
                <i className="icon icon--logo" />
            </ThalesButton>
            <LearnButton></LearnButton>
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
                <img src={thalesI}></img>
            </ThalesImageI>
            <ThalesImageII>
                <img src={thalesII}></img>
            </ThalesImageII>
            <ThalesImageIII>
                <img src={thalesIII}></img>
            </ThalesImageIII>
        </Wrapper>
    );
};

export default Home;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(51, 1fr);
    grid-template-rows: repeat(110, 28.125px);
    background: #052040;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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
    /* or 81px */

    text-align: center;

    color: #f7f7f7;
`;
const Subtitle = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 39.5px;
    line-height: 45px;
    text-align: center;

    color: #f7f7f7;
`;

const Button = styled.div`
    background: #1b314f;
    width: 100%;
    height: 100%;
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
`;

const ContWrapper = styled.div`
    background: #1b314f;
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    padding: 60px 40px 60px 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
`;

const ThalesImageI = styled.div`
    grid-column-start: 30;
    grid-column-end: 46;
    grid-row-start: 23;
    grid-row-end: 52;
`;

const ThalesImageII = styled.div`
    grid-column-start: 1;
    grid-column-end: 24;
    grid-row-start: 43;
    grid-row-end: 75;
`;

const ThalesImageIII = styled.div`
    grid-column-start: 20;
    grid-column-end: 44;
    grid-row-start: 60;
    grid-row-end: 95;
`;

const ContTitle = styled.p`
    font-family: Playfair Display;
    font-style: normal;
    font-weight: bold;
    font-size: 77px;
    line-height: 95%;
    color: #f7f7f7;
`;
const ContSubTitle = styled.p`
    font-family: Nunito;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 27px;
    text-align: justify;
    text-transform: capitalize;

    color: #f7f7f7;
`;
