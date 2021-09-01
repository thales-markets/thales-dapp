import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Background, FlexDivColumn, Text } from '../../../theme/common';
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
                    <EarnTitle className="pale-grey">Earn</EarnTitle>
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
    overflow: hidden;
`;

const OptionsTabContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    position: relative;
    margin-bottom: 20px;
`;

const OptionsTab = styled.button<{ isActive: boolean; index: number }>`
    border: 2px solid transparent;
    border-radius: 50px;
    min-height: 32px;
    background-color: transparent;
    cursor: pointer;
    margin-left: 10px;
    font-weight: bold;
    font-size: 18px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    margin: 0 9px;
    padding: 6px 16px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        border: 2px solid #0a2e66;
        color: #b8c6e5;
    }
    &.selected {
        background: #0a2e66;
        border: 2px solid #00f9ff;
        color: #00f9ff;
    }
    &.selected:hover {
        background: rgba(1, 38, 81, 0.8);
        border: 2px solid #00f9ff;
        color: #b8c6e5;
    }
`;

const WidgetsContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-gap: 20px;
    padding: 10px;
`;

const EarnTitle = styled(Text)`
    font-size: 39px;
    padding: 30px;
`;

export default EarnPage;
