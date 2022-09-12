import Rewards from 'pages/Token/GamifiedStaking/Rewards';
import Staking from 'pages/Token/GamifiedStaking/Staking';
import Vesting from 'pages/Token/GamifiedStaking/Vesting';
import LpStaking from 'pages/Token/LpStaking/LpStaking';
import MergeAccount from 'pages/Token/GamifiedStaking/MergeAccount';
import Migration from 'pages/Token/Migration';
import SnxStaking from 'pages/Token/SnxStaking';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { TokenTabEnum, TokenTabSectionIdEnum, TokenTabSection } from 'types/token';
import { getIsOVM } from 'utils/network';
import Button from '../Button';
import { ButtonType } from '../Button/Button';
import MigrationInfo from '../MigrationInfo';

const Tab: React.FC<{
    selectedTab: string;
    setSelectedTab: (tabId: string) => void;
    sections: TokenTabSection[];
    selectedSection?: TokenTabSectionIdEnum;
}> = ({ selectedTab, setSelectedTab, sections, selectedSection }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const [estimatedRewards, setEstimatedRewards] = useState(0);
    const [activeButtonId, setActiveButtonId] = useState(selectedSection || sections[0].id);

    useEffect(() => {
        setActiveButtonId(selectedSection || sections[0].id);
    }, [selectedSection]);

    return (
        <Container>
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
                                            width={'172px'}
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
                        {activeButtonId === TokenTabSectionIdEnum.STAKING && (
                            <Staking setEstimatedRewards={setEstimatedRewards} />
                        )}
                        {activeButtonId === TokenTabSectionIdEnum.REWARDS && (
                            <Rewards
                                gridGap={GRID_GAP}
                                setSelectedTab={setSelectedTab}
                                estimatedRewards={estimatedRewards}
                            />
                        )}
                        {activeButtonId === TokenTabSectionIdEnum.VESTING && <Vesting />}
                        {activeButtonId === TokenTabSectionIdEnum.MERGE_ACCOUNT && isL2 && <MergeAccount />}
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
            {selectedTab === TokenTabEnum.MIGRATION && <Migration />}
            {selectedTab === TokenTabEnum.STRATEGIC_INVESTORS && <SnxStaking />}
        </Container>
    );
};

export const GRID_GAP = 20;
export const GRID_GAP_MOBILE = 10;

const Container = styled.div`
    margin-top: 10px;
    @media (max-width: 768px) {
        margin-top: 0;
    }
`;

const SectionRow = styled.div`
    display: flex;
`;

const SectionHeader = styled.p`
    height: 50px;
    padding-top: 7px;
    font-family: Roboto;
    font-weight: 600;
    font-size: 32px;
    line-height: 35px;
    color: #ffffff;
    @media (max-width: 1192px) {
        height: 40px;
        font-size: 25px;
        line-height: 25px;
    }
    @media (max-width: 768px) {
        height: auto;
        padding-top: 0;
        padding-bottom: 10px;
        font-size: 25px;
        line-height: 25px;
    }
`;

const SectionDescription = styled.p`
    font-family: Roboto;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    padding-top: 5px;
    color: #ffffff;
    @media (max-width: 768px) {
        font-size: 15px;
        line-height: 20px;
        padding-bottom: 10px;
    }
`;

const SectionButtons = styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
    @media (max-width: 1192px) {
        margin-bottom: 0;
        margin-top: 5px;
    }
    @media (max-width: 768px) {
        display: none;
    }
`;

const SectionContent = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: ${GRID_GAP}px;
    padding: 10px 0;
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
        grid-gap: ${GRID_GAP_MOBILE}px;
    }
`;

export default Tab;
