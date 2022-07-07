import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Steps from './components/Steps';
import WizardText, { Text } from './components/WizardText';
import WizardFaq from './components/WizardFaq';
import WizardVideo from './components/WizardVideo';
import WizardFooter from './components/WizardFooter';
import styled from 'styled-components';

export enum WizardSteps {
    INSTALL_METAMASK,
    CONNECT_METAMASK,
    BUY,
    EXCHANGE,
    TRADE,
}

const Wizard: React.FC = () => {
    const { t } = useTranslation();

    const initialStep =
        typeof window.ethereum === 'undefined' ? WizardSteps.INSTALL_METAMASK : WizardSteps.CONNECT_METAMASK;
    const [currentStep, setCurrentStep] = useState(initialStep);

    return (
        <Wrapper>
            <TextHeader>{t('wizard-page.header')}</TextHeader>
            <TextIntro>
                <Trans
                    i18nKey="wizard-page.intro"
                    components={{
                        b: <strong />,
                    }}
                />
            </TextIntro>
            <WizardVideo
                header={false}
                videoLink="https://www.youtube.com/embed/MXqt3itSCgw?&autoplay=1"
                videoTitle="On-boarding Wizard video walk through for Thales platform"
            />
            <Steps step={currentStep} setCurrentStep={setCurrentStep}></Steps>
            <WizardText step={currentStep}></WizardText>
            <WizardVideo
                header={true}
                videoLink="https://www.youtube.com/embed/sWiOiW5VTdE?&autoplay=1"
                videoTitle="How to use Thales AMM (Automated Market Maker)? Walk through - Video Tutorial"
            />
            <WizardFaq />
            <WizardFooter />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 900px;
    margin-top: 20px;
`;

const TextHeader = styled(Text)`
    font-weight: 700;
    font-size: 22px;
    line-height: 33px;
    text-align: left;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const TextIntro = styled(Text)`
    text-align: left;
`;

export default Wizard;
