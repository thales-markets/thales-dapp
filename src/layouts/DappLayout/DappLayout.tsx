import React, { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { getTheme } from 'redux/modules/ui';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isNetworkSupported } from 'utils/network';
import { getNetworkId } from 'redux/modules/wallet';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getReferralWallet, setReferralWallet } from 'utils/referral';
import { useMatomo } from '@datapunt/matomo-tracker-react';

const DappHeader = lazy(() => import(/* webpackChunkName: "DappHeader" */ './components/DappHeader/DappHeader'));

type DappLayoutProps = {
    children: React.ReactNode;
};

const DappLayout: React.FC<DappLayoutProps> = ({ children }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const theme = useSelector((state: RootState) => getTheme(state));

    const rawParams = useLocation();
    const queryParams = queryString.parse(rawParams?.search);

    const { trackPageView } = useMatomo();

    useEffect(() => {
        if (queryParams?.referralId) {
            setReferralWallet(queryParams?.referralId);
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
    }, [rawParams]);

    useEffect(() => {
        document.getElementsByTagName('body')[0].style.overflow = isNetworkSupported(networkId) ? 'auto' : 'hidden';
    }, [networkId]);

    return (
        <Background id="main-content" className={theme == 0 ? 'light' : 'dark'}>
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
    &.light {
        background-color: #f9f9f9;
        --background: #f9f9f9;
        --icon-color: #04045a;
        --shadow: 0px 0px 50px rgba(4, 4, 90, 0.4);
        --button-shadow: 0px 1px 30px rgba(100, 217, 254, 0.7);
        --primary-color: #04045a;
        --input-border-color: #21448b;
        --table-border-color: #21448b;
        --table-border-hover-color: rgba(33, 68, 139, 0.5);
        --table-header-text-color: #21448b;
        --disabled-item: #8181ac;
        --enabled-item: #04045a;
        --primary-filter-menu-active: #04045a;
        --hotmarket-arrow-enabled: #21448b;
        --hotmarket-arrow-disable: rgba(100, 217, 254, 0.5);
        --color-wrapper: #4673bd;
        --scrollbar-width: 12px;
        --button-bg-active: #21448b;
        --button-text-active: #04045a;
        --button-bg-inactive: transparent;
        --button-text-inactive: #21448b;
        --notice-text: #21448b;
        --amm-switch-circle: #04045a;
        --card-border-color: rgba(33, 68, 139, 0.3);
    }
    &.dark {
        background-color: #04045a;
        --background: #04045a;
        --icon-color: #f7f7f7;
        --shadow: 0px 0px 40px #64d9fe;
        --button-shadow: 0px 1px 30px rgba(100, 217, 254, 0.7);
        --primary-color: #f7f7f7;
        --input-border-color: #64d9fe;
        --table-border-color: rgba(100, 217, 254, 0.5);
        --table-border-hover-color: rgba(100, 217, 254, 1);
        --table-header-text-color: #64d9fe;
        --disabled-item: #8181ac;
        --enabled-item: #f7f7f7;
        --primary-filter-menu-active: #64d9fe;
        --hotmarket-arrow-enabled: #64d9fe;
        --hotmarket-arrow-disable: rgba(100, 217, 254, 0.5);
        --color: #f7f7f7;
        --color-wrapper: #4673bd;
        --scrollbar-width: 12px;
        --color-scrollbar-hover: #f7f7f7;
        --button-bg-active: #64d9fe;
        --button-text-active: #04045a;
        --button-bg-inactive: transparent;
        --button-text-inactive: #64d9fe;
        --notice-text: #64d9fe;
        --amm-switch-circle: #f7f7f7;
        --card-border-color: rgba(100, 217, 254, 0.3);
    }
`;

const NewWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 20px 0px 92px;
    @media (max-width: 1024px) {
        padding: 0 20px;
        padding-bottom: 90px !important;
    }
    @media (max-width: 568px) {
        padding: 0 10px;
    }
    max-width: 1440px;
    min-height: 100vh;
`;

export default DappLayout;
