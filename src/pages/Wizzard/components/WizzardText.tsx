import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const WizzardText: React.FC<{ step: number }> = ({ step }) => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Text active={step === 0}>{t('wizzard-page.intro1')}</Text>
            <Text active={step === 0}>{t('wizzard-page.intro2')}</Text>
            <Text active={step === 0 || step === 1}>{t('wizzard-page.step1')}</Text>
            <Text active={step === 0 || step === 2}>{t('wizzard-page.step2')}</Text>
            <Text active={step === 0 || step === 3}>{t('wizzard-page.step3')}</Text>
            <Text active={step === 0 || step === 4}>{t('wizzard-page.step4')}</Text>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    max-width: 870px;
`;

const Text = styled.p<{ active: boolean }>`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    margin-bottom: 14px;
    opacity: ${(props) => (props.active ? '1' : '0.3')};
`;

export default WizzardText;
