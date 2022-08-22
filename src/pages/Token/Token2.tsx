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
import { TokenTabEnum } from 'types/token';
import { getIsOVM } from 'utils/network';
import MigrationNotice from './components/MigrationNotice';
import TabContainer from './components/TabContainer';
import TokenOverview from './components/TokenOverview';
import TokenNavFooter from './MobileFooter/TokenNavFooter';

const TokenPage: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const defaultTab = isL2 ? TokenTabEnum.GAMIFIED_STAKING : TokenTabEnum.MIGRATION;

    const tabs = [
        {
            id: TokenTabEnum.GAMIFIED_STAKING,
            name: t('options.earn.gamified-staking.tab-title'),
            disabled: false,
        },
        {
            id: TokenTabEnum.LP_STAKING,
            name: t('options.earn.lp-staking.tab-title'),
            disabled: false,
        },
    ];

    if (!isL2) {
        tabs.unshift({
            id: TokenTabEnum.MIGRATION,
            name: t('migration.title'),
            disabled: false,
        });
        tabs.push({
            id: TokenTabEnum.STRATEGIC_INVESTORS,
            name: t('options.earn.snx-stakers.tab-title'),
            disabled: false,
        });
    }

    const tabIds = tabs.map((tab) => tab.id);
    const isTabEnabled = (tabId: string) => {
        const tab = tabs.find((tab) => tab.id === tabId);
        return tab ? !tab.disabled : false;
    };

    const location = useLocation();
    const paramTab = queryString.parse(location.search).tab;
    const isTabAvailable = paramTab !== null && tabIds.includes(paramTab) && isTabEnabled(paramTab);
    const [selectedTab, setSelectedTab] = useState(isTabAvailable ? paramTab : defaultTab);

    useEffect(() => {
        const paramTab = queryString.parse(location.search).tab;
        const isTabAvailable = paramTab !== null && tabIds.includes(paramTab) && isTabEnabled(paramTab);
        setSelectedTab(isTabAvailable ? paramTab : defaultTab);
    }, [location, isL2]);

    return (
        <>
            <OpRewardsBanner />
            <Container>
                <FlexDivColumn>
                    <TokenOverview />
                    {!isL2 && selectedTab !== TokenTabEnum.MIGRATION && <MigrationNotice />}

                    <MainContentContainer>
                        <TabContainer tabItems={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                    </MainContentContainer>
                </FlexDivColumn>
            </Container>
            <TokenNavFooter selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
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
    @media (max-width: 767px) {
        padding-bottom: 100px;
    }
`;

export default TokenPage;
