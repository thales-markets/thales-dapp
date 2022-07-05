import React, { lazy, Suspense, useEffect, useState } from 'react';
import useInterval from 'hooks/useInterval';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Modal } from '@material-ui/core';

import arrow from 'assets/images/arrow-link.svg';
import metamask from 'assets/images/metamask.svg';
import insertCard from 'assets/images/wizard/insert-card.svg';
import separator from 'assets/images/wizard/vertical-line.svg';
import banxa from 'assets/images/wizard/logo-banxa.svg';
import mtPelerin from 'assets/images/wizard/logo-mt-pelerin.svg';
import bungee from 'assets/images/wizard/logo-bungee.svg';
import layerSwap from 'assets/images/wizard/logo-layerswap.svg';

import ROUTES from 'constants/routes';
import onboardConnector from 'utils/onboardConnector';
import { navigateTo } from 'utils/routes';

import { WizardSteps } from '../Wizard';
import { XButton } from 'theme/common';
import SPAAnchor from 'components/SPAAnchor';
import SimpleLoader from 'components/SimpleLoader';

enum NavItems {
    Step1 = 'Step 1 - Metamask',
    Step2 = 'Step 2 - Get ETH',
    Step3 = 'Step 3 - Get SUSD',
    Step4 = 'Step 4 - Trade',
}

enum Provider {
    Banxa = 'https://thalesmarket.banxa.com/iframe?code=x68QxHYZ2hQU0rccKDgDSeUO7QonDXsY?blockchain=XRP',
    MtPelerin = 'https://widget.mtpelerin.com/?type=popup&lang=en&primary=%2304045a&mylogo=https://thalesmarket.io/THALES_LOGOTIP.svg&net=optimism_mainnet&bsc=EUR&bdc=ETH&crys=ETH',
    Bungee = 'https://www.bungee.exchange/',
    LayerSwap = 'https://www.layerswap.io/?destNetwork=optimism_mainnet&lockNetwork=true&sourceExchangeName=binance&asset=usdc',
}

const MMURL = 'https://metamask.io/download/';

const Swap = lazy(() => import(/* webpackChunkName: "Swap" */ 'components/Swap'));

const Steps: React.FC<{ step: number; setCurrentStep: any }> = ({ step, setCurrentStep }) => {
    const [installMetamask, setInstallMetamask] = useState(false);
    const [metamaskInstaleld, setMetamaskInstaleld] = useState(typeof window.ethereum !== 'undefined');

    const [showBuyModal, setShowBuyModal] = useState(false);
    const [iframe, setIframe] = useState('');
    const [iframeLoader, setLoader] = useState(false);

    const [showSwap, setShowSwap] = useState(false);

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined' && isWalletConnected) {
            setCurrentStep(WizardSteps.Buy);
        }
    }, [isWalletConnected]);

    // Check after every 1s if user installed Metamask
    useInterval(
        () => {
            const mmInstaled = typeof window.ethereum !== 'undefined';
            setMetamaskInstaleld(mmInstaled);
            if (mmInstaled) {
                setCurrentStep(WizardSteps.ConnectMetamask);
            }
        },
        installMetamask && !metamaskInstaleld ? 1000 : null
    );

    const metamaskClickHandler = () => {
        if (typeof window.ethereum === 'undefined') {
            window.open(MMURL);
            setInstallMetamask(true);
        } else {
            onboardConnector.connectWallet();
        }
    };

    const buyButtonHandler = (buttonType: Provider) => {
        switch (buttonType) {
            case Provider.Banxa:
                setIframe(Provider.Banxa.toString());
                setLoader(true);
                break;
            case Provider.MtPelerin:
                setIframe(Provider.MtPelerin.toString());
                setLoader(true);
                break;
            default:
                setIframe('');
        }
    };

    return (
        <>
            <CardWrapper>
                <Card
                    clickable={step !== WizardSteps.InstallMetamask && step !== WizardSteps.ConnectMetamask}
                    onClick={() => {
                        if (step !== WizardSteps.InstallMetamask && step !== WizardSteps.ConnectMetamask) {
                            setCurrentStep(WizardSteps.ConnectMetamask);
                        }
                    }}
                    active={step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask}
                >
                    <Image
                        src={metamask}
                        clickable={step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask}
                        onClick={() => {
                            if (step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask) {
                                metamaskClickHandler();
                            }
                        }}
                    />
                    <CardNameWrapper>
                        <Text>
                            {typeof window.ethereum === 'undefined' ? (
                                <>
                                    Install{' '}
                                    <a href={MMURL} rel="noreferrer" target="_blank">
                                        Metamask
                                    </a>
                                </>
                            ) : (
                                <Trans i18nKey="wizard-page.step1-name" />
                            )}
                        </Text>
                        {(step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask) && (
                            <ArrowImg
                                clickable={step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask}
                                src={arrow}
                                onClick={() => {
                                    if (step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask) {
                                        metamaskClickHandler();
                                    }
                                }}
                            />
                        )}
                    </CardNameWrapper>
                </Card>
                <Card
                    clickable={isWalletConnected && step !== WizardSteps.Buy}
                    active={step === WizardSteps.Buy}
                    onClick={() => {
                        if (!isWalletConnected) return;
                        if (step !== WizardSteps.Buy) {
                            setCurrentStep(WizardSteps.Buy);
                        }
                    }}
                >
                    <Image
                        src={insertCard}
                        clickable={isWalletConnected && step === WizardSteps.Buy}
                        onClick={() => (step === WizardSteps.Buy ? setShowBuyModal(true) : '')}
                    />
                    <CardNameWrapper>
                        <Text>
                            <Trans i18nKey="wizard-page.step2-name" />
                        </Text>
                        {step === WizardSteps.Buy && (
                            <ArrowImg
                                clickable={isWalletConnected && step === WizardSteps.Buy}
                                src={arrow}
                                onClick={() => (step === WizardSteps.Buy ? setShowBuyModal(true) : '')}
                            />
                        )}
                    </CardNameWrapper>
                </Card>
                <Card
                    clickable={isWalletConnected && step !== WizardSteps.Exchange}
                    active={step === WizardSteps.Exchange}
                    onClick={() => {
                        if (!isWalletConnected) return;
                        if (step !== WizardSteps.Exchange) {
                            setCurrentStep(WizardSteps.Exchange);
                        }
                    }}
                >
                    <IconsWrapper>
                        <Icon
                            clickable={isWalletConnected && step === WizardSteps.Exchange}
                            style={{ fontSize: 74 }}
                            className={`sidebar-icon icon--swap`}
                            onClick={() => (step === WizardSteps.Exchange ? setShowSwap(true) : '')}
                        />
                    </IconsWrapper>
                    <CardNameWrapper>
                        <Text>
                            <Trans i18nKey="wizard-page.step3-name" />
                        </Text>
                        {step === WizardSteps.Exchange && (
                            <ArrowImg
                                clickable={isWalletConnected && step === WizardSteps.Exchange}
                                src={arrow}
                                onClick={() => (step === WizardSteps.Exchange ? setShowSwap(true) : '')}
                            />
                        )}
                    </CardNameWrapper>
                </Card>
                <Card
                    clickable={isWalletConnected && step !== WizardSteps.Trade}
                    active={step === WizardSteps.Trade}
                    onClick={() => {
                        if (!isWalletConnected) return;
                        if (step !== WizardSteps.Trade) {
                            setCurrentStep(WizardSteps.Trade);
                        }
                    }}
                >
                    <IconsWrapper>
                        <IconWrapper
                            clickable={isWalletConnected && step === WizardSteps.Trade}
                            active={step === WizardSteps.Trade}
                        >
                            <Icon
                                clickable={isWalletConnected && step === WizardSteps.Trade}
                                className={`sidebar-icon icon--markets`}
                                onClick={() => (step === WizardSteps.Trade ? navigateTo(ROUTES.Options.Home) : '')}
                            />
                            <IconText>
                                <Trans i18nKey="wizard-page.step4-directional" />
                            </IconText>
                        </IconWrapper>
                        <SeparatorImg src={separator} />
                        <IconWrapper
                            clickable={isWalletConnected && step === WizardSteps.Trade}
                            active={step === WizardSteps.Trade}
                        >
                            <Icon
                                clickable={isWalletConnected && step === WizardSteps.Trade}
                                className={`sidebar-icon icon--ranged-markets`}
                                onClick={() =>
                                    step === WizardSteps.Trade ? navigateTo(ROUTES.Options.RangeMarkets) : ''
                                }
                            />
                            <IconText>
                                <Trans i18nKey="wizard-page.step4-ranged" />
                            </IconText>
                        </IconWrapper>
                    </IconsWrapper>
                    <CardNameWrapper>
                        <Text>
                            <Trans i18nKey="wizard-page.step4-name" />
                        </Text>
                    </CardNameWrapper>
                </Card>
            </CardWrapper>
            <CardWrapper justifyContent={false}>
                <Step active={step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask}>1</Step>
                <Step active={step === WizardSteps.Buy}>2</Step>
                <Step active={step === WizardSteps.Exchange}>3</Step>
                <Step active={step === WizardSteps.Trade}>4</Step>
            </CardWrapper>
            <Nav justifyContent={'space-between'}>
                <NavItem
                    className={
                        step === WizardSteps.InstallMetamask || step === WizardSteps.ConnectMetamask ? 'active' : ''
                    }
                >
                    {NavItems.Step1}
                </NavItem>
                <NavItem className={step === WizardSteps.Buy ? 'active' : ''}>{NavItems.Step2}</NavItem>
                <NavItem className={step === WizardSteps.Exchange ? 'active' : ''}>{NavItems.Step3}</NavItem>
                <NavItem className={step === WizardSteps.Trade ? 'active' : ''}>{NavItems.Step4}</NavItem>
            </Nav>
            <LineUnderNav />
            {showBuyModal && (
                <Modal
                    open={showBuyModal}
                    onClose={() => {
                        setShowBuyModal(false);
                    }}
                    style={modalStyle}
                >
                    <BuyWrapper>
                        <BuyXButton onClick={() => setShowBuyModal(false)} />
                        <BuyTitle>
                            <Trans i18nKey="wizard-page.buy-title" />
                        </BuyTitle>
                        <ButtonLogoGroup>
                            <ButtonWrapper>
                                <Button
                                    onClick={() => {
                                        buyButtonHandler(Provider.Banxa);
                                    }}
                                >
                                    <Trans i18nKey="wizard-page.buy-button1" />
                                </Button>
                            </ButtonWrapper>
                            <Logo logoType={Provider.Banxa} />
                        </ButtonLogoGroup>
                        <ButtonLogoGroup>
                            <ButtonWrapper>
                                <Button
                                    onClick={() => {
                                        buyButtonHandler(Provider.MtPelerin);
                                    }}
                                >
                                    <Trans i18nKey="wizard-page.buy-button2" />
                                </Button>
                            </ButtonWrapper>
                            <Logo logoType={Provider.MtPelerin} />
                        </ButtonLogoGroup>
                        <ButtonLogoGroup>
                            <ButtonWrapper>
                                <SPAAnchor href={Provider.Bungee}>
                                    <Button>
                                        <Trans i18nKey="wizard-page.buy-button3" />
                                    </Button>
                                </SPAAnchor>
                            </ButtonWrapper>
                            <Logo logoType={Provider.Bungee} />
                        </ButtonLogoGroup>
                        <ButtonLogoGroup>
                            <ButtonWrapper>
                                <SPAAnchor href={Provider.LayerSwap}>
                                    <Button>
                                        <Trans i18nKey="wizard-page.buy-button4" />
                                    </Button>
                                </SPAAnchor>
                            </ButtonWrapper>
                            <Logo logoType={Provider.LayerSwap} />
                        </ButtonLogoGroup>
                    </BuyWrapper>
                </Modal>
            )}
            <Modal
                open={iframe.length > 0}
                onClose={() => {
                    setIframe('');
                }}
            >
                <IFrameWrapper>
                    <IframeXButton onClick={() => setIframe('')} />
                    {iframeLoader && <SimpleLoader />}
                    <IFrame src={iframe} onLoad={() => setLoader(false)} />
                </IFrameWrapper>
            </Modal>
            {showSwap && (
                <Modal
                    open={showSwap}
                    onClose={() => {
                        setShowSwap(false);
                    }}
                    style={modalStyle}
                >
                    <Suspense fallback={<></>}>
                        <Swap handleClose={setShowSwap} />
                    </Suspense>
                </Modal>
            )}
        </>
    );
};

export default Steps;

const Nav = styled.div<{ justifyContent: string }>`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: ${(_props) => _props.justifyContent};
    @media (max-width: 768px) {
        margin-top: 20px;
    }
`;

const NavItem = styled.div`
    flex: 1;
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 700;
    line-height: 40px;
    font-size: 15px;
    letter-spacing: 0.035em;
    text-align: center;
    text-transform: uppercase;
    color: var(--primary-color);
    cursor: pointer;
    white-space: pre;
    &.active {
        box-shadow: 0px 4px var(--primary-filter-menu-active);
    }
    @media (max-width: 768px) {
        font-size: 14px;
        padding: 0 20px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
        padding: 0;
    }
`;

const LineUnderNav = styled.div`
    height: 4px;
    border-radius: 3px;
    background: rgba(100, 217, 254, 0.5);
    width: 100%;
`;

const CardWrapper = styled.div<{ justifyContent?: boolean }>`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.justifyContent ? 'center' : 'space-around')};
    gap: 30px;
    margin-top: 30px;
    margin-bottom: 30px;
`;
const Card = styled.div<{ clickable: boolean; active?: boolean }>`
    width: 195px;
    height: 189px;
    border: 2px solid var(--input-border-color);
    border-radius: 15px;
    text-align: center;
    padding: 40px 0;
    cursor: ${(props) => (props.clickable ? 'pointer' : '')};
    opacity: ${(props) => (props.active ? '1' : '0.3')};
    &:hover {
        ${(props) => (props.clickable || props.active ? 'box-shadow: var(--shadow);' : '')};
        ${(props) => (props.clickable || props.active ? 'transform: scale(1.02);' : '')};
        ${(props) => (props.clickable || props.active ? 'border: 2px solid rgb(100, 217, 254, 1);' : '')};
        ${(props) => (props.clickable || props.active ? 'opacity: 1;' : '')};
    }
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
        left: -157px;
        width: 155px;
        border-top: 3px dashed var(--input-border-color);
        opacity: 0.5;
    }
`;

const CardNameWrapper = styled.div`
    justify-content: right;
    align-items: center;
    margin-top: 25px;
`;

const IconsWrapper = styled.div`
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const IconWrapper = styled.div<{ clickable: boolean; active: boolean }>`
    cursor: ${(props) => (props.clickable ? 'pointer' : '')};

    animation: ${(props) => (props.active ? 'pulsing 2s ease-in;' : '')};
    animation-iteration-count: ${(props) => (props.active ? 'infinite;' : '')};

    @keyframes pulsing {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;

const Image = styled.img<{ clickable: boolean }>`
    width: 84px;
    height: 84px;
    cursor: ${(props) => (props.clickable ? 'pointer' : '')};
`;

const Icon = styled.i<{ clickable: boolean }>`
    font-size: 57px;
    color: var(--input-border-color);
    cursor: ${(props) => (props.clickable ? 'pointer' : '')};
`;

const IconText = styled.p`
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    text-transform: capitalize;
    color: #64d9fe;
    padding-top: 5px;
`;

const ArrowImg = styled.img<{ clickable: boolean }>`
    height: 14px;
    float: right;
    margin-right: 8px;
    margin-top: -18px;
    cursor: ${(props) => (props.clickable ? 'pointer' : '')};

    animation: pulse 1s ease-in;
    animation-iteration-count: infinite;

    @keyframes pulse {
        0% {
            -webkit-transform: scale(1);
            opacity: 1;
        }
        50% {
            -webkit-transform: scale(1.3);
            opacity: 1;
        }
        100% {
            -webkit-transform: scale(1);
            opacity: 1;
        }
    }
`;

const SeparatorImg = styled.img`
    background: #64d9fe;
    width: 4px;
    height: 72px;
    margin-bottom: 15px;
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

const BuyWrapper = styled.div`
    box-sizing: border-box;
    position: absolute;
    width: 390px;
    height: 441px;
    margin: auto;
    position: relative;
    top: 200px;
    background: #04045a;
    border: 2px solid #64d9fe;
    box-shadow: 0px 0px 90px 10px #64d9fe;
    border-radius: 15px;
    outline: none;
`;

const BuyXButton = styled(XButton)`
    position: absolute;
    top: 20px;
    right: 20px;
`;

const IframeXButton = styled(XButton)`
    position: relative;
    top: -20px;
    left: 530px;
`;

const BuyTitle = styled.div`
    margin-bottom: 10px;
    margin-top: 35px;
    font-family: 'Sansation';
    font-style: normal;
    font-weight: 400;
    font-size: 21px;
    line-height: 24px;
    position: relative;
    text-align: center;
    text-transform: capitalize;
    color: #ffffff;
`;

const ButtonLogoGroup = styled.div`
    display: flex;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 28px;
    margin-top: 28px;
`;

const Button = styled.div`
    display: flex;
    width: 146px;
    height: 28px;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border: 1px solid #64d9fe;
    border-radius: 30px;
    font-family: 'Sansation';
    font-style: normal;
    font-weight: 400;
    font-size: 12.5px;
    line-height: 14px;
    cursor: pointer;
    color: #ffffff;
    background-color: transparent;
    padding: 5px 0px;
    text-transform: capitalize;
    margin-left: 30px;
`;

const handleLogoType = (logoType: Provider) => {
    switch (logoType) {
        case Provider.Banxa:
            return banxa;
        case Provider.MtPelerin:
            return mtPelerin;
        case Provider.Bungee:
            return bungee;
        case Provider.LayerSwap:
            return layerSwap;
        default:
            return '';
    }
};

const Logo = styled.div<{ logoType: Provider }>`
    content: url(${(_props) => handleLogoType(_props.logoType)});
    margin-left: 20px;
`;

const IFrameWrapper = styled.div`
    width: 530px;
    height: 740px;
    margin: auto;
    background: white;
    margin-top: 100px;
    border-radius: 15px;
    outline: none;
`;

const IFrame = styled.iframe`
    width: 100%;
    height: 100%;
`;

const modalStyle = {
    backdropFilter: 'blur(10px)',
};
