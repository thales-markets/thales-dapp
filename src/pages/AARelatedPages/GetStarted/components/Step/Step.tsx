import ROUTES from 'constants/routes';
import { GetStartedStep } from 'enums/wizard';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { getIsAA, getIsWalletConnected, getNetworkId, setWalletConnectModalVisibility } from 'redux/modules/wallet';
import { ReactComponent as InsertCard } from 'assets/images/wizard/insert-card.svg';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';
import { getDefaultCollateral } from 'utils/currency';
import { getNetworkNameByNetworkId } from 'utils/network';
import { buildHref, navigateTo } from 'utils/routes';

type StepProps = {
    stepNumber: number;
    stepType: GetStartedStep;
    currentStep: GetStartedStep;
    setCurrentStep: (step: GetStartedStep) => void;
    hasFunds: boolean;
};

const Step: React.FC<StepProps> = ({ stepNumber, stepType, currentStep, setCurrentStep, hasFunds }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const { t } = useTranslation();
    const isAA = useSelector((state: RootState) => getIsAA(state));
    const dispatch = useDispatch();

    const stepTitle = useMemo(() => {
        let transKey = 'get-started.steps.title';
        switch (stepType) {
            case GetStartedStep.LOG_IN:
                transKey += isAA && isWalletConnected ? '.logged-in' : '.sign-up';
                break;
            case GetStartedStep.DEPOSIT:
                transKey += '.deposit';
                break;
            case GetStartedStep.TRADE:
                transKey += '.trade';
                break;
        }
        return t(transKey);
    }, [isAA, isWalletConnected, stepType, t]);

    const stepDescription = useMemo(() => {
        let transKey = 'get-started.steps.description';
        switch (stepType) {
            case GetStartedStep.LOG_IN:
                transKey += isAA && isWalletConnected ? '.logged-in' : '.sign-up';
                break;
            case GetStartedStep.DEPOSIT:
                transKey += '.deposit';
                break;
            case GetStartedStep.TRADE:
                transKey += '.trade';
                break;
        }

        return t(transKey, {
            network: getNetworkNameByNetworkId(networkId, true),
            collateral: getDefaultCollateral(networkId),
        });
    }, [stepType, networkId, isAA, isWalletConnected, t]);

    const showStepIcon = useMemo(() => {
        if (isWalletConnected) {
            switch (stepType) {
                case GetStartedStep.LOG_IN:
                    return isWalletConnected;

                case GetStartedStep.DEPOSIT:
                    return hasFunds;

                case GetStartedStep.TRADE:
                    return false;
            }
        }
    }, [isWalletConnected, stepType, hasFunds]);

    const getStepAction = () => {
        let className = '';
        let transKey = 'get-started.steps.action';
        switch (stepType) {
            case GetStartedStep.LOG_IN:
                className = 'icon--card';
                transKey += isAA && isWalletConnected ? '.logged-in' : '.sign-up';
                break;
            case GetStartedStep.DEPOSIT:
                className = 'icon--card';
                transKey += '.deposit';
                break;
            case GetStartedStep.TRADE:
                className = 'icon--markets';
                transKey += '.trade';
                break;
        }
        return (
            <StepAction>
                <StepActionIconWrapper isActive={isActive} pulsate={!isMobile}>
                    {stepType === GetStartedStep.DEPOSIT ? (
                        <StyledInsertCard />
                    ) : (
                        <StepActionIcon className={`icon ${className}`} isDisabled={isDisabled} isActive={isActive} />
                    )}
                </StepActionIconWrapper>
                <StepActionLabel isDisabled={isDisabled} onClick={onStepActionClickHandler}>
                    <StepActionName isActive={isActive} completed={showStepIcon}>
                        {t(transKey)}
                    </StepActionName>
                    {!isMobile && <LinkIcon className={`icon icon--external`} isActive={isActive} />}
                </StepActionLabel>
            </StepAction>
        );
    };

    const isActive = currentStep === stepType;
    const isDisabled = !isWalletConnected && stepType !== GetStartedStep.LOG_IN;

    const onStepActionClickHandler = () => {
        if (isDisabled) {
            return;
        }
        setCurrentStep(stepType);
        switch (stepType) {
            case GetStartedStep.LOG_IN:
                dispatch(
                    setWalletConnectModalVisibility({
                        visibility: true,
                    })
                );
                break;
            case GetStartedStep.DEPOSIT:
                navigateTo(buildHref(ROUTES.Deposit));
                break;
            case GetStartedStep.TRADE:
                navigateTo(buildHref(ROUTES.Options.Home));
                break;
        }
    };

    const changeCurrentStep = () => (isDisabled ? null : setCurrentStep(stepType));

    return (
        <Container onClick={isActive ? onStepActionClickHandler : () => {}}>
            <StepNumberSection>
                <StepNumberWrapper
                    completed={!isActive && showStepIcon}
                    isActive={isActive}
                    isDisabled={isDisabled}
                    onClick={changeCurrentStep}
                >
                    <StepNumber isActive={isActive}>
                        {!isActive && showStepIcon ? <CorrectIcon className="icon icon--correct" /> : stepNumber}
                    </StepNumber>
                </StepNumberWrapper>
            </StepNumberSection>
            <StepDescriptionSection isActive={isActive} isDisabled={isDisabled} onClick={changeCurrentStep}>
                <StepTitle completed={!isActive && showStepIcon}>{stepTitle}</StepTitle>
                <StepDescription completed={!isActive && showStepIcon}>{stepDescription}</StepDescription>
            </StepDescriptionSection>
            {stepType !== GetStartedStep.LOG_IN && (
                <StepActionSection isActive={isActive} isDisabled={isDisabled}>
                    {getStepAction()}
                </StepActionSection>
            )}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    gap: 30px;
    @media (max-width: 600px) {
        gap: 16px;
    }
`;

const StepNumberSection = styled(FlexDivCentered)``;

const StepDescriptionSection = styled(FlexDivColumn)<{ isActive: boolean; isDisabled?: boolean }>`
    width: 60%;
    color: ${(props) => (props.isActive ? props.theme.textColor.primary : props.theme.textColor.secondary)};
    cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
`;

const StepActionSection = styled(FlexDivCentered)<{ isActive: boolean; isDisabled?: boolean }>`
    text-align: center;
    color: ${(props) => (props.isActive ? props.theme.textColor.quaternary : props.theme.textColor.secondary)};
`;

const StepAction = styled.div`
    width: 180px;
    @media (max-width: 600px) {
        width: 80px;
    }
`;

const StepTitle = styled.span<{ completed?: boolean }>`
    font-weight: 700;
    font-size: 20px;
    line-height: 27px;
    color: ${(props) => (props.completed ? props.theme.background.quaternary : '')};
    margin-bottom: 10px;
`;

const StepDescription = styled.p<{ completed?: boolean }>`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    text-align: justify;
    color: ${(props) => (props.completed ? props.theme.background.quaternary : '')};
`;

const StepNumberWrapper = styled.div<{ isActive: boolean; isDisabled?: boolean; completed?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    ${(props) => (props.isActive ? `border: 2px solid ${props.theme.borderColor.quaternary};` : '')}
    ${(props) =>
        props.isActive
            ? ''
            : `background: ${props.completed ? props.theme.background.quaternary : props.theme.background.tertiary};`}
    cursor: ${(props) => (props.isDisabled ? 'not-allowed' : props.isActive ? 'default' : 'pointer')};
    @media (max-width: 600px) {
        width: 36px;
        height: 36px;
    }
`;

const StepNumber = styled.span<{ isActive: boolean }>`
    font-weight: 700;
    font-size: 29px;
    @media (max-width: 600px) {
        font-size: 20px;
    }
    line-height: 43px;
    text-transform: uppercase;
    color: ${(props) =>
        props.isActive ? props.theme.button.textColor.secondary : props.theme.button.textColor.primary};
`;

const StepActionIconWrapper = styled.div<{ isActive: boolean; pulsate?: boolean }>`
    text-align: center;
    animation: ${(props) => (props.pulsate && props.isActive ? 'pulsing 1s ease-in' : '')};
    animation-iteration-count: ${(props) => (props.pulsate && props.isActive ? 'infinite;' : '')};

    @keyframes pulsing {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.3);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;

const StepActionIcon = styled.i<{ isDisabled?: boolean; isActive?: boolean }>`
    font-size: 35px;
    padding-bottom: 15px;
    cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
    color: ${(props) => props.theme.textColor.quaternary};
`;

const StepActionLabel = styled.div<{ isDisabled?: boolean }>`
    cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
`;

const StepActionName = styled.span<{ isActive?: boolean; completed?: boolean }>`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.background.quaternary};
    @media (max-width: 600px) {
        display: none;
    }
`;

const LinkIcon = styled.i<{ isActive: boolean }>`
    font-size: 14px;
    margin-left: 10px;
    animation: ${(props) => (props.isActive ? 'pulsing 1s ease-in' : '')};
    animation-iteration-count: ${(props) => (props.isActive ? 'infinite;' : '')};
    color: ${(props) => props.theme.textColor.quaternary};
`;

const CorrectIcon = styled.i`
    font-size: 20px;
    color: ${(props) => props.theme.background.primary};
`;

const StyledInsertCard = styled(InsertCard)`
    width: 54px;
    height: 44px;
    margin-bottom: 4px;
    path {
        fill: ${(props) => props.theme.textColor.quaternary};
    }
`;

export default Step;
