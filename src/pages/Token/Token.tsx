import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'theme/common';
import ThalesStaking from './ThalesStaking';
import SnxStaking from './SnxStaking';
import Vesting from './Vesting';
import LPStaking from './LPStaking';
import LPStakingL2 from './LPStakingL2';
import { useLocation } from 'react-router-dom';
import { history } from 'utils/routes';
import queryString from 'query-string';
import TokenOverview from './components/TokenOverview';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM } from 'utils/network';
import Migration from './Migration';
import MigrationNotice from './components/MigrationNotice';
import { useSelector } from 'react-redux';
import TokenNavFooter from './MobileFooter/TokenNavFooter';
import Notice from './components/Notice';
import { MigrateButton, MigrateText } from './components/MigrationNotice/MigrationNotice';
import MigratedRewards from './MigratedRewards';

const TokenPage: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const defaultTab = isL2 ? 'staking' : 'migration';

    const tabs = [
        {
            id: 'staking',
            name: t('options.earn.thales-staking.tab-title'),
            disabled: false,
        },
    ];

    if (isL2) {
        tabs.push({
            id: 'vesting',
            name: t('options.earn.vesting.tab-title'),
            disabled: false,
        });
        tabs.push({
            id: 'lp-staking',
            name: t('options.earn.lp-staking.tab-title'),
            disabled: false,
        });
        tabs.push({
            id: 'migrated-rewards',
            name: t('migration.migrated-rewards-title'),
            disabled: false,
        });
    } else {
        tabs.unshift({
            id: 'retro-rewards',
            name: t('options.earn.snx-stakers.tab-title'),
            disabled: false,
        });
        tabs.unshift({
            id: 'migration',
            name: t('migration.title'),
            disabled: false,
        });
        tabs.push({
            id: 'vesting',
            name: t('options.earn.vesting.tab-title'),
            disabled: false,
        });
        tabs.push({
            id: 'lp-staking',
            name: t('options.earn.lp-staking.tab-title'),
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

    const optionsTabContent: Array<{
        id: string;
        name: string;
        disabled: boolean;
    }> = useMemo(() => tabs, [t, isL2]);

    useEffect(() => {
        const paramTab = queryString.parse(location.search).tab;
        const isTabAvailable = paramTab !== null && tabIds.includes(paramTab) && isTabEnabled(paramTab);
        setSelectedTab(isTabAvailable ? paramTab : defaultTab);
    }, [location, isL2]);

    return (
        <>
            <Container>
                <FlexDivColumn>
                    <TokenOverview />
                    {!isL2 && selectedTab !== 'migration' && <MigrationNotice />}
                    {isL2 && (
                        <Notice>
                            <MigrateText>{t('options.earn.snx-stakers.olympus-notice')}</MigrateText>
                            <FlexDivCentered>
                                <MigrateButton
                                    onClick={() =>
                                        window.open('https://pro.olympusdao.finance/#/partners/Thales', '_blank')
                                    }
                                >
                                    {t('options.earn.snx-stakers.olympus-button-text')}
                                </MigrateButton>
                            </FlexDivCentered>
                        </Notice>
                    )}
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
                                    showFourTabs={isL2}
                                    onClick={() => {
                                        if (tab.disabled) return;
                                        history.push({
                                            pathname: location.pathname,
                                            search: queryString.stringify({
                                                tab: tab.id,
                                            }),
                                        });
                                        setSelectedTab(tab.id);
                                    }}
                                    className={`${tab.id === selectedTab ? 'selected' : ''} ${
                                        tab.disabled ? 'disabled' : ''
                                    }`}
                                >
                                    <InnerOptionsTab paddingLeft={tab.disabled ? 40 : 0}>
                                        {`${tab.name} ${
                                            tab.disabled ? `(${t('common.coming-soon').toLowerCase()})` : ''
                                        }`}
                                    </InnerOptionsTab>
                                </OptionsTab>
                            ))}
                        </OptionsTabContainer>
                        <WidgetsContainer>
                            <InnerWidgetsContainer>
                                {selectedTab === 'staking' && <ThalesStaking />}
                                {selectedTab === 'retro-rewards' && <SnxStaking />}
                                {selectedTab === 'vesting' && <Vesting />}
                                {selectedTab === 'lp-staking' && (isL2 ? <LPStakingL2 /> : <LPStaking />)}
                                {selectedTab === 'migration' && !isL2 && <Migration />}
                                {selectedTab === 'migrated-rewards' && isL2 && <MigratedRewards />}
                            </InnerWidgetsContainer>
                        </WidgetsContainer>
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

const OptionsTabContainer = styled.div`
    height: 44px;
    position: relative;
    width: 95%;
    margin: auto;
    @media (max-width: 767px) {
        display: none;
    }
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number; showFourTabs: boolean }>`
    position: absolute;
    top: 0;
    left: ${(props) => props.index * (props.showFourTabs ? 24.5 : 19.5)}%;
    background: linear-gradient(190.01deg, rgba(81, 106, 255, 0.6) -17.89%, rgba(130, 8, 252, 0.6) 90.41%);
    width: ${(props) => (props.showFourTabs ? 26 : 22)}%;
    z-index: ${(props) => (props.isActive ? 5 : 4 - props.index)};
    transition: 0.5s;
    transition-property: color;
    height: 44px;
    border-radius: 10px 10px 0 0;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.25px;
    text-align: center;
    color: #748bc6;
    padding-top: 1px;
    padding-left: 1px;
    padding-right: 1px;
    user-select: none;
    &.selected:not(.disabled) {
        background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
        transition: 0.2s;
        color: #f6f6fe;
        transform: scale(1.1) translateY(-1px) translateX(${(props) => (props.showFourTabs ? -1 : 0)}px);
        div {
            background: #04045a;
        }
    }
    &:hover:not(.selected):not(.disabled) {
        cursor: pointer;
        color: #00f9ff;
    }
    img {
        margin-left: 10px;
        margin-bottom: 5px;
    }
    &.disabled {
        color: rgb(116, 139, 198, 0.4);
        background: linear-gradient(90deg, #141874, #10126c);
    }
`;

const InnerOptionsTab = styled(FlexDivCentered)<{ paddingLeft: number }>`
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border-radius: 10px 10px 0 0;
    width: 100%;
    height: 100%;
    padding-left: ${(props) => props.paddingLeft}px;
`;

const WidgetsContainer = styled(FlexDivCentered)`
    position: relative;
    padding: 1px;
    border-radius: 10px;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    z-index: 0;
    @media (max-width: 767px) {
        background: transparent;
        border: none;
        padding: 0;
    }
`;

const InnerWidgetsContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 20px;
    padding: 20px;
    border-radius: 10px;
    background: #04045a;
    z-index: 0;
    width: 100%;
    @media (max-width: 767px) {
        background: transparent;
        border: none;
        padding: 1px;
    }
`;

export default TokenPage;
