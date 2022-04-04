import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { getTheme } from 'redux/modules/ui';
import styled from 'styled-components';
import DappHeader from './components/DappHeader/DappHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isNetworkSupported } from '../../utils/network';
import { getNetworkId } from '../../redux/modules/wallet';

type DappLayoutProps = {
    children: React.ReactNode;
};

const DappLayout: React.FC<DappLayoutProps> = ({ children }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const theme = useSelector((state: RootState) => getTheme(state));

    useEffect(() => {
        document.getElementsByTagName('body')[0].style.overflow = isNetworkSupported(networkId) ? 'auto' : 'hidden';
    }, [networkId]);

    return (
        <Background style={{ minHeight: '100vh' }} className={theme == 0 ? 'light' : 'dark'}>
            <NewWrapper>
                <DappHeader />
                {children}
            </NewWrapper>
            <ToastContainer theme={'colored'} />
            {!isNetworkSupported(networkId) && <Loader />}
        </Background>
    );
};

const Background = styled.section`
    &.light {
        background-color: #f7f7f7;
        --background: #f7f7f7;
        --icon-color: #04045a;
        --shadow: 0px 0px 50px rgba(4, 4, 90, 0.4);
        --button-shadow: 0px 1px 30px rgba(100, 217, 254, 0.7);
        --primary-color: #04045a;
        --input-border-color: #04045a;
        --table-border-color: #64d9fe;
        --table-header-text-color: #64d9fe;
        --disabled-item: #8181ac;
        --enabled-item: #04045a;
        --primary-filter-menu-active: #04045a;
        --hotmarket-arrow-enabled: #64d9fe;
        --hotmarket-arrow-disable: rgba(100, 217, 254, 0.5);
        --color-wrapper: #4673bd;
        --scrollbar-width: 12px;
        --button-bg-active: #64d9fe;
        --button-text-active: #04045a;
        --button-bg-inactive: transparent;
        --button-text-inactive: #64d9fe;
        --notice-text: #04045a;
        --amm-switch-circle: #04045a;
        --card-border-color: rgba(100, 217, 254, 0.5);
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
        --card-border-color: rgba(100, 217, 254, 0.5);
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
    padding: 40px 20px 40px 92px;
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
