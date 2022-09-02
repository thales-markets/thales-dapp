import { Tip49Link } from 'pages/Token/components';
import Rewards from 'pages/Token/GamifiedStaking/Rewards';
import Staking from 'pages/Token/GamifiedStaking/Staking';
import Vesting from 'pages/Token/GamifiedStaking/Vesting';
import LpStaking from 'pages/Token/LpStaking2';
import MergeAccount from 'pages/Token/MergeAccount';
import Migration from 'pages/Token/Migration';
import SnxStaking from 'pages/Token/SnxStaking';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { TokenTabEnum } from 'types/token';
import { getIsOVM } from 'utils/network';
import Button from '../Button';
import { ButtonType } from '../Button/Button';
import MigrationInfo from '../MigrationInfo';

const GRID_GAP = 20;

enum SectionIdEnum {
    STAKING = 'staking',
    REWARDS = 'rewards',
    VESTING = 'vesting',
    MERGE_ACCOUNT = 'merge-account',
    LP_STAKING = 'lp-staking',
}

const Tab: React.FC<{
    selectedTab: string;
    setSelectedTab: (tabId: string) => void;
}> = ({ selectedTab, setSelectedTab }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const sections = [
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: SectionIdEnum.STAKING,
            title: t('options.earn.gamified-staking.staking.section-title'),
            description: t('options.earn.gamified-staking.staking.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: SectionIdEnum.REWARDS,
            title: t('options.earn.gamified-staking.rewards.section-title'),
            description: t('options.earn.gamified-staking.rewards.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: SectionIdEnum.VESTING,
            title: t('options.earn.gamified-staking.vesting.section-title'),
            description: t('options.earn.gamified-staking.vesting.section-description'),
            isButton: true,
        },
        {
            tab: TokenTabEnum.GAMIFIED_STAKING,
            id: SectionIdEnum.MERGE_ACCOUNT,
            title: t('options.earn.gamified-staking.merge-account.section-title'),
            description: (
                <Trans
                    i18nKey={`options.earn.gamified-staking.merge-account.section-description`}
                    components={[<span key="1" />, <Tip49Link key="2" />]}
                />
            ),
            isButton: true,
        },
        {
            tab: TokenTabEnum.LP_STAKING,
            id: SectionIdEnum.LP_STAKING,
            title: t('options.earn.lp-staking.section-title'),
            description: '',
            isButton: false,
        },
    ];

    const [activeButtonId, setActiveButtonId] = useState(sections[0].id);

    return (
        <Container>
            {selectedTab === TokenTabEnum.MIGRATION && <Migration />}
            {isL2 && selectedTab === TokenTabEnum.GAMIFIED_STAKING && (
                <>
                    <SectionRow>
                        <SectionHeader>{sections.find((el) => el.id === activeButtonId)?.title}</SectionHeader>
                        <SectionButtons>
                            {sections
                                .filter((el) => el.isButton)
                                .map((el, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            type={ButtonType.default}
                                            active={activeButtonId == el.id}
                                            width={'170px'}
                                            margin={'0 20px 0 0'}
                                            padding={'5px 20px'}
                                            onClickHandler={() => setActiveButtonId(el.id)}
                                        >
                                            {el.title}
                                        </Button>
                                    );
                                })}
                        </SectionButtons>
                    </SectionRow>
                    <SectionRow>
                        <SectionDescription>
                            {sections.find((el) => el.id === activeButtonId)?.description}
                        </SectionDescription>
                    </SectionRow>
                    <SectionContent>
                        {activeButtonId === SectionIdEnum.STAKING && <Staking />}
                        {activeButtonId === SectionIdEnum.REWARDS && (
                            <Rewards gridGap={GRID_GAP} setSelectedTab={setSelectedTab} />
                        )}
                        {activeButtonId === SectionIdEnum.VESTING && <Vesting />}
                        {activeButtonId === SectionIdEnum.MERGE_ACCOUNT && isL2 && <MergeAccount />}
                    </SectionContent>
                </>
            )}
            {!isL2 && selectedTab === TokenTabEnum.GAMIFIED_STAKING && <MigrationInfo messageKey="staking" />}
            {isL2 && selectedTab === TokenTabEnum.LP_STAKING && (
                <>
                    <SectionRow>
                        <SectionHeader>{sections.find((el) => el.tab === selectedTab)?.title}</SectionHeader>
                    </SectionRow>
                    <SectionContent>
                        <LpStaking />
                    </SectionContent>
                </>
            )}
            {!isL2 && selectedTab === TokenTabEnum.LP_STAKING && (
                <MigrationInfo messageKey="lp-staking" tipNumber={23} />
            )}
            {selectedTab === TokenTabEnum.STRATEGIC_INVESTORS && <SnxStaking />}
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
    font-size: 16px;
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
