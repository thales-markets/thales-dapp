import React, { lazy, Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import metamask from 'assets/images/metamask.svg';
import wizzard from 'assets/images/wizzard.svg';
import { Modal } from '@material-ui/core';
import onboardConnector from 'utils/onboardConnector';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

const MMURL = 'https://metamask.io/download/';

const Swap = lazy(() => import(/* webpackChunkName: "Swap" */ 'components/Swap'));

const Steps: React.FC<{ step: number; setCurrentStep: any; iframe: string }> = ({ step, setCurrentStep, iframe }) => {
    const [showIframe, setShowIframe] = useState(false);
    const [showSwap, setShowSwap] = useState(false);
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined' && isWalletConnected) {
            setCurrentStep(2);
        }
    }, [isWalletConnected]);

    return (
        <>
            <CardWrapper>
                <Card
                    onClick={() => {
                        if (step === 1) {
                            if (typeof window.ethereum === 'undefined') window.open(MMURL);
                            else onboardConnector.connectWallet();
                        } else {
                            setCurrentStep(1);
                        }
                    }}
                    active={step === 0 || step === 1}
                >
                    <Image src={metamask} />
                    <Text>
                        {typeof window.ethereum === 'undefined' ? (
                            <>
                                Install{' '}
                                <a href={MMURL} rel="noreferrer" target="_blank">
                                    Metamask
                                </a>
                            </>
                        ) : (
                            <>Connect Wallet</>
                        )}
                    </Text>
                </Card>
                <Card
                    active={step === 0 || step === 2}
                    onClick={() => {
                        if (step === 2) setShowIframe(true);
                        else setCurrentStep(2);
                    }}
                >
                    <Image src={wizzard} />
                    <Text>Buy Ethereum</Text>
                </Card>
                <Card
                    active={step === 0 || step === 3}
                    onClick={() => {
                        if (step === 3) setShowSwap(true);
                        else setCurrentStep(3);
                    }}
                >
                    <IconWrapper>
                        <Icon style={{ fontSize: 74 }} className={`sidebar-icon icon--swap`} />
                    </IconWrapper>
                    <Text>Exchange to sUSD</Text>
                </Card>
                <Card
                    active={step === 0 || step === 4}
                    onClick={() => {
                        if (step === 4) navigateTo(ROUTES.Options.Home);
                        else setCurrentStep(4);
                    }}
                >
                    <IconWrapper>
                        <Icon className={`sidebar-icon icon--markets`} />
                        <Icon className={`sidebar-icon icon--ranged-markets`} />
                    </IconWrapper>

                    <Text>Thales Markets</Text>
                </Card>
            </CardWrapper>
            <CardWrapper justifyContent={false}>
                <Step active={step === 0 || step === 1}>1</Step>
                <Step active={step === 0 || step === 2}>2</Step>
                <Step active={step === 0 || step === 3}>3</Step>
                <Step active={step === 0 || step === 4}>4</Step>
            </CardWrapper>
            <Modal
                open={showIframe}
                onClose={() => {
                    setShowIframe(false);
                }}
            >
                <IFrameWrapper>
                    <IFrame src={iframe} />
                </IFrameWrapper>
            </Modal>
            {showSwap && (
                <Modal
                    open={showSwap}
                    onClose={() => {
                        setShowSwap(false);
                    }}
                    style={{ backdropFilter: 'blur(10px)' }}
                >
                    <Suspense fallback={<></>}>
                        <Swap handleClose={setShowSwap}></Swap>
                    </Suspense>
                </Modal>
            )}
        </>
    );
};

export default Steps;

const CardWrapper = styled.div<{ justifyContent?: boolean }>`
    position: relative;
    max-width: 900px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.justifyContent ? 'center' : 'space-around')};
    gap: 30px;
    margin-bottom: 30px;
`;
const Card = styled.div<{ active?: boolean }>`
    width: 195px;
    height: 189px;
    border: 2px solid var(--input-border-color);
    border-radius: 15px;
    text-align: center;
    padding: 40px 0;
    cursor: pointer;
    opacity: ${(props) => (props.active ? '1' : '0.3')};
`;
const Step = styled.div<{ active?: boolean }>`
    position: relative;
    width: 79px;
    height: 79px;
    background: var(--background);
    border-radius: 50%;
    border: 4px solid var(--input-border-color);
    color: var(--input-border-color);
    text-align: center;
    position: relative;
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 76px;
    text-transform: uppercase;
    z-index: 2;
    opacity: ${(props) => (props.active ? '1' : '0.3')};
    &:not(:first-child)::after {
        content: ' ';
        display: block;
        position: absolute;
        top: 36px;
        left: -160px;
        width: 160px;
        border-top: 3px dashed var(--input-border-color);
        opacity: 0.5;
    }
`;

const IconWrapper = styled.div`
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const Image = styled.img`
    width: 84px;
    height: 84px;
`;

const Icon = styled.i`
    font-size: 57px;
    color: var(--input-border-color);
`;
const Text = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 23px;
    text-transform: capitalize;
    color: var(--color);
    a {
        font-weight: 700;
        text-decoration: underline;
        color: var(--input-border-color);
    }
`;

const IFrameWrapper = styled.div`
    width: 530px;
    height: 640px;
    margin: auto;
    background: white;
    margin-top: 100px;
    border-radius: 15px;
`;

const IFrame = styled.iframe`
    width: 100%;
    height: 100%;
`;
