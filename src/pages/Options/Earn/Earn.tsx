import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Background, FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivRowCentered } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import ThalesStaking from './ThalesStaking';
import SnxStaking from './SnxStaking';

const EarnPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState('snx-stakers');

    const optionsTabContent: Array<{
        id: string;
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'snx-stakers',
                name: t('options.earn.snx-stakers.tab-title'),
            },
            {
                id: 'thales-staking',
                name: t('options.earn.thales-staking.tab-title'),
            },
            {
                id: 'vesting',
                name: t('options.earn.vesting.tab-title'),
            },
            {
                id: 'lp-staking',
                name: t('options.earn.lp-staking.tab-title'),
            },
            {
                id: 'thales-airdrop',
                name: t('options.earn.thales-airdrop.tab-title'),
            },
        ],
        [t]
    );

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <Container>
                <FlexDivColumn className="earn">
                    <MarketHeader route={ROUTES.Options.Earn} />
                </FlexDivColumn>
            </Container>
            <Container>
                <MainContent>
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={tab.id === selectedTab ? 'selected' : ''}
                                >
                                    {tab.name}
                                </OptionsTab>
                            ))}
                        </OptionsTabContainer>
                        <WidgetsContainer>
                            {selectedTab === 'snx-stakers' && <SnxStaking />}
                            {selectedTab === 'thales-staking' && <ThalesStaking />}
                        </WidgetsContainer>
                    </MainContentContainer>
                </MainContent>
            </Container>
        </Background>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
    }
`;

const MainContent = styled(FlexDivColumn)`
    padding: 20px 108px;
`;

const MainContentContainer = styled.div`
    border: 1px solid #0a2e66;
    border-radius: 15px;
    overflow: hidden;
`;

const OptionsTabContainer = styled.div`
    height: 75px;
    position: relative;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    position: absolute;
    top: 0;
    left: ${(props) => props.index * 20 + '% '};
    background-color: transparent;
    width: 20%;
    z-index: ${(props) => (props.isActive ? props.index + 1 : 0)};
    transition: 0.5s;
    transition-property: color;
    height: 75px;
    border-radius: 15px 15px 0px 0px;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.15px;
    color: #b8c6e5;
    padding-bottom: 15px;
    border-left: 1px solid #0a2e66;
    border-right: 1px solid #0a2e66;
    &.selected {
        background-color: #0a2e66;
        transition: 0.2s;
        color: #f6f6fe;
    }
    &:hover:not(.selected) {
        cursor: pointer;
        border: 1.5px solid #00f9ff;
        color: #00f9ff;
    }
    img {
        margin-left: 10px;
        margin-bottom: 5px;
    }
`;

const WidgetsContainer = styled.div`
    background-color: #0a2e66;
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 10px;
    padding: 10px;
`;

export const EarnSection = styled.section`
    padding-bottom: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #04045a;
    border-radius: 23px;
    overflow: hidden;
    color: white;
    grid-column: span 5;
    margin-bottom: 15px;
`;

export const SectionHeader = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    min-height: 50px;
    border-bottom: 1px solid rgba(228, 228, 228, 0.1);
    padding: 0px 20px 0 30px;
`;

export const SectionContent = styled(FlexDiv)`
    padding: 30px 30px 15px 30px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

export const ClaimDiv = styled(FlexDiv)`
    align-items: center;
`;

export const ClaimTitle = styled.span`
    font-size: 18px;
    padding-right: 5px;
`;

export const ValidationMessageConatiner = styled.div`
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 15px;
`;

export default EarnPage;
