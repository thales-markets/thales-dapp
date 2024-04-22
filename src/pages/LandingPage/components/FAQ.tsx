import React from 'react';
import { useTranslation } from 'react-i18next';
import { Faq, FaqAnswer, FaqQuestion, FlexWrapper, Title } from './styled-components';

const FAQ: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexWrapper>
            <Title id="faq-section" style={{ marginTop: 50 }}>
                {t('landing-page.faq.title')}
            </Title>
            <Faq>
                <FaqQuestion>{t('landing-page.faq.1.question')}</FaqQuestion>
                <FaqAnswer>{t('landing-page.faq.1.answer')}</FaqAnswer>
                <FaqQuestion>{t('landing-page.faq.2.question')}</FaqQuestion>
                <FaqAnswer>{t('landing-page.faq.2.answer')}</FaqAnswer>
                <FaqQuestion>{t('landing-page.faq.3.question')}</FaqQuestion>
                <FaqAnswer>{t('landing-page.faq.3.answer')}</FaqAnswer>
                <FaqQuestion>{t('landing-page.faq.4.question')}</FaqQuestion>
                <FaqAnswer>{t('landing-page.faq.4.answer')}</FaqAnswer>
            </Faq>
        </FlexWrapper>
    );
};

export default FAQ;
