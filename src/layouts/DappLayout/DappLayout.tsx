import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { getTheme } from 'redux/modules/ui';
import styled from 'styled-components';
import DappHeader from './components/DappHeader/DappHeader';

type DappLayoutProps = {
    children: React.ReactNode;
};

const DappLayout: React.FC<DappLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const theme = useSelector((state: RootState) => getTheme(state));
    return (
        <>
            {isAppReady ? (
                <Background style={{ minHeight: '100vh' }} className={theme == 0 ? 'light' : 'dark'}>
                    <NewWrapper>
                        <DappHeader />
                        {children}
                    </NewWrapper>
                </Background>
            ) : (
                <Loader />
            )}
        </>
    );
};

const Background = styled.section`
    @media (min-width: 1440px) {
        background-size: cover !important;
    }

    &#landing-hero {
        min-height: 900px;
        @media (max-width: 767px) {
            min-height: 600px;
        }
        position: relative;
        z-index: 2;
        &.hide-background {
            background: transparent;
        }

        & ~ section {
            position: relative;
            z-index: 2;
            &:not(:last-of-type):after {
                content: '';
                display: block;
                width: min(620px, 30%);
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                height: 2px;
                filter: blur(2px);
                background-color: rgb(0, 249, 255);
            }
            &#faq:after {
                width: 100%;
            }
            &:last-of-type {
                backdrop-filter: blur(20px);
            }
            &.hide-background {
                background: transparent;
            }
        }
    }

    &.hero {
        @media (min-height: 1000px) and (min-width: 1200px) {
            min-height: 800px;
        }
    }

    &:nth-child(even) {
        @media (max-width: 767px) {
            & > div {
                flex-flow: column-reverse;
            }
        }
    }
    &.light {
        background-color: #f7f7f7;
        --background: #f7f7f7;
        --icon-color: #04045a;
        --shadow: 0px 0px 50px rgba(4, 4, 90, 0.4);
        --primary-color: #04045a;
        --input-border-color: #04045a;
        --table-border-color: #64d9fe;
        --table-header-text-color: #64d9fe;
        --disabled-item: #8181ac;
        --enabled-item: #04045a;
        --primary-filter-menu-active: #04045a;
        --hotmarket-arrow-enabled: #64d9fe;
        --hotmarket-arrow-disable: rgba(100, 217, 254, 0.5);
    }
    &.dark {
        background-color: #04045a;
        --background: #04045a;
        --icon-color: #f7f7f7;
        --shadow: 0px 0px 40px #64d9fe;
        --primary-color: #f7f7f7;
        --input-border-color: #64d9fe;
        --table-border-color: rgba(100, 217, 254, 0.5);
        --table-header-text-color: #64d9fe;
        --disabled-item: #8181ac;
        --enabled-item: #f7f7f7;
        --primary-filter-menu-active: #64d9fe;
        --hotmarket-arrow-enabled: #64d9fe;
        --hotmarket-arrow-disable: rgba(100, 217, 254, 0.5);
    }
`;

const NewWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    @media (min-width: 1000px) {
        padding: 40px 100px 40px 100px;
    }
    min-height: 100vh;
`;

export default DappLayout;
