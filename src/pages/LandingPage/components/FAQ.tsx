import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FAQ: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexWrapper>
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
        </FlexWrapper>
    );
};

const Faq = styled.div`
    background: ${(props) => props.theme.landingPage.background.secondary};
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
    color: ${(props) => props.theme.landingPage.textColor.primary};
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
    color: ${(props) => props.theme.landingPage.textColor.primary};
    &:not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.landingPage.textColor.primary};
        padding-bottom: 2em;
        margin-bottom: 2em;
        @media (max-width: 600px) {
            margin-bottom: 30px;
            padding-bottom: 24px;
        }
    }
`;

const Title = styled.h2`
    font-family: Playfair Display !important;
    font-style: normal;
    font-weight: bold;
    font-size: 4.4em;
    @media (max-width: 600px) {
        font-size: 2em;
    }
    line-height: 91.91%;
    text-align: center;
    color: ${(props) => props.theme.landingPage.textColor.primary};
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 1122px;
    align-items: center;
    padding: 0 20px;
`;

export default FAQ;
