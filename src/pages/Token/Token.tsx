import ElectionsBanner from 'components/ElectionsBanner';
import Footer from 'components/Footer';
import OpRewardsBanner from 'components/OpRewardsBanner';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { TokenTabEnum, TokenTabSectionIdEnum } from 'types/token';
import { getIsArbitrum, getIsOVM } from 'utils/network';
import MigrationNotice from './components/MigrationNotice';
import TokenNavFooter from './components/MobileFooter/TokenNavFooter';
import TabContainer from './components/TabContainer';
import TokenOverview from './components/TokenOverview';

const TokenPage: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const isArb = getIsArbitrum(networkId);

    const defaultTab = isL2 || isArb ? TokenTabEnum.GAMIFIED_STAKING : TokenTabEnum.MIGRATION;

    const tabs = [
        {
            id: TokenTabEnum.GAMIFIED_STAKING,
            name: t('options.earn.gamified-staking.tab-title'),
        },
    ];

    const tabSections = [
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: TokenTabSectionIdEnum.STAKING,
            title: t('options.earn.gamified-staking.staking.section-title'),
            description: t('options.earn.gamified-staking.staking.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: TokenTabSectionIdEnum.REWARDS,
            title: t('options.earn.gamified-staking.rewards.section-title'),
            description: t('options.earn.gamified-staking.rewards.section-description'),
            warning: t('options.earn.gamified-staking.rewards.section-warning'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: TokenTabSectionIdEnum.VESTING,
            title: t('options.earn.gamified-staking.vesting.section-title'),
            description: t('options.earn.gamified-staking.vesting.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: TokenTabSectionIdEnum.MERGE_ACCOUNT,
            title: t('options.earn.gamified-staking.merge-account.section-title'),
            description: '',
            isButton: true,
            buttonWidth: 'auto',
        },
        {
            tab: TokenTabEnum.LP_STAKING,
            id: TokenTabSectionIdEnum.LP_STAKING,
            title: t('options.earn.lp-staking.section-title'),
            description: '',
            isButton: false,
        },
    ];

    if (isL2) {
        tabs.push({
            id: TokenTabEnum.LP_STAKING,
            name: t('options.earn.lp-staking.tab-title'),
        });
    }

    if (!isL2 && !isArb) {
        tabs.push({
            id: TokenTabEnum.MIGRATION,
            name: t('migration.title'),
        });
        tabs.push({
            id: TokenTabEnum.STRATEGIC_INVESTORS,
            name: t('options.earn.snx-stakers.tab-title'),
        });
    }

    const location = useLocation();
    const paramTab = queryString.parse(location.search).tab;
    const tabIds = tabs.map((tab) => tab.id);
    const isTabAvailable = paramTab !== null && tabIds.includes(paramTab);
    const [selectedTab, setSelectedTab] = useState(isTabAvailable ? paramTab : defaultTab);
    const defaultSection =
        selectedTab === TokenTabEnum.GAMIFIED_STAKING
            ? TokenTabSectionIdEnum.STAKING
            : selectedTab === TokenTabEnum.LP_STAKING
            ? TokenTabSectionIdEnum.LP_STAKING
            : undefined;
    const [selectedSection, setSelectedSection] = useState(defaultSection);

    useEffect(() => {
        const paramTab = queryString.parse(location.search).tab;
        const isTabAvailable = paramTab !== null && tabIds.includes(paramTab);
        setSelectedTab(isTabAvailable ? paramTab : defaultTab);
    }, [location, isL2]);

    useEffect(() => {
        const paramActiveButtonId = queryString.parse(location.search).activeButtonId;
        const section = tabSections.find((section) => section.id === paramActiveButtonId);
        setSelectedSection(section?.id);
    }, [selectedTab]);

    return (
        <>
            {isL2 && <OpRewardsBanner />}
            <ElectionsBanner />
            <Container>
                <FlexDivColumn>
                    <TokenOverview />
                    {!isL2 && !isArb && selectedTab !== TokenTabEnum.MIGRATION && <MigrationNotice />}

                    <MainContentContainer>
                        <TabContainer
                            tabItems={tabs}
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            tabSections={tabSections}
                            selectedSection={selectedSection}
                        />
                    </MainContentContainer>
                </FlexDivColumn>
            </Container>
            <TokenNavFooter
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
            />
            <Footer />
        </>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    @media (max-width: 1024px) {
        flex-direction: column;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
    }
`;

const MainContentContainer = styled.div`
    padding-top: 5px;
    overflow: hidden;
`;

export default TokenPage;
