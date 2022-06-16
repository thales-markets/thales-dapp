import Button from 'components/Button';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Steps from './components/Steps';
import WizzardText from './components/WizzardText';
import { ethers } from 'ethers';
import https from 'https';

enum WizzardSteps {
    None,
    Metamask,
    Buy,
    Exchange,
    Trade,
}

enum OnRampProvider {
    MtPelerin,
    Banxa,
}

const getPaymentMethods = '/api/payment-methods?source=USD';

const Wizzard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(WizzardSteps.None);
    const [onRampProvider, setProvider] = useState(OnRampProvider.MtPelerin);

    const iFrameUrl = useMemo(() => {
        if (onRampProvider === OnRampProvider.MtPelerin) {
            return 'https://widget.mtpelerin.com/?lang=en';
        } else {
            sendGetRequest(getPaymentMethods);
        }
    }, [onRampProvider]);

    console.log(iFrameUrl);

    return (
        <>
            <ProviderWrapper>
                <Button padding={'5px 20px'} onClickHandler={setProvider.bind(this, OnRampProvider.MtPelerin)}>
                    MtPelerin
                </Button>
                <Button padding={'5px 20px'} onClickHandler={setProvider.bind(this, OnRampProvider.Banxa)}>
                    Banxa
                </Button>
            </ProviderWrapper>
            <Steps step={currentStep} setCurrentStep={setCurrentStep}></Steps>
            <WizzardText step={currentStep}></WizzardText>
        </>
    );
};

// Endpoint: thalesmarket.banxa-sandbox.com
// API Key: thalesmarket@2022test
// Secret: x68QxHYZ2hQU0rccKDgDSeUO7QonDXsY

function generateHmac(signature: any, nonce: any) {
    const key = 'thalesmarket@2022test';
    const secret = 'x68QxHYZ2hQU0rccKDgDSeUO7QonDXsY';

    const localSignature = ethers.utils.computeHmac(
        ethers.utils.SupportedAlgorithm.sha256,
        ethers.utils.toUtf8Bytes(secret),
        ethers.utils.toUtf8Bytes(signature)
    );
    return `${key}:${localSignature}:${nonce}`;
}

// const getIframe = () => {
//     const options = {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer null',
//         },
//     };

//     fetch('https://api.banxa.com/api/orders', options)
//         .then((response) => response.json())
//         .then((response) => console.log(response))
//         .catch((err) => console.error(err));
// };

function sendGetRequest(query: any) {
    const hostname = 'thalesmarket.banxa-sandbox.com';
    const nonce = Date.now();
    const method = 'GET';
    const data = method + '\n' + query + '\n' + nonce;

    const hmac = generateHmac(data, nonce);
    console.log('hmac: ', hmac);
    const options = {
        hostname: hostname,
        path: query,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${hmac}`,
        },
    };

    console.log('options: ', options);

    const req = https.get(options, (res: any) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk: any) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e: any) => {
        console.error(`problem with request: ${e.message}`);
    });
}

const ProviderWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin-top: -20px;
    margin-bottom: 80px;
`;

export default Wizzard;
