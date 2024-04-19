import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setShowTour } from 'redux/modules/ui';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';

type TourStepProps = {
    heading?: string;
    content: string;
    currentStep: number;
    stepsCount: number;
    goTo: (step: number) => void;
};

const TourStep: React.FC<TourStepProps> = ({ heading, content, currentStep, stepsCount, goTo }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <Wrapper>
            {heading && (
                <Heading>
                    <Trans
                        i18nKey={heading}
                        components={{
                            bold: <Bold />,
                            br: <br />,
                        }}
                    />
                </Heading>
            )}
            <Content>
                <Trans
                    i18nKey={content}
                    components={{
                        bold: <Bold />,
                        br: <br />,
                    }}
                />
            </Content>
            <ButtonWrapper>
                {currentStep == 0 && (
                    <NextButton onClick={() => goTo(currentStep + 1)}>{t('onboarding-tour.start-tutorial')}</NextButton>
                )}
                {currentStep !== 0 && (
                    <>
                        <BackButton
                            className={`${currentStep - 1}`}
                            disabled={currentStep - 1 <= -1}
                            onClick={() => {
                                goTo(currentStep - 1);
                            }}
                        >
                            {t('onboarding-tour.back')}
                        </BackButton>
                        <NextButton
                            className={`${currentStep + 1}`}
                            onClick={() => {
                                if (!(currentStep + 1 >= stepsCount)) {
                                    goTo(currentStep + 1);
                                } else {
                                    dispatch(setShowTour(false));
                                }
                            }}
                        >
                            {!(currentStep + 1 >= stepsCount)
                                ? t('onboarding-tour.next')
                                : t('onboarding-tour.start-trading')}
                        </NextButton>
                    </>
                )}
            </ButtonWrapper>
            <BottomWrapper>
                <StepInfo>{`${currentStep + 1} of ${stepsCount}`}</StepInfo>
                <StepsWrapper>
                    {Array.from(Array(stepsCount)).map((_item, index) => {
                        return <Step active={index == currentStep} key={index} onClick={() => goTo(index)} />;
                    })}
                </StepsWrapper>
            </BottomWrapper>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    flex-direction: column;
`;

const Heading = styled.h3`
    font-weight: 400;
    font-size: 18px;
    width: 100%;
    margin-bottom: 15px;
    text-align: center;
    color: ${(props) => props.theme.tour.textColor.primary};
`;

const Content = styled.p`
    width: 100%;
    color: ${(props) => props.theme.tour.textColor.primary};
`;

const ButtonWrapper = styled(FlexDiv)`
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin: 20px 0px;
`;

const Button = styled.button<{ disabled?: boolean }>`
    border-radius: 8px;
    opacity: ${(props) => props.disabled && '0.4'};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 115px;
    height: 31px;
    font-weight: 600;
    margin: 0 4px;
    font-size: 13px;
`;

const BackButton = styled(Button)`
    background-color: ${(props) => props.theme.tour.buttons.background.primary};
    color: ${(props) => props.theme.tour.buttons.textColor.primary};
`;

export const NextButton = styled(Button)`
    background-color: ${(props) => props.theme.tour.buttons.background.secondary};
    color: ${(props) => props.theme.tour.buttons.textColor.secondary};
`;

const BottomWrapper = styled(FlexDiv)`
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const StepInfo = styled.span`
    color: ${(props) => props.theme.tour.textColor.primary};
    margin-right: 14px;
    font-weight: 700;
`;

const StepsWrapper = styled(FlexDiv)`
    flex-direction: row;
`;

const Step = styled.div<{ active?: boolean }>`
    cursor: pointer;
    border-radius: 5px;
    margin: 0 3px;
    width: ${(props) => (props?.active ? '50px' : '21px')};
    height: 7px;
    background-color: ${(props) =>
        props.active ? props.theme.tour.background.tertiary : props.theme.tour.background.secondary};
`;

const Bold = styled.span`
    font-weight: 800;
`;

export default TourStep;
