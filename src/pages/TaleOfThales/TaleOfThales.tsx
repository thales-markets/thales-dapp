import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Metaverse from './components/Metaverse';
import Mint from './components/Mint';
import Story from './components/Story';
import { history } from 'utils/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const TaleOfThales: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        history.push({ pathname: location.pathname, search: location.search });
    }, []);

    useEffect(() => {
        const listener = () => {
            history.push({ pathname: location.pathname, search: location.search });
        };
        window.addEventListener('popstate', listener);
        return () => window.removeEventListener('popstate', listener);
    }, []);

    return (
        <>
            <TabsContainer>
                <Tab onClick={() => setActiveTab(0)} active={activeTab === 0}>
                    Metaverse
                </Tab>
                <Tab
                    onClick={async () => {
                        if (activeTab === 0) {
                            // @ts-ignore
                            window?.webSocket?.close();
                            await delay(100);
                        }
                        setActiveTab(1);
                    }}
                    active={activeTab === 1}
                >
                    Mint NFT
                </Tab>
                <Tab
                    onClick={async () => {
                        if (activeTab === 0) {
                            // @ts-ignore
                            window?.webSocket?.close();
                            await delay(100);
                        }
                        setActiveTab(2);
                    }}
                    active={activeTab === 2}
                >
                    Story
                </Tab>
            </TabsContainer>
            {activeTab === 0 && <Metaverse />}
            {activeTab === 1 && <Mint />}
            {activeTab === 2 && <Story />}
        </>
    );
};

const TabsContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    border-bottom: 4px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 3px;
    @media (max-width: 1024px) {
        margin-top: 30px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const Tab = styled.div<{ active: boolean }>`
    font-weight: 400;
    font-size: 25px;
    text-align: center;
    width: 25%;
    color: ${(props) => (props.active ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    box-shadow: ${(props) => (props.active ? `0px 4px ${props.theme.borderColor.quaternary};` : '')};
    text-transform: uppercase;
    padding: 10px 5px;
    cursor: pointer;
    @media (max-width: 1192px) {
        font-size: 23px;
        padding: 5px;
    }
`;

export default TaleOfThales;
