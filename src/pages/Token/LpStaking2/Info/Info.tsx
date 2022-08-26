import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Info: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <StepsWrapper alignCenter={true}>
                <Step>1</Step>
                <StepConnect />
                <Step>2</Step>
                <StepConnect />
                <Step>3</Step>
                <StepConnect />
                <Step>4</Step>
                <StepConnect />
                <Step>5</Step>
            </StepsWrapper>
            <StepsWrapper alignCenter={false}>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.info-steps.step1-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.info-steps.step1-desc')}</StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.info-steps.step2-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.info-steps.step2-desc')}</StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.info-steps.step3-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.info-steps.step3-desc')}</StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.info-steps.step4-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.info-steps.step4-desc')}</StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.info-steps.step5-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.info-steps.step5-desc')}</StepInfoDescription>
                </StepInfo>
            </StepsWrapper>
        </Container>
    );
};

const STEP_WIDTH = '60px';

const Container = styled.div`
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
`;

const StepsWrapper = styled.div<{ alignCenter?: boolean }>`
    width: 100%;
    display: flex;
    ${(props) => (props.alignCenter ? 'align-items: center;' : '')};
    justify-content: ${(props) => (props.alignCenter ? 'center' : 'space-around')};
    margin: 30px 0;
`;

const Step = styled.div`
    position: relative;
    width: ${STEP_WIDTH};
    height: 60px;
    background: var(--background);
    border-radius: 50%;
    border: 4px solid var(--input-border-color);
    color: var(--input-border-color);
    text-align: center;
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 52px;
    text-transform: uppercase;
    cursor: default;
`;

const StepConnect = styled.div`
    width: calc(20% - ${STEP_WIDTH});
    border-top: 3px solid var(--input-border-color);
`;

const StepInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 200px;
    border: 1px dashed var(--input-border-color);
    border-radius: 15px;
    padding: 15px 10px;
`;

const StepInfoLabel = styled.span`
    padding-bottom: 15px;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
`;

const StepInfoDescription = styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
`;

export default Info;
