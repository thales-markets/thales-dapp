import { ProvideLiquidityLink, UniswapExchangeLink } from 'pages/Token/components2';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Instructions: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <StepsWrapper firstRow={true}>
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
            <StepsWrapper firstRow={false}>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.instructions.step1-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.instructions.step1-desc')}</StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.instructions.step2-label')}</StepInfoLabel>
                    <StepInfoDescription>
                        <Trans
                            i18nKey="options.earn.lp-staking.instructions.step2-desc"
                            components={[<UniswapExchangeLink key="1" />]}
                        />
                    </StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.instructions.step3-label')}</StepInfoLabel>
                    <StepInfoDescription>
                        <Trans
                            i18nKey="options.earn.lp-staking.instructions.step3-desc"
                            components={[<ProvideLiquidityLink key="1" />]}
                        />
                    </StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.instructions.step4-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.instructions.step4-desc')}</StepInfoDescription>
                </StepInfo>
                <StepInfo>
                    <StepInfoLabel>{t('options.earn.lp-staking.instructions.step5-label')}</StepInfoLabel>
                    <StepInfoDescription>{t('options.earn.lp-staking.instructions.step5-desc')}</StepInfoDescription>
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

const StepsWrapper = styled.div<{ firstRow?: boolean }>`
    width: 100%;
    display: flex;
    ${(props) =>
        props.firstRow
            ? `
                align-items: center; 
                margin-bottom: 20px;
    `
            : ''};
    justify-content: ${(props) => (props.firstRow ? 'center' : 'space-around')};
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

export default Instructions;
