import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Info: React.FC = () => {
    const { t } = useTranslation();

    return (
        <InfoSection>
            <InfoTitle>{t('options.earn.vesting.info.title')}</InfoTitle>
            <InfoText>{t('options.earn.vesting.info.text')}</InfoText>
        </InfoSection>
    );
};

const InfoSection = styled.section`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 15px;
    color: white;
    grid-column: span 5;
    grid-row: span 3;
    margin-bottom: 15px;
    padding: 30px 20px 10px 40px;
    @media (max-width: 1024px) {
        order: 2;
    }
    @media (max-width: 767px) {
        grid-column: span 10 !important;
        padding: 10px;
        order: 9;
    }
`;

const InfoTitle = styled.div`
    font-weight: 600;
    font-size: 23px;
    line-height: 48px;
    color: #ffffff;
    padding-bottom: 30px;
    @media (max-width: 767px) {
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        padding-bottom: 20px;
    }
`;
const InfoText = styled.div`
    font-size: 18px;
    line-height: 32px;
    letter-spacing: 0.2px;
    color: #ffffff;
    font-weight: normal;
    @media (max-width: 767px) {
        font-size: 14px;
        line-height: 24px;
        text-align: center;
    }
`;

export default Info;
