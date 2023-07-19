import Button from 'components/Button';
import { STYLE_GRID_GAP, STYLE_GRID_GAP_MOBILE } from 'constants/token';
import { TokenTabEnum, TokenTabSectionIdEnum } from 'enums/token';
import { ScreenSizeBreakpoint } from 'enums/ui';
import MergeAccount from 'pages/Token/GamifiedStaking/MergeAccount';
// import Rewards from 'pages/Token/GamifiedStaking/Rewards';
import Staking from 'pages/Token/GamifiedStaking/Staking';
import Vesting from 'pages/Token/GamifiedStaking/Vesting';
import LpStaking from 'pages/Token/LpStaking';
import Migration from 'pages/Token/Migration';
import SnxStaking from 'pages/Token/SnxStaking';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { TokenTabSection } from 'types/token';
import { ThemeInterface } from 'types/ui';
import { getIsArbitrum, getIsOVM } from 'utils/network';
import { history } from 'utils/routes';
import MigrationInfo from '../MigrationInfo';
import Rewards from 'pages/Token/GamifiedStaking/RewardsV2/Rewards';
import StakingLeaderboard from 'pages/Token/GamifiedStaking/StakingLeaderboard/StakingLeaderboard';

const Tab: React.FC<{
    selectedTab: string;
    setSelectedTab: (tabId: string) => void;
    sections: TokenTabSection[];
    selectedSection?: TokenTabSectionIdEnum;
}> = ({ selectedTab, sections, selectedSection }) => {
    const theme: ThemeInterface = useTheme();
    const location = useLocation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const isArb = getIsArbitrum(networkId);

    const [activeButtonId, setActiveButtonId] = useState(selectedSection || sections[0].id);

    useEffect(() => {
        setActiveButtonId(selectedSection || sections[0].id);
    }, [selectedSection]);

    return (
        <Container>
            {(isArb || isL2) && selectedTab === TokenTabEnum.GAMIFIED_STAKING && (
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
                                            textColor={theme.button.textColor.secondary}
                                            backgroundColor={
                                                activeButtonId == el.id
                                                    ? theme.button.background.tertiary
                                                    : theme.button.background.secondary
                                            }
                                            borderColor={theme.button.borderColor.tertiary}
                                            width=""
                                            margin={'0 10px 0 0'}
                                            padding={'7px 17px'}
                                            fontSize="15px"
                                            additionalStyles={{ whiteSpace: 'nowrap', borderRadius: '8px' }}
                                            onClick={() => {
                                                const paramTab = queryString.parse(location.search).tab;
                                                history.push({
                                                    pathname: location.pathname,
                                                    search: queryString.stringify({
                                                        tab: paramTab,
                                                        activeButtonId: el.id,
                                                    }),
                                                });
                                                setActiveButtonId(el.id);
                                            }}
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
                    {sections.find((el) => el.id === activeButtonId)?.warning && (
                        <SectionRow>
                            <WarningIcon className="icon icon--warning" />
                            <SectionWarning>{sections.find((el) => el.id === activeButtonId)?.warning}</SectionWarning>
                        </SectionRow>
                    )}
                    {activeButtonId == TokenTabSectionIdEnum.LEADERBOARD && <StakingLeaderboard />}
                    {activeButtonId === TokenTabSectionIdEnum.REWARDS ? (
                        <Rewards />
                    ) : (
                        <SectionContent>
                            {activeButtonId === TokenTabSectionIdEnum.STAKING && <Staking />}

                            {activeButtonId === TokenTabSectionIdEnum.VESTING && <Vesting />}
                            {activeButtonId === TokenTabSectionIdEnum.MERGE_ACCOUNT && <MergeAccount />}
                        </SectionContent>
                    )}
                </>
            )}
            {!isL2 && !isArb && selectedTab === TokenTabEnum.GAMIFIED_STAKING && <MigrationInfo messageKey="staking" />}
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
            {selectedTab === TokenTabEnum.MIGRATION && <Migration />}
            {selectedTab === TokenTabEnum.STRATEGIC_INVESTORS && <SnxStaking />}
        </Container>
    );
};

const Container = styled.div`
    margin-top: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 0;
    }
`;

const SectionRow = styled.div`
    display: flex;
`;

const SectionHeader = styled.p`
    height: 50px;
    padding-top: 7px;
    font-weight: 600;
    font-size: 32px;
    line-height: 35px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: 1192px) {
        height: 40px;
        font-size: 25px;
        line-height: 25px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: auto;
        padding-top: 0;
        padding-bottom: 10px;
        font-size: 25px;
        line-height: 25px;
    }
`;

const SectionDescription = styled.p`
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    padding-top: 5px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 15px;
        line-height: 20px;
        padding-bottom: 10px;
    }
`;

const WarningIcon = styled.i`
    font-weight: 400;
    font-size: 18px;
    margin-right: 4px;
    line-height: 18px;
    padding-top: 5px;
    color: ${(props) => props.theme.textColor.tertiary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 15px;
        line-height: 20px;
        padding-bottom: 10px;
    }
`;

const SectionWarning = styled.p`
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    padding-top: 5px;
    color: ${(props) => props.theme.textColor.tertiary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 15px;
        line-height: 20px;
        padding-bottom: 10px;
    }
`;

const SectionButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: auto;
    margin-bottom: 10px;
    margin-top: 10px;
    height: 30px;
    @media (max-width: 1192px) {
        margin-bottom: 0;
        margin-top: 5px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const SectionContent = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: ${STYLE_GRID_GAP}px;
    padding: 10px 0;
    border-radius: 10px;
    background: ${(props) => props.theme.background.primary};
    z-index: 0;
    width: 100%;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        background: transparent;
        border: none;
        padding: 1px;
        grid-gap: ${STYLE_GRID_GAP_MOBILE}px;
        margin-bottom: 0;
    }
`;

export default Tab;
