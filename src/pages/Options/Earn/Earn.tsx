import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRowCentered, Image } from '../../../theme/common';

import ThalesStaking from './ThalesStaking';
import SnxStaking from './SnxStaking';
import Vesting from './Vesting';
import LPStaking from './LPStaking';
import LPStakingL2 from './LPStakingL2';
import { useLocation } from 'react-router-dom';
import { history } from 'utils/routes';
import queryString from 'query-string';
import TokenOverview from './components/TokenOverview';
import snxStakingActiveIcon from '../../../assets/images/snx-staking-active.png';
import snxStakingIcon from '../../../assets/images/snx-staking.png';
import stakingActiveIcon from '../../../assets/images/staking-active.svg';
import stakingIcon from '../../../assets/images/staking.svg';
import vestingActiveIcon from '../../../assets/images/vesting-active.svg';
import vestingIcon from '../../../assets/images/vesting.svg';
import lpActiveIcon from '../../../assets/images/lp-active.svg';
import lpIcon from '../../../assets/images/lp.svg';
import lpl2ActiveIcon from '../../../assets/images/lp-l2-active.svg';
import lpl2Icon from '../../../assets/images/lp-l2.svg';
import migrationActiveIcon from '../../../assets/images/migration-active.svg';
import migrationIcon from '../../../assets/images/migration.svg';
import migratedRewardsActiveIcon from '../../../assets/images/migrated-rewards-active.svg';
import migratedRewardsIcon from '../../../assets/images/migrated-rewards.svg';

import { RootState } from '../../../redux/rootReducer';
import { getNetworkId } from '../../../redux/modules/wallet';
import { getIsOVM } from '../../../utils/network';
import Migration from './Migration';
import MigrationNotice from './components/MigrationNotice';
import MigratedRewards from './MigratedRewards';
import { useSelector } from 'react-redux';

const EarnPage: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const tabs = [
        {
            id: 'retro-rewards',
            name: t('options.earn.snx-stakers.tab-title'),
            disabled: false,
        },
        {
            id: 'staking',
            name: t('options.earn.thales-staking.tab-title'),
            disabled: false,
        },
        {
            id: 'vesting',
            name: t('options.earn.vesting.tab-title'),
            disabled: false,
        },
    ];

    if (isL2) {
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
        tabs.push({
            id: 'lp-staking',
            name: t('options.earn.lp-staking.tab-title'),
            disabled: false,
        });
        tabs.push({
            id: 'migration',
            name: t('migration.title'),
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
    const [selectedTab, setSelectedTab] = useState(isTabAvailable ? paramTab : 'retro-rewards');

    const optionsTabContent: Array<{
        id: string;
        name: string;
        disabled: boolean;
    }> = useMemo(() => tabs, [t, isL2]);

    useEffect(() => {
        const paramTab = queryString.parse(location.search).tab;
        const isTabAvailable = paramTab !== null && tabIds.includes(paramTab) && isTabEnabled(paramTab);
        setSelectedTab(isTabAvailable ? paramTab : 'retro-rewards');
    }, [location, isL2]);

    return (
        <>
            <Container>
                <FlexDivColumn>
                    <TokenOverview />
                    {!isL2 && selectedTab !== 'migration' && <MigrationNotice />}
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
                                    showFourTabs={false}
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
                                {selectedTab === 'retro-rewards' && <SnxStaking />}
                                {selectedTab === 'staking' && <ThalesStaking />}
                                {selectedTab === 'vesting' && <Vesting />}
                                {selectedTab === 'lp-staking' && (isL2 ? <LPStakingL2 /> : <LPStaking />)}
                                {selectedTab === 'migration' && !isL2 && <Migration />}
                                {selectedTab === 'migrated-rewards' && isL2 && <MigratedRewards />}
                            </InnerWidgetsContainer>
                        </WidgetsContainer>
                    </MainContentContainer>
                </FlexDivColumn>
            </Container>
            <NavFooter>
                <Icon
                    width={50}
                    height={50}
                    onClick={() => {
                        history.push({
                            pathname: location.pathname,
                            search: queryString.stringify({
                                tab: 'retro-rewards',
                            }),
                        });
                        setSelectedTab('retro-rewards');
                    }}
                    src={selectedTab === 'retro-rewards' ? snxStakingActiveIcon : snxStakingIcon}
                />
                <Icon
                    width={30}
                    height={30}
                    onClick={() => {
                        history.push({
                            pathname: location.pathname,
                            search: queryString.stringify({
                                tab: 'staking',
                            }),
                        });
                        setSelectedTab('staking');
                    }}
                    src={selectedTab === 'staking' ? stakingActiveIcon : stakingIcon}
                />
                <Icon
                    width={30}
                    height={30}
                    onClick={() => {
                        history.push({
                            pathname: location.pathname,
                            search: queryString.stringify({
                                tab: 'vesting',
                            }),
                        });
                        setSelectedTab('vesting');
                    }}
                    src={selectedTab === 'vesting' ? vestingActiveIcon : vestingIcon}
                />
                <Icon
                    width={isL2 ? 35 : 50}
                    height={isL2 ? 35 : 30}
                    onClick={() => {
                        history.push({
                            pathname: location.pathname,
                            search: queryString.stringify({
                                tab: 'lp-staking',
                            }),
                        });
                        setSelectedTab('lp-staking');
                    }}
                    src={
                        selectedTab === 'lp-staking' ? (isL2 ? lpl2ActiveIcon : lpActiveIcon) : isL2 ? lpl2Icon : lpIcon
                    }
                />
                {!isL2 && (
                    <Icon
                        width={35}
                        height={30}
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: 'migration',
                                }),
                            });
                            setSelectedTab('migration');
                        }}
                        src={selectedTab === 'migration' ? migrationActiveIcon : migrationIcon}
                    />
                )}
                {isL2 && (
                    <Icon
                        width={50}
                        height={40}
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: 'migrated-rewards',
                                }),
                            });
                            setSelectedTab('migrated-rewards');
                        }}
                        src={selectedTab === 'migrated-rewards' ? migratedRewardsActiveIcon : migratedRewardsIcon}
                    />
                )}
            </NavFooter>
        </>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
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

const NavFooter = styled(FlexDivRowCentered)`
    @media (min-width: 767px) {
        display: none;
    }
    height: 88px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #04045a;
    border-radius: 20px 20px 0 0;
    border-top: 1px solid #ca91dc;
    width: 100%;
    padding: 0 40px;
    z-index: 1000;
`;

const Icon = styled(Image)<{ width: number; height: number }>`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
`;

export default EarnPage;
