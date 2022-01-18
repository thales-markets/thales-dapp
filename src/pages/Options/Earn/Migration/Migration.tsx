import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivCentered, FlexDiv } from 'theme/common';
import Migrate from './Migrate';
import Swap from './Swap';

const Migration: React.FC = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<string>('migrate');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const optionsTabContent: Array<{
        id: string;
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'migrate',
                name: t(`migration.tabs.migrate`),
            },
            {
                id: 'withdraw',
                name: t(`migration.tabs.withdraw`),
            },
            {
                id: 'swap',
                name: t(`migration.tabs.swap`),
            },
        ],
        [t]
    );

    return (
        <Wrapper>
            <Container>
                <OptionsTabContainer>
                    {optionsTabContent.map((tab, index) => (
                        <OptionsTab
                            isActive={tab.id === selectedTab}
                            key={index}
                            index={index}
                            onClick={() => {
                                setSelectedTab(tab.id);
                            }}
                            className={`${tab.id === selectedTab ? 'selected' : ''}`}
                        >
                            {tab.name}
                        </OptionsTab>
                    ))}
                </OptionsTabContainer>
                {selectedTab === 'migrate' && <Migrate />}
                {selectedTab === 'swap' && <Swap />}
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumnCentered)`
    grid-column: span 10;
    align-items: center;
`;

const Container = styled(FlexDivColumn)`
    margin: 60px 10px 50px 10px;
    background: #04045a;
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    border-radius: 30px;
    padding: 30px 60px 40px 60px;
    max-width: 500px;
    @media (max-width: 767px) {
        padding: 30px 20px 40px 20px;
    }
`;

const OptionsTabContainer = styled(FlexDiv)`
    margin-bottom: 40px;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #748bc6;
    user-select: none;
    margin-left: 10px;
    margin-right: 20px;
    &.selected {
        transition: 0.2s;
        color: #00f9ff;
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: #f6f6fe;
    }
`;

export default Migration;
