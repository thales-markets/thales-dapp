import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivCentered, FlexDiv } from 'theme/common';
import Migrate from './Migrate';
import Swap from './Swap';
import { useLocation } from 'react-router-dom';
import { history } from 'utils/routes';
import queryString from 'query-string';

const Migration: React.FC = () => {
    const { t } = useTranslation();

    const tabs = [
        {
            id: 'migrate',
            name: t(`migration.tabs.migrate`),
        },
        // {
        //     id: 'withdraw',
        //     name: t(`migration.tabs.withdraw`),
        // },
        {
            id: 'swap',
            name: t(`migration.tabs.swap`),
        },
    ];
    const tabIds = tabs.map((tab) => tab.id);

    const location = useLocation();
    const paramAction = queryString.parse(location.search).action;
    const isTabAvailable = paramAction !== null && tabIds.includes(paramAction);
    const [selectedTab, setSelectedTab] = useState(isTabAvailable ? paramAction : 'migrate');

    const optionsTabContent: Array<{
        id: string;
        name: string;
    }> = useMemo(() => tabs, [t]);

    useEffect(() => {
        const paramAction = queryString.parse(location.search).action;
        if (paramAction !== null && tabIds.includes(paramAction)) {
            setSelectedTab(paramAction);
        }
    }, [location]);

    return (
        <GridWrapper>
            <Wrapper>
                <Container>
                    <OptionsTabContainer>
                        {optionsTabContent.map((tab, index) => (
                            <OptionsTab
                                isActive={tab.id === selectedTab}
                                key={index}
                                index={index}
                                onClick={() => {
                                    history.push({
                                        pathname: location.pathname,
                                        search: queryString.stringify({
                                            tab: 'migration',
                                            action: tab.id,
                                        }),
                                    });
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
        </GridWrapper>
    );
};

const GridWrapper = styled(FlexDivColumnCentered)`
    grid-column: span 10;
    align-items: center;
`;

const Wrapper = styled(FlexDivColumnCentered)`
    background: linear-gradient(150.74deg, rgba(202, 145, 220, 0.6) -7.89%, rgba(106, 193, 213, 0.6) 107.94%);
    padding: 1px;
    border-radius: 15px;
    margin: 60px 10px 50px 10px;
`;

const Container = styled(FlexDivColumn)`
    background: #04045a;
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    border-radius: 15px;
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
