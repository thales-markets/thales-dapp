import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivCentered, FlexDiv, FlexDivRowCentered } from 'theme/common';
import Migrate from './Migrate';
import Bridge from './Bridge';
import Swap from './Swap';
import { useLocation } from 'react-router-dom';
import { history } from 'utils/routes';
import queryString from 'query-string';
import { StyledInfoIcon, StyledMaterialTooltip, Tip20Link } from '../components';

const Migration: React.FC = () => {
    const { t } = useTranslation();

    const tabs = [
        {
            id: 'migrate',
            name: t(`migration.tabs.migrate-and-bridge`),
        },
        {
            id: 'swap',
            name: t(`migration.tabs.migrate`),
        },
        {
            id: 'bridge',
            name: t(`migration.tabs.bridge`),
        },
        // {
        //     id: 'withdraw',
        //     name: t(`migration.tabs.withdraw`),
        // },
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
                    <FlexDivRowCentered>
                        <FlexDiv>
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
                        </FlexDiv>
                        {selectedTab === 'migrate' && (
                            <StyledMaterialTooltip
                                arrow={true}
                                title={
                                    <Trans
                                        i18nKey="migration.info-tooltip"
                                        components={[<span key="1" />, <Tip20Link key="2" />]}
                                    />
                                }
                                interactive
                            >
                                <StyledInfoIcon />
                            </StyledMaterialTooltip>
                        )}
                    </FlexDivRowCentered>
                    {selectedTab === 'migrate' && <Migrate />}
                    {selectedTab === 'swap' && <Swap />}
                    {selectedTab === 'bridge' && <Bridge />}
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
    min-width: 550px;
    @media (max-width: 767px) {
        margin: 10px;
        min-width: 200px;
    }
`;

const Container = styled(FlexDivColumn)`
    background: #04045a;
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    border-radius: 15px;
    padding: 30px 60px 40px 60px;
    max-width: 550px;
    @media (max-width: 767px) {
        padding: 30px 20px 40px 20px;
    }
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
