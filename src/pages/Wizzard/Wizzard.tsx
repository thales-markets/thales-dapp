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

// enum OnRampProvider {
//     MtPelerin,
//     Banxa,
// }

const mtPelerinIframe =
    'https://widget.mtpelerin.com/?type=popup&lang=en&primary=%2304045a&mylogo=https://thalesmarket.io/THALES_LOGOTIP.svg&net=optimism_mainnet&bsc=EUR&bdc=ETH&crys=ETH';
// const banxaIframe = 'https://thalesmarket.banxa.com/iframe?code=x68QxHYZ2hQU0rccKDgDSeUO7QonDXsY?blockchain=XRP';

const Wizzard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(WizzardSteps.None);

    return (
        <>
            {/* <ProviderWrapper>
                <Button
                    padding={'5px 20px'}
                    onClickHandler={setProvider.bind(this, OnRampProvider.MtPelerin)}
                    additionalStyles={{ opacity: onRampProvider === OnRampProvider.MtPelerin ? 1 : 0.3 }}
                >
                    MtPelerin
                </Button>
                <Button
                    padding={'5px 20px'}
                    onClickHandler={setProvider.bind(this, OnRampProvider.Banxa)}
                    additionalStyles={{ opacity: onRampProvider === OnRampProvider.Banxa ? 1 : 0.3 }}
                >
                    Banxa
                </Button>
            </ProviderWrapper> */}
            <Steps iframe={mtPelerinIframe} step={currentStep} setCurrentStep={setCurrentStep}></Steps>
            <WizzardText step={currentStep}></WizzardText>
        </>
    );
};

// Endpoint: thalesmarket.banxa-sandbox.com
// API Key: thalesmarket@2022test
// Secret: x68QxHYZ2hQU0rccKDgDSeUO7QonDXsY

// function generateHmac(signature: any, nonce: any) {
//     const key = 'thalesmarket@2022test';
//     const secret = 'x68QxHYZ2hQU0rccKDgDSeUO7QonDXsY';

//     const localSignature = crypto.createHmac('SHA256', secret).update(signature).digest('hex');
//     return `${key}:${localSignature}:${nonce}`;
// }

// function sendGetRequest(query: string) {
//     const hostname = 'thalesmarket.banxa-sandbox.com';
//     const nonce = Date.now();
//     const method = 'GET';
//     const data = method + '\n' + query + '\n' + nonce;

//     const hmac = generateHmac(data, nonce);
//     const options = {
//         hostname: hostname,
//         path: query,
//         method: method,
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${hmac}`,
//         },
//     };

//     fetch('https://' + hostname + query, options).then(async (res: any) => {
//         const result = JSON.parse(await res.text());
//         console.log(result);
//         console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//     });
// }

// const ProviderWrapper = styled.div`
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
//     gap: 12px;
//     width: 100%;
//     margin-top: -20px;
//     margin-bottom: 80px;
// `;

export default Wizzard;