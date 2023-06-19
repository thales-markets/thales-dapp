import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { WizardSteps } from 'enums/wizard';

const WizardText: React.FC<{ step?: WizardSteps }> = ({ step }) => {
    return (
        <Wrapper>
            {step === WizardSteps.INSTALL_METAMASK && (
                <Text>
                    <Trans
                        i18nKey="wizard-page.step1-0"
                        components={{
                            b: <strong />,
                        }}
                    />
                </Text>
            )}
            {step === WizardSteps.CONNECT_METAMASK && (
                <Text>
                    <Trans
                        i18nKey="wizard-page.step1-1"
                        components={{
                            b: <strong />,
                        }}
                    />
                </Text>
            )}
            {step === WizardSteps.BUY && (
                <Text>
                    <Trans
                        i18nKey="wizard-page.step2"
                        components={{
                            b: <strong />,
                        }}
                    />
                </Text>
            )}
            {step === WizardSteps.EXCHANGE && (
                <Text>
                    <Trans
                        i18nKey="wizard-page.step3"
                        components={{
                            b: <strong />,
                        }}
                    />
                </Text>
            )}
            {step === WizardSteps.TRADE && (
                <Text>
                    <Trans
                        i18nKey="wizard-page.step4"
                        components={{
                            b: <strong />,
                        }}
                    />
                </Text>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    margin-top: 20px;
`;

export const Text = styled.p`
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    text-align: justify;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 14px;
    strong {
        font-weight: 800;
    }
    i {
        font-style: italic;
    }
`;

export default WizardText;
