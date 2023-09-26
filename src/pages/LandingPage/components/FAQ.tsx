import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexWrapper, Title, Faq, FaqQuestion, FaqAnswer } from './styled-components';

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

export default FAQ;
