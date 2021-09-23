import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Background, FlexDivCentered, FlexDivColumn, FlexDivRowCentered, Image } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import ThalesStaking from './ThalesStaking';
import SnxStaking from './SnxStaking';
import Vesting from './Vesting';
import LPStaking from './LPStaking';
import { useLocation } from 'react-router-dom';
import { history } from 'utils/routes';
import queryString from 'query-string';
import TokenOverview from './components/TokenOverview';
import snxStakingActiveIcon from '../../../assets/images/snx-staking-active.png';
import snxStakingIcon from '../../../assets/images/snx-staking.png';
import stakingActiveIcon from '../../../assets/images/staking-active.svg';
import stakingIcon from '../../../assets/images/staking.svg';
import lpActiveIcon from '../../../assets/images/lp-active.svg';
import lpIcon from '../../../assets/images/lp.svg';
import vestingActiveIcon from '../../../assets/images/vesting-active.svg';
import vestingIcon from '../../../assets/images/vesting.svg';

const EarnPage: React.FC = () => {
    const { t } = useTranslation();
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
        {
            id: 'lp-staking',
            name: t('options.earn.lp-staking.tab-title'),
            disabled: false,
        },
    ];
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
    }> = useMemo(() => tabs, [t]);

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%', overflowX: 'hidden' }}>
            <Container>
                <FlexDivColumn className="earn">
                    <MarketHeader route={ROUTES.Options.Token} />
                </FlexDivColumn>
            </Container>
            <Container>
                <FlexDivColumn>
                    <TokenOverview />
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
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
                                    {`${tab.name} ${tab.disabled ? `(${t('common.coming-soon').toLowerCase()})` : ''}`}
                                </OptionsTab>
                            ))}
                        </OptionsTabContainer>
                        <WidgetsContainer>
                            {selectedTab === 'retro-rewards' && <SnxStaking />}
                            {selectedTab === 'staking' && <ThalesStaking />}
                            {selectedTab === 'vesting' && <Vesting />}
                            {selectedTab === 'lp-staking' && <LPStaking />}
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
                    width={50}
                    height={30}
                    onClick={() => {
                        history.push({
                            pathname: location.pathname,
                            search: queryString.stringify({
                                tab: 'lp-staking',
                            }),
                        });
                        setSelectedTab('lp-staking');
                    }}
                    src={selectedTab === 'lp-staking' ? lpActiveIcon : lpIcon}
                />
            </NavFooter>
        </Background>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    padding-left: 120px;
    padding-right: 30px;
    @media (max-width: 1024px) {
        flex-direction: column;
        width: 100%;
        padding-left: 15px;
        padding-right: 15px;
    }
`;

const MainContentContainer = styled.div`
    padding-top: 5px;
    overflow: hidden;
    @media (max-width: 767px) {
        padding-bottom: 88px;
    }
`;

const OptionsTabContainer = styled.div`
    height: 50px;
    position: relative;
    width: 95%;
    margin: auto;
    @media (max-width: 767px) {
        display: none;
    }
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    position: absolute;
    top: 0;
    left: ${(props) => props.index * 24.5 + '% '};
    background: linear-gradient(90deg, #141874, #04045a);
    width: 26%;
    z-index: ${(props) => (props.isActive ? 5 : 4 - props.index)};
    transition: 0.5s;
    transition-property: color;
    height: 50px;
    border-radius: 15px 15px 0 0;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.15px;
    color: rgb(116, 139, 198);
    border-left: 1px solid rgba(116, 139, 198, 0.5);
    border-right: 1px solid rgba(116, 139, 198, 0.5);
    border-top: 1px solid rgba(116, 139, 198, 0.5);
    user-select: none;
    &.selected:not(.disabled) {
        background: #121776;
        transition: 0.2s;
        color: #f6f6fe;
        transform: scale(1.1) translateY(-1px);
        border-top: 1px solid rgba(202, 145, 220, 0.2);
        border-left: 1px solid rgba(202, 145, 220, 0.2);
        border-right: 1px solid rgba(202, 145, 220, 0.2);
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
        border-left: 1px solid rgba(116, 139, 198, 0.1);
        border-right: 1px solid rgba(116, 139, 198, 0.1);
        border-top: 1px solid rgba(116, 139, 198, 0.1);
        background: linear-gradient(90deg, #141874, #10126c);
    }
`;

const WidgetsContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 20px;
    padding: 20px;
    border: 1px solid rgba(202, 145, 220, 0.2);
    border-radius: 15px;
    background: #121776;
    z-index: 0;
    @media (max-width: 767px) {
        border: none;
        padding: 5px;
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
    padding: 0 65px;
    z-index: 1000;
`;

const Icon = styled(Image)<{ width: number; height: number }>`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
`;

export default EarnPage;
