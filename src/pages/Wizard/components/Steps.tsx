import { Modal } from '@material-ui/core';
import useInterval from 'hooks/useInterval';
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

import arrow from 'assets/images/arrow-link.svg';
import metamask from 'assets/images/metamask.svg';
import insertCard from 'assets/images/wizard/insert-card.svg';
import banxa from 'assets/images/wizard/logo-banxa.svg';
import bungee from 'assets/images/wizard/logo-bungee.svg';
import layerSwap from 'assets/images/wizard/logo-layerswap.svg';
import mtPelerin from 'assets/images/wizard/logo-mt-pelerin.svg';
import separator from 'assets/images/wizard/vertical-line.svg';

import { POLYGON_ID } from 'constants/network';
import ROUTES from 'constants/routes';

import SimpleLoader from 'components/SimpleLoader';
import SPAAnchor from 'components/SPAAnchor';
import { XButton } from 'theme/common';
import { WizardSteps } from '../Wizard';
import BungeePlugin from 'components/BungeePlugin';
import { useConnectModal } from '@rainbow-me/rainbowkit';

enum NavItems {
    STEP_1 = 'Step 1 - Metamask',
    STEP_2 = 'Step 2 - Get ETH',
    STEP_3 = 'Step 3 - Get SUSD',
    STEP_4 = 'Step 4 - Trade',
}

enum Provider {
    BANXA = 'https://thalesmarket.banxa.com/iframe?code=x68QxHYZ2hQU0rccKDgDSeUO7QonDXsY&coinType=ETH&fiatType=EUR&blockchain=OPTIMISM',
    MT_PELERIN = 'https://widget.mtpelerin.com/?type=popup&lang=en&primary=%2304045a&mylogo=https://thalesmarket.io/THALES_LOGOTIP.svg',
    BUNGEE = '',
    LAYER_SWAP = 'https://www.layerswap.io/?destNetwork=optimism_mainnet&lockNetwork=true&sourceExchangeName=binance&asset=usdc',
}

const MMURL = 'https://metamask.io/download/';

const Swap = lazy(() => import(/* webpackChunkName: "Swap" */ 'components/Swap'));

const Steps: React.FC<{ step: number; setCurrentStep: any }> = ({ step, setCurrentStep }) => {
    const { openConnectModal } = useConnectModal();

    const [installMetamask, setInstallMetamask] = useState(false);
    const [metamaskInstaleld, setMetamaskInstaleld] = useState(typeof window.ethereum !== 'undefined');

    const [showBuyModal, setShowBuyModal] = useState(false);
    const [iframe, setIframe] = useState('');
    const [iframeLoader, setLoader] = useState(false);

    const [showBungeePlugin, setShowBungeePlugin] = useState(false);

    const [showSwap, setShowSwap] = useState(false);

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const ref = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (isWalletConnected) {
            const timer = setTimeout(() => {
                setCurrentStep(WizardSteps.BUY);
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        } else if (typeof window.ethereum !== 'undefined') {
            setCurrentStep(WizardSteps.CONNECT_METAMASK);
        }
    }, [isWalletConnected]);

    // After click on install check every 1s if user installed Metamask
    useInterval(
        () => {
            const mmInstaled = typeof window.ethereum !== 'undefined';
            setMetamaskInstaleld(mmInstaled);
            if (mmInstaled) {
                setCurrentStep(WizardSteps.CONNECT_METAMASK);
            }
        },
        installMetamask && !metamaskInstaleld ? 1000 : null
    );

    const buyBridgeButtonHandler = (buttonType: Provider) => {
        switch (buttonType) {
            case Provider.BANXA:
                setIframe(Provider.BANXA.toString());
                setLoader(true);
                break;
            case Provider.MT_PELERIN:
                const queryParams =
                    networkId === POLYGON_ID
                        ? '&net=polygon_mainnet&bsc=EUR&bdc=MATIC&crys=MATIC'
                        : '&net=optimism_mainnet&bsc=EUR&bdc=ETH&crys=ETH';
                setIframe(Provider.MT_PELERIN.toString() + queryParams);
                setLoader(true);
                break;
            case Provider.BUNGEE:
                setShowBungeePlugin(true);
                break;
            default:
                setIframe('');
        }
    };

    const isStep1 = step === WizardSteps.INSTALL_METAMASK || step === WizardSteps.CONNECT_METAMASK;

    const scrollToSteps = () => ref.current?.scrollIntoView({ behavior: 'smooth' });
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const step1ClickHandler = async () => {
        if (isStep1) {
            scrollToSteps();
            if (typeof window.ethereum === 'undefined') {
                await delay(300);
                window.open(MMURL);
                setInstallMetamask(true);
            } else {
                const delayMs = ref.current?.getBoundingClientRect().top || 500;
                await delay(delayMs < 300 ? 300 : delayMs);
                openConnectModal?.();
            }
        }
    };
    const step2ClickHandler = async (navigateOnly: boolean) => {
        if (!isWalletConnected) return;
        scrollToSteps();
        if (!navigateOnly && step === WizardSteps.BUY) {
            const delayMs = ref.current?.getBoundingClientRect().top || 500;
            await delay(delayMs < 300 ? 300 : delayMs);
            setShowBuyModal(true);
        } else {
            setCurrentStep(WizardSteps.BUY);
        }
    };
    const step3ClickHandler = (navigateOnly = false) => {
        if (!isWalletConnected) return;
        scrollToSteps();
        if (!navigateOnly && step === WizardSteps.EXCHANGE) {
            setShowSwap(true);
        } else {
            setCurrentStep(WizardSteps.EXCHANGE);
        }
    };
    const step4ClickHandler = () => {
        scrollToSteps();
        if (!isWalletConnected) return;
        setCurrentStep(WizardSteps.TRADE);
    };

    return (
        <>
            <CardWrapper ref={ref}>
                <Card clickable={isStep1} active={isStep1} onClick={step1ClickHandler}>
                    <IconWrapper clickable={isStep1} active={isStep1}>
                        <Image src={metamask} clickable={isStep1} />
                    </IconWrapper>
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
                        {isStep1 && <ArrowImg clickable={isStep1} src={arrow} />}
                    </CardNameWrapper>
                </Card>
                <Card
                    clickable={isWalletConnected}
                    active={step === WizardSteps.BUY}
                    onClick={() => step2ClickHandler(false)}
                >
                    <IconWrapper
                        clickable={isWalletConnected && step === WizardSteps.BUY}
                        active={step === WizardSteps.BUY}
                    >
                        <Image src={insertCard} clickable={isWalletConnected && step === WizardSteps.BUY} />
                    </IconWrapper>
                    <CardNameWrapper>
                        <Text>
                            <Trans i18nKey="wizard-page.step2-name" />
                        </Text>
                        {step === WizardSteps.BUY && (
                            <ArrowImg clickable={isWalletConnected && step === WizardSteps.BUY} src={arrow} />
                        )}
                    </CardNameWrapper>
                </Card>
                <Card
                    clickable={isWalletConnected}
                    active={step === WizardSteps.EXCHANGE}
                    onClick={() => step3ClickHandler(false)}
                >
                    <IconWrapper
                        clickable={isWalletConnected && step === WizardSteps.EXCHANGE}
                        active={step === WizardSteps.EXCHANGE}
                    >
                        <Icon
                            clickable={isWalletConnected && step === WizardSteps.EXCHANGE}
                            style={iconStyle}
                            className={`sidebar-icon icon--swap`}
                        />
                    </IconWrapper>
                    <CardNameWrapper>
                        <Text>
                            <Trans i18nKey="wizard-page.step3-name" />
                        </Text>
                        {step === WizardSteps.EXCHANGE && (
                            <ArrowImg clickable={isWalletConnected && step === WizardSteps.EXCHANGE} src={arrow} />
                        )}
                    </CardNameWrapper>
                </Card>
                <Card
                    clickable={isWalletConnected && step !== WizardSteps.TRADE}
                    active={step === WizardSteps.TRADE}
                    onClick={step4ClickHandler}
                >
                    <IconsWrapper>
                        <IconWrapper
                            clickable={isWalletConnected && step === WizardSteps.TRADE}
                            active={step === WizardSteps.TRADE}
                            onClick={() => {
                                if (step === WizardSteps.TRADE) {
                                    window.open(ROUTES.Options.Home, '_blank');
                                }
                            }}
                        >
                            <Icon
                                clickable={isWalletConnected && step === WizardSteps.TRADE}
                                className={`sidebar-icon icon--markets`}
                            />
                            <IconText>
                                <Trans i18nKey="wizard-page.step4-directional" />
                            </IconText>
                        </IconWrapper>
                        <SeparatorImg src={separator} />
                        <IconWrapper
                            clickable={isWalletConnected && step === WizardSteps.TRADE}
                            active={step === WizardSteps.TRADE}
                            onClick={() => {
                                if (step === WizardSteps.TRADE) {
                                    window.open(ROUTES.Options.RangeMarkets, '_blank');
                                }
                            }}
                            pulseDelay="0.5s"
                        >
                            <Icon
                                clickable={isWalletConnected && step === WizardSteps.TRADE}
                                className={`sidebar-icon icon--ranged-markets`}
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
                <Step active={isStep1} clickable={isStep1}>
                    1
                </Step>
                <Step
                    active={step === WizardSteps.BUY}
                    clickable={isWalletConnected}
                    onClick={() => step2ClickHandler(true)}
                >
                    2
                </Step>
                <Step
                    active={step === WizardSteps.EXCHANGE}
                    clickable={isWalletConnected}
                    onClick={() => step3ClickHandler(true)}
                >
                    3
                </Step>
                <Step active={step === WizardSteps.TRADE} clickable={isWalletConnected} onClick={step4ClickHandler}>
                    4
                </Step>
            </CardWrapper>
            <Nav justifyContent={'space-between'}>
                <NavItem className={isStep1 ? 'active' : ''} clickable={isStep1}>
                    {NavItems.STEP_1}
                </NavItem>
                <NavItem
                    className={step === WizardSteps.BUY ? 'active' : ''}
                    clickable={isWalletConnected}
                    onClick={() => step2ClickHandler(true)}
                >
                    {NavItems.STEP_2}
                </NavItem>
                <NavItem
                    className={step === WizardSteps.EXCHANGE ? 'active' : ''}
                    clickable={isWalletConnected}
                    onClick={() => step3ClickHandler(true)}
                >
                    {NavItems.STEP_3}
                </NavItem>
                <NavItem
                    className={step === WizardSteps.TRADE ? 'active' : ''}
                    clickable={isWalletConnected}
                    onClick={step4ClickHandler}
                >
                    {NavItems.STEP_4}
                </NavItem>
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
                                        buyBridgeButtonHandler(Provider.BANXA);
                                    }}
                                >
                                    <Trans i18nKey="wizard-page.buy-button1" />
                                </Button>
                            </ButtonWrapper>
                            <Logo logoType={Provider.BANXA} />
                        </ButtonLogoGroup>
                        <ButtonLogoGroup>
                            <ButtonWrapper>
                                <Button
                                    onClick={() => {
                                        buyBridgeButtonHandler(Provider.MT_PELERIN);
                                    }}
                                >
                                    <Trans i18nKey="wizard-page.buy-button2" />
                                </Button>
                            </ButtonWrapper>
                            <Logo logoType={Provider.MT_PELERIN} />
                        </ButtonLogoGroup>
                        <ButtonLogoGroup>
                            <ButtonWrapper>
                                <Button
                                    onClick={() => {
                                        buyBridgeButtonHandler(Provider.BUNGEE);
                                    }}
                                >
                                    <Trans i18nKey="wizard-page.buy-button3" />
                                </Button>
                            </ButtonWrapper>
                            <Logo logoType={Provider.BUNGEE} />
                        </ButtonLogoGroup>
                        <ButtonLogoGroup>
                            <ButtonWrapper>
                                <SPAAnchor href={Provider.LAYER_SWAP}>
                                    <Button>
                                        <Trans i18nKey="wizard-page.buy-button4" />
                                    </Button>
                                </SPAAnchor>
                            </ButtonWrapper>
                            <Logo logoType={Provider.LAYER_SWAP} />
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
            {showBungeePlugin && (
                <Modal
                    open={showBungeePlugin}
                    onClose={() => {
                        setShowBungeePlugin(false);
                    }}
                >
                    <Suspense fallback={<></>}>
                        <BungeePlugin />
                    </Suspense>
                </Modal>
            )}
            {showSwap && (
                <Modal
                    open={showSwap}
                    onClose={(_, reason) => {
                        if (reason !== 'backdropClick') setShowSwap(false);
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
    justify-content: ${(props) => props.justifyContent};
    @media (max-width: 768px) {
        margin-top: 20px;
    }
`;

const NavItem = styled.div<{ clickable: boolean }>`
    flex: 1;
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 700;
    line-height: 40px;
    font-size: 15px;
    letter-spacing: 0.035em;
    text-align: center;
    text-transform: uppercase;
    color: var(--color-white);
    cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
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
const Step = styled.div<{ active?: boolean; clickable: boolean }>`
    position: relative;
    width: 79px;
    height: 79px;
    background: var(--background);
    border-radius: 50%;
    border: 4px solid var(--input-border-color);
    color: var(--input-border-color);
    text-align: center;
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 76px;
    text-transform: uppercase;
    z-index: 2;
    opacity: ${(props) => (props.active ? '1' : '0.3')};
    cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
    &:not(:first-child)::after {
        content: ' ';
        display: block;
        position: absolute;
        top: 36px;
        left: -157px;
        width: 155px;
        border-top: 3px dashed var(--input-border-color);
        opacity: 0.5;
        cursor: default;
    }
`;

const CardNameWrapper = styled.div`
    justify-content: right;
    align-items: center;
    margin-top: 25px;
`;

const IconsWrapper = styled.div`
    height: 87px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const IconWrapper = styled.div<{ clickable: boolean; active: boolean; pulseDelay?: string }>`
    cursor: ${(props) => (props.clickable ? 'pointer' : '')};

    animation: ${(props) => (props.active ? 'pulsing 1s ease-in ' + (props.pulseDelay ?? '') + ';' : '')};
    animation-iteration-count: ${(props) => (props.active ? 'infinite;' : '')};

    @keyframes pulsing {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
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
    padding-top: 16px;
    color: var(--input-border-color);
    cursor: ${(props) => (props.clickable ? 'pointer' : '')};
`;

const IconText = styled.p`
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: var(--color-highlight);
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
            -webkit-transform: scale(1.4);
            opacity: 1;
        }
        100% {
            -webkit-transform: scale(1);
            opacity: 1;
        }
    }
`;

const SeparatorImg = styled.img`
    background: var(--color-highlight);
    width: 4px;
    height: 72px;
    margin-top: 5px;
`;

const Text = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 23px;
    color: var(--color-white);
    a {
        font-weight: 700;
        text-decoration: underline;
        color: var(--input-border-color);
    }
`;

const BuyWrapper = styled.div`
    box-sizing: border-box;
    width: 390px;
    height: 441px;
    margin: auto;
    position: relative;
    top: 100px;
    background: var(--color-primary);
    border: 2px solid var(--color-highlight);
    box-shadow: 0px 0px 90px 10px var(--color-highlight);
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
    color: var(--color-white);
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
    border: 1px solid var(--color-highlight);
    border-radius: 30px;
    font-family: 'Sansation';
    font-style: normal;
    font-weight: 400;
    font-size: 12.5px;
    line-height: 14px;
    cursor: pointer;
    color: var(--color-white);
    background-color: transparent;
    padding: 5px 0px;
    margin-left: 30px;
`;

const handleLogoType = (logoType: Provider) => {
    switch (logoType) {
        case Provider.BANXA:
            return banxa;
        case Provider.MT_PELERIN:
            return mtPelerin;
        case Provider.BUNGEE:
            return bungee;
        case Provider.LAYER_SWAP:
            return layerSwap;
        default:
            return '';
    }
};

const Logo = styled.div<{ logoType: Provider }>`
    content: url(${(props) => handleLogoType(props.logoType)});
    margin-left: 20px;
`;

const IFrameWrapper = styled.div`
    width: 530px;
    height: 635px;
    margin: auto;
    background: white;
    margin-top: 50px;
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

const iconStyle = {
    fontSize: 74,
    padding: '6.5px 0px',
};
