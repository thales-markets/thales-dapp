import React, { useState } from 'react';

import Steps from './components/Steps';
import WizzardText from './components/WizzardText';

enum WizzardSteps {
    None,
    Metamask,
    Buy,
    Exchange,
    Trade,
}

const Wizzard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(WizzardSteps.None);

    return (
        <>
            <Steps step={currentStep} setCurrentStep={setCurrentStep}></Steps>
            <WizzardText step={currentStep}></WizzardText>
        </>
    );
};

export default Wizzard;
