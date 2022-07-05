import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { WizardSteps } from '../Wizard';

const WizardText: React.FC<{ step?: WizardSteps }> = ({ step }) => {
    return (
        <Wrapper>
            {step === WizardSteps.Metamask && (
                <Text>
                    {typeof window.ethereum === 'undefined' ? (
                        <Trans
                            i18nKey="wizard-page.step1-0"
                            components={{
                                b: <strong />,
                            }}
                        />
                    ) : (
                        <Trans
                            i18nKey="wizard-page.step1-1"
                            components={{
                                b: <strong />,
                            }}
                        />
                    )}
                </Text>
            )}
            {step === WizardSteps.Buy && (
                <Text>
                    <Trans
                        i18nKey="wizard-page.step2"
                        components={{
                            b: <strong />,
                        }}
                    />
                </Text>
            )}
            {step === WizardSteps.Exchange && (
                <Text>
                    <Trans
                        i18nKey="wizard-page.step3"
                        components={{
                            b: <strong />,
                        }}
                    />
                </Text>
            )}
            {step === WizardSteps.Trade && (
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
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: justify;
    text-transform: capitalize;
    color: #ffffff;
    margin-bottom: 14px;
    strong {
        font-weight: 800;
    }
    i {
        font-style: italic;
    }
`;

export default WizardText;
