import { useMatomo } from '@datapunt/matomo-tracker-react';
import axios from 'axios';
import { generalConfig } from 'config/general';
import useWidgetBotScript from 'hooks/useWidgetBotScript';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { isAndroid, isMetamask, isMobile } from 'utils/device';
import { getReferralWallet, setReferralWallet } from 'utils/referral';
import DappHeader from './DappHeader';
import DappFooter from './DappFooter';
import DappSidebar from './DappSidebar';
import { ScreenSizeBreakpoint } from '../../enums/ui';
import StickyBanner from 'components/StickyBanner';

type DappLayoutProps = {
    children: React.ReactNode;
};

const DappLayout: React.FC<DappLayoutProps> = ({ children }) => {
    const theme: ThemeInterface = useTheme();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const rawParams = useLocation();
    const queryParams = queryString.parse(rawParams?.search);

    const { trackPageView } = useMatomo();

    const [preventDiscordWidgetLoad, setPreventDiscordWidgetLoad] = useState(true);

    useEffect(() => {
        if (queryParams?.referralId) {
            setReferralWallet(queryParams?.referralId);
        }
        if (queryParams?.referrerId) {
            const fetchIdAddress = async () => {
                const response = await axios.get(
                    `${generalConfig.API_URL}/get-refferer-id-address/${encodeURIComponent(queryParams.referrerId)}`
                );
                if (response.data) {
                    setReferralWallet(response.data);
                }
            };
            fetchIdAddress();
        }
    }, []);

    useEffect(() => {
        const referralWallet = getReferralWallet();

        trackPageView({
            customDimensions: [
                {
                    id: 1,
                    value: networkId ? networkId?.toString() : '',
                },
                {
                    id: 2,
                    value: referralWallet ? referralWallet : '',
                },
            ],
        });
    }, [rawParams, networkId]);

    useEffect(() => {
        const checkMetamaskBrowser = async () => {
            const isMetamaskBrowser = isMobile() && (await isMetamask());
            // Do not load Discord Widget Bot on Android MM browser due to issue with MM wallet connect
            // issue raised on https://github.com/rainbow-me/rainbowkit/issues/1181
            setPreventDiscordWidgetLoad(isMetamaskBrowser && isAndroid());
        };
        checkMetamaskBrowser();
    }, []);

    useWidgetBotScript(preventDiscordWidgetLoad, theme);

    return (
        <Background id="main-content">
            <StickyBanner />
            <Wrapper>
                <DappSidebar />
                <DappHeader />
                {children}
                <DappFooter />
            </Wrapper>

            <StyledToastContainer />
        </Background>
    );
};

const Background = styled.section`
    transition: all 0.5s ease;
    min-height: 100vh;
    position: relative;
    top: 0;
    left: 0;
    overflow: hidden;
    &.collapse {
        transition: all 0.5s ease;
        min-height: unset;
        left: 275px;
        overflow: hidden;
    }
    background-color: ${(props) => props.theme.background.primary};
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    padding: 30px 20px 0px 92px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px 10px 0 10px;
        padding-bottom: 50px !important;
    }
    max-width: 1440px;
    min-height: 100vh;
`;

const StyledToastContainer = styled(ToastContainer)`
    &&&.Toastify__toast-container {
        width: 330px;
        @media (max-width: 600px) {
            top: 0;
            padding: 0;
            left: 0;
            margin: 0;
            transform: translateX(0);
        }
    }
    .Toastify__toast {
        width: 322px;
        height: 68px;
        cursor: default;
        border-radius: 15px;

        &.success {
            background: ${(props) =>
                `linear-gradient(90deg, ${props.theme.toastMessages.success.background.secondary} -1.48%, ${props.theme.toastMessages.success.background.tertiary} 102.44%)`};
        }
        &.info {
            background: ${(props) =>
                `linear-gradient(90deg, ${props.theme.toastMessages.info.background.secondary} -1.48%, ${props.theme.toastMessages.info.background.tertiary} 102.44%)`};
        }
        &.warning {
            background: ${(props) =>
                `linear-gradient(90deg, ${props.theme.toastMessages.warning.background.secondary} -1.48%, ${props.theme.toastMessages.warning.background.tertiary} 102.44%)`};
        }
        &.error {
            background: ${(props) =>
                `linear-gradient(90deg, ${props.theme.toastMessages.error.background.secondary} -1.48%, ${props.theme.toastMessages.error.background.tertiary} 102.44%)`};
        }

        color: ${(props) => props.theme.toastMessages.error.textColor.primary};

        @media (max-width: 600px) {
            width: 100vw;
            border-radius: 0;
        }
    }
    .Toastify__progress-bar {
        height: 8px;
        background: inherit;

        &.success {
            background: ${(props) => props.theme.toastMessages.success.background.primary};
        }
        &.info {
            background: ${(props) => props.theme.toastMessages.info.background.primary};
        }
        &.warning {
            background: ${(props) => props.theme.toastMessages.warning.background.primary};
        }
        &.error {
            background: ${(props) => props.theme.toastMessages.error.background.primary};
        }
    }
    .Toastify__toast-icon {
        width: 28px;
        margin-inline-end: 12px;
    }
    .Toastify__spinner {
        width: 28px;
        height: 28px;
        border-right-color: ${(props) => props.theme.toastMessages.info.background.primary};
    }
`;

export default DappLayout;
