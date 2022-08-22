import React, { useState } from 'react';
import styled from 'styled-components';

import Rewards from 'pages/Token/GamifiedStaking/Rewards';
import Staking from 'pages/Token/GamifiedStaking/Staking';
import Vesting from 'pages/Token/GamifiedStaking/Vesting';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import { TokenTabEnum } from 'types/token';

const GRID_GAP = 20;

const Tab: React.FC<{
    selectedTab: string;
    setSelectedTab: (tabId: string) => void;
}> = ({ selectedTab, setSelectedTab }) => {
    const { t } = useTranslation();

    const sections = [
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: 'staking',
            title: t('options.earn.gamified-staking.staking.section-title'),
            description: t('options.earn.gamified-staking.staking.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: 'rewards',
            title: t('options.earn.gamified-staking.rewards.section-title'),
            description: t('options.earn.gamified-staking.rewards.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: 'vesting',
            title: t('options.earn.gamified-staking.vesting.section-title'),
            description: t('options.earn.gamified-staking.vesting.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.LP_STAKING,
            id: 'lp-staking',
            title: t('options.earn.lp-staking.section-title'),
            description: '',
            isButton: false,
        },
    ];

    const [activeButton, setActiveButton] = useState(sections[0].id);

    return (
        <Container>
            {selectedTab === TokenTabEnum.GAMIFIED_STAKING && (
                <>
                    <SectionRow>
                        <SectionHeader>{sections.find((el) => el.id === activeButton)?.title}</SectionHeader>
                        <SectionButtons>
                            {sections
                                .filter((el) => el.isButton)
                                .map((el, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            width={'48%'}
                                            height={'32px'}
                                            active={activeButton == el.id}
                                            padding={'5px 40px'}
                                            margin={'0 20px'}
                                            fontSize={'15px'}
                                            onClickHandler={() => setActiveButton(el.id)}
                                        >
                                            {el.title}
                                        </Button>
                                    );
                                })}
                        </SectionButtons>
                    </SectionRow>
                    <SectionRow>
                        <SectionDescription>
                            {sections.find((el) => el.id === activeButton)?.description}
                        </SectionDescription>
                    </SectionRow>
                    <SectionContent>
                        {activeButton === 'staking' && <Staking />}
                        {activeButton === 'rewards' && <Rewards gridGap={GRID_GAP} setSelectedTab={setSelectedTab} />}
                        {activeButton === 'vesting' && <Vesting />}
                    </SectionContent>
                </>
            )}
            {selectedTab === TokenTabEnum.LP_STAKING && (
                <>
                    <SectionRow>
                        <SectionHeader>{sections.find((el) => el.tab === selectedTab)?.title}</SectionHeader>
                    </SectionRow>
                    <SectionContent></SectionContent>
                </>
            )}
        </Container>
    );
};

const Container = styled.div`
    margin-top: 10px;
`;

const SectionRow = styled.div`
    display: flex;
`;

const SectionHeader = styled.p`
    height: 67px;
    padding-top: 20px;
    font-family: Roboto;
    font-weight: 600;
    font-size: 35px;
    line-height: 35px;
    color: #ffffff;
`;

const SectionDescription = styled.p`
    font-family: Roboto;
    font-weight: 400;
    font-size: 15px;
    line-height: 36px;
    color: #ffffff;
`;

const SectionButtons = styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 20px;
`;

const SectionContent = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: ${GRID_GAP}px;
    padding: 20px 0;
    border-radius: 10px;
    background: #04045a;
    z-index: 0;
    width: 100%;
    color: #ffffff;
    margin-bottom: 60px;
    @media (max-width: 767px) {
        background: transparent;
        border: none;
        padding: 1px;
    }
`;

export default Tab;
