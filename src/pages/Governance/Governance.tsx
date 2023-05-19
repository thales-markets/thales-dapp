import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { navigateToGovernance } from 'utils/routes';
import { FlexDivCentered, FlexDivColumn, FlexDiv, FlexDivRow } from 'theme/common';
import { SNAPSHOT_GRAPHQL_URL, SpaceKey, StatusEnum } from 'constants/governance';
import ProposalList from './ProposalList';
import ProposalDetails from './ProposalDetails';
import { Proposal } from 'types/governance';
import CouncilMembers from './CouncilMembers';
import { RouteComponentProps } from 'react-router-dom';
import request, { gql } from 'graphql-request';
import { ReactComponent as ArrowBackIcon } from 'assets/images/arrow-back.svg';
import StatusDropdown from './components/StatusDropdown';
import SidebarDetails from './ProposalDetails/SidebarDetails';
import ThalesStakers from './ThalesStakers';
import TabDropdown from './components/TabDropdown';
import OpRewardsBanner from 'components/OpRewardsBanner';
import { getIsOVM } from 'utils/network';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import Footer from 'components/Footer';
import ElectionsBanner from 'components/ElectionsBanner';

type GovernancePageProps = RouteComponentProps<{
    space: string;
    id: string;
}>;

const GovernancePage: React.FC<GovernancePageProps> = (props) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const { t } = useTranslation();
    const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>(undefined);
    const [selectedTab, setSelectedTab] = useState<SpaceKey>(SpaceKey.TIPS);
    const [statusFilter, setStatusFilter] = useState<StatusEnum>(StatusEnum.All);
    const [isMobile, setIsMobile] = useState(false);

    const showOPBanner = getIsOVM(networkId);

    const fetchPreloadedProposal = useCallback(() => {
        const fetch = async () => {
            const { params } = props.match;
            const { proposal }: { proposal: Proposal } = await request(
                SNAPSHOT_GRAPHQL_URL,
                gql`
                    query Proposals($id: String) {
                        proposal(id: $id) {
                            id
                            title
                            body
                            choices
                            start
                            end
                            snapshot
                            state
                            author
                            type
                            scores
                            space {
                                id
                                name
                                symbol
                                network
                            }
                            strategies {
                                name
                                params
                            }
                        }
                    }
                `,
                { id: params.id }
            );
            setSelectedProposal(proposal);
            if (!proposal) {
                setSelectedTab(params.space as SpaceKey);
            }
        };
        fetch();
    }, [props.match]);

    useEffect(() => {
        const { params } = props.match;

        if (
            params &&
            params.space &&
            (params.space === SpaceKey.TIPS ||
                params.space === SpaceKey.COUNCIL ||
                params.space === SpaceKey.THALES_STAKERS)
        ) {
            if (params.id) {
                fetchPreloadedProposal();
            } else {
                setSelectedTab(params.space as SpaceKey);
                setSelectedProposal(undefined);
            }
        } else {
            setSelectedTab(SpaceKey.TIPS);
            setSelectedProposal(undefined);
        }
    }, [props.match]);

    const optionsTabContent: Array<{
        id: SpaceKey;
        name: string;
    }> = useMemo(
        () => [
            {
                id: SpaceKey.TIPS,
                name: t(`governance.tabs.${SpaceKey.TIPS}`),
            },
            {
                id: SpaceKey.COUNCIL,
                name: t(`governance.tabs.${SpaceKey.COUNCIL}`),
            },
            {
                id: SpaceKey.THALES_STAKERS,
                name: t(`governance.tabs.${SpaceKey.THALES_STAKERS}`),
            },
        ],
        [t]
    );

    const handleResize = () => {
        if (window.innerWidth <= 767) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isOverviewPage = !selectedProposal;

    return (
        <>
            {showOPBanner && <OpRewardsBanner />}
            <ElectionsBanner />
            <BackLinkWrapper isOverviewPage={isOverviewPage}>
                {selectedProposal && (
                    <BackLink
                        onClick={() => {
                            setSelectedProposal(undefined);
                            navigateToGovernance(selectedProposal.space.id);
                        }}
                    >
                        <ArrowIcon />
                        {t(`governance.back-to-proposals`)}
                    </BackLink>
                )}
            </BackLinkWrapper>
            <Container id="proposal-details">
                <MainContentContainer isOverviewPage={isOverviewPage}>
                    <MainContentWrapper isOverviewPage={isOverviewPage}>
                        {!selectedProposal && (
                            <>
                                <OptionsTabWrapper>
                                    {isMobile ? (
                                        <TabDropdown activeTab={selectedTab} onSelect={setSelectedTab} />
                                    ) : (
                                        <OptionsTabContainer>
                                            {optionsTabContent.map((tab, index) => (
                                                <OptionsTab
                                                    isActive={tab.id === selectedTab}
                                                    key={index}
                                                    index={index}
                                                    onClick={() => {
                                                        navigateToGovernance(tab.id);
                                                        setSelectedTab(tab.id);
                                                    }}
                                                    className={`${tab.id === selectedTab ? 'selected' : ''}`}
                                                >
                                                    {tab.name}
                                                </OptionsTab>
                                            ))}
                                        </OptionsTabContainer>
                                    )}
                                    {selectedTab !== SpaceKey.THALES_STAKERS && (
                                        <StatusDropdown activeStatus={statusFilter} onSelect={setStatusFilter} />
                                    )}
                                </OptionsTabWrapper>
                                {selectedTab === SpaceKey.TIPS && (
                                    <ProposalList
                                        spaceKey={SpaceKey.TIPS}
                                        onItemClick={setSelectedProposal}
                                        statusFilter={statusFilter}
                                        resetFilters={() => setStatusFilter(StatusEnum.All)}
                                    />
                                )}
                                {selectedTab === SpaceKey.COUNCIL && (
                                    <ProposalList
                                        spaceKey={SpaceKey.COUNCIL}
                                        onItemClick={setSelectedProposal}
                                        statusFilter={statusFilter}
                                        resetFilters={() => setStatusFilter(StatusEnum.All)}
                                    />
                                )}
                                {selectedTab === SpaceKey.THALES_STAKERS && <ThalesStakers />}
                            </>
                        )}
                        {selectedProposal && <ProposalDetails proposal={selectedProposal} />}
                    </MainContentWrapper>
                </MainContentContainer>
                {!selectedProposal && (
                    <SidebarContainer>
                        <SidebarWrapper>
                            <Sidebar>
                                <CouncilMembers />
                            </Sidebar>
                        </SidebarWrapper>
                    </SidebarContainer>
                )}
                {selectedProposal && (
                    <SidebarContainer>
                        {selectedProposal.space.id === SpaceKey.TIPS && (
                            <SidebarWrapper>
                                <Sidebar>
                                    <SidebarDetails proposal={selectedProposal} type="approval-box" />
                                </Sidebar>
                            </SidebarWrapper>
                        )}
                        <SidebarWrapper>
                            <Sidebar>
                                <SidebarDetails proposal={selectedProposal} type="results" />
                            </Sidebar>
                        </SidebarWrapper>
                        <SidebarWrapper>
                            <Sidebar>
                                <SidebarDetails proposal={selectedProposal} type="history" />
                            </Sidebar>
                        </SidebarWrapper>
                    </SidebarContainer>
                )}
            </Container>
            <Footer />
        </>
    );
};

const Container = styled(FlexDivRow)`
    width: 100%;
    @media (max-width: 1200px) {
        flex-direction: column;
    }
`;

const MainContentContainer = styled.div<{ isOverviewPage: boolean }>`
    background: ${(props) => (props.isOverviewPage ? 'transparent' : props.theme.background.secondary)};
    width: 66%;
    padding: 2px;
    border-radius: 15px;
    height: 100%;
    @media (max-width: 1200px) {
        width: 100%;
    }
    @media (max-width: 767px) {
        border: none;
        background: ${(props) => (props.isOverviewPage ? 'transparent' : props.theme.background.secondary)};
    }
`;

const MainContentWrapper = styled.div<{ isOverviewPage: boolean }>`
    border-radius: 15px;
    padding: ${(props) => (props.isOverviewPage ? '0px' : '25px 0px 30px 0px')};
    background: ${(props) => props.theme.background.primary};
    @media (max-width: 767px) {
        background: ${(props) => (props.isOverviewPage ? 'transparent' : props.theme.background.primary)};
        padding: ${(props) => (props.isOverviewPage ? '0px 0px 10px 0px' : '25px 0px 30px 0px')};
    }
`;

const SidebarContainer = styled(FlexDivColumn)`
    width: 33%;
    margin-left: 10px;
    @media (max-width: 1200px) {
        width: 100%;
        margin-left: 0;
    }
`;

const SidebarWrapper = styled.div`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 15px;
    padding: 2px;
    margin-bottom: 20px;
    &:first-child {
        @media (max-width: 1200px) {
            margin-top: 20px;
        }
    }
`;

const Sidebar = styled.div`
    background: ${(props) => props.theme.background.primary};
    border-radius: 15px;
    padding: 15px 0px 0px 0px;
`;

const OptionsTabWrapper = styled(FlexDivRow)`
    padding: 0 30px;
    @media (max-width: 767px) {
        flex-direction: column;
        padding: 0;
    }
`;

const OptionsTabContainer = styled(FlexDiv)`
    height: 40px;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 48px;
    color: ${(props) => props.theme.textColor.primary};
    user-select: none;
    border-bottom: 5px solid ${(props) => props.theme.background.primary};
    margin-left: 25px;
    margin-right: 25px;
    &.selected {
        transition: 0.2s;
        color: ${(props) => props.theme.textColor.primary};
        border-bottom: 5px solid ${(props) => props.theme.borderColor.quaternary};
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: ${(props) => props.theme.textColor.quaternary};
    }
`;

const BackLinkWrapper = styled(FlexDiv)<{ isOverviewPage: boolean }>`
    height: 20px;
    align-self: start;
    margin-bottom: 10px;
    @media (max-width: 767px) {
        height: ${(props) => (props.isOverviewPage ? '0' : '20px')};
    }
`;

const BackLink = styled(FlexDivCentered)`
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.link.textColor.secondary};
    &path {
        fill: ${(props) => props.theme.link.textColor.secondary};
    }
    &:hover {
        cursor: pointer;
        color: ${(props) => props.theme.link.textColor.primary};
        & path {
            fill: ${(props) => props.theme.link.textColor.primary};
        }
    }
`;

const ArrowIcon = styled(ArrowBackIcon)`
    height: 16px;
    width: 18px;
    margin-right: 4px;
    margin-left: 4px;
`;

export default GovernancePage;
