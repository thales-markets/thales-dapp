import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isNetworkSupported } from 'utils/network';
import { getNetworkId } from 'redux/modules/wallet';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getReferralWallet, setReferralWallet } from 'utils/referral';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import axios from 'axios';
import { generalConfig } from 'config/general';
import { isAndroid, isMetamask, isMobile } from 'utils/device';
import useWidgetBotScript from 'hooks/useWidgetBotScript';

const DappHeader = lazy(() => import(/* webpackChunkName: "DappHeader" */ './components/DappHeader/DappHeader'));

type DappLayoutProps = {
    children: React.ReactNode;
};

const DappLayout: React.FC<DappLayoutProps> = ({ children }) => {
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
        document.getElementsByTagName('body')[0].style.overflow = isNetworkSupported(networkId) ? 'auto' : 'hidden';
    }, [networkId]);

    useEffect(() => {
        const checkMetamaskBrowser = async () => {
            const isMetamaskBrowser = isMobile() && (await isMetamask());
            // Do not load Discord Widget Bot on Android MM browser due to issue with MM wallet connect
            // issue raised on https://github.com/rainbow-me/rainbowkit/issues/1181
            setPreventDiscordWidgetLoad(isMetamaskBrowser && isAndroid());
        };
        checkMetamaskBrowser();
    }, []);

    useWidgetBotScript(preventDiscordWidgetLoad);

    return (
        <Background id="main-content">
            <Suspense fallback={<></>}>
                <DappHeader />
            </Suspense>
            <NewWrapper>{children}</NewWrapper>
            <ToastContainer theme={'colored'} />
            {!isNetworkSupported(networkId) && <Loader />}
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
    --background: var(--color-primary);
    --shadow: 0px 0px 40px var(--color-highlight);
    --button-shadow: 0px 1px 30px rgba(100, 217, 254, 0.7);
    --input-border-color: var(--color-highlight);
    --table-border-color: rgba(100, 217, 254, 0.5);
    --table-border-hover-color: rgba(100, 217, 254, 1);
    --table-header-text-color: var(--color-highlight);
    --disabled-item: #8181ac;
    --enabled-item: #f7f7f7;
    --primary-filter-menu-active: var(--color-highlight);
    --hotmarket-arrow-enabled: var(--color-highlight);
    --hotmarket-arrow-disable: rgba(100, 217, 254, 0.5);
    --scrollbar-width: 10px;
    --color-scrollbar-hover: #f7f7f7;
    --button-bg-active: var(--color-highlight);
    --button-text-active: var(--color-primary);
    --button-bg-inactive: transparent;
    --button-text-inactive: var(--color-highlight);
    --notice-text: var(--color-highlight);
    --amm-switch-circle: #f7f7f7;
    --card-border-color: rgba(100, 217, 254, 0.3);
`;

const NewWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding: 20px 20px 0px 92px;
    @media (max-width: 1024px) {
        padding: 0 20px;
        padding-bottom: 90px !important;
    }
    @media (max-width: 568px) {
        padding: 0 10px;
    }
    max-width: 1440px;
`;

export default DappLayout;
