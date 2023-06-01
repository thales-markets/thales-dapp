import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getNetworkId } from 'redux/modules/wallet';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getReferralWallet, setReferralWallet } from 'utils/referral';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import axios from 'axios';
import { generalConfig } from 'config/general';
import { isAndroid, isMetamask } from 'utils/device';
import useWidgetBotScript from 'hooks/useWidgetBotScript';
import { ThemeInterface } from 'types/ui';
import { getIsMobile } from 'redux/modules/ui';

const DappHeader = lazy(() => import(/* webpackChunkName: "DappHeader" */ './components/DappHeader/DappHeader'));

type DappLayoutProps = {
    children: React.ReactNode;
};

const DappLayout: React.FC<DappLayoutProps> = ({ children }) => {
    const theme: ThemeInterface = useTheme();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

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
            const isMetamaskBrowser = isMobile && (await isMetamask());
            // Do not load Discord Widget Bot on Android MM browser due to issue with MM wallet connect
            // issue raised on https://github.com/rainbow-me/rainbowkit/issues/1181
            setPreventDiscordWidgetLoad(isMetamaskBrowser && isAndroid());
        };
        checkMetamaskBrowser();
    }, []);

    useWidgetBotScript(preventDiscordWidgetLoad, theme);

    return (
        <Background id="main-content">
            <Suspense fallback={<></>}>
                <DappHeader />
            </Suspense>
            <Wrapper>{children}</Wrapper>
            <ToastContainer theme={'colored'} />
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
