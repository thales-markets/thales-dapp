import React, { useState } from 'react';
import styled from 'styled-components';
import Metaverse from './components/Metaverse';
import Mint from './components/Mint';
import Story from './components/Story';

const TaleOfThales: React.FC = () => {
    // const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    return (
        <>
            <TabsContainer>
                <Tab onClick={() => setActiveTab(0)} active={activeTab === 0}>
                    Metaverse
                </Tab>
                <Tab onClick={() => setActiveTab(1)} active={activeTab === 1}>
                    Mint NFT
                </Tab>
                <Tab onClick={() => setActiveTab(2)} active={activeTab === 2}>
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
    border-bottom: 4px solid var(--table-border-color);
    border-radius: 3px;
    @media (max-width: 1024px) {
        margin-top: 30px;
    }
    @media (max-width: 768px) {
        display: none;
    }
`;

const Tab = styled.div<{ active: boolean }>`
    font-weight: 400;
    font-size: 25px;
    text-align: center;
    width: 25%;
    font-family: Roboto !important;
    font-style: normal;
    color: var(--primary-color);
    box-shadow: ${(props) => (props?.active ? '0px 4px var(--primary-filter-menu-active)' : '')};
    text-transform: uppercase;
    padding: 10px 5px;
    cursor: pointer;
    @media (max-width: 1192px) {
        font-size: 23px;
        padding: 5px;
    }
`;

export default TaleOfThales;
