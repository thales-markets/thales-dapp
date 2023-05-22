import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { navigateToGovernance } from 'utils/routes';
import { SNAPSHOT_GRAPHQL_URL, SpaceKey, StatusEnum } from 'constants/governance';
import ProposalList from './ProposalList';
import ProposalDetails from './ProposalDetails';
import { Proposal } from 'types/governance';
import CouncilMembers from './CouncilMembers';
import { RouteComponentProps } from 'react-router-dom';
import request, { gql } from 'graphql-request';
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
import {
    ArrowIcon,
    BackLink,
    BackLinkWrapper,
    Container,
    MainContentContainer,
    MainContentWrapper,
    OptionsTab,
    OptionsTabContainer,
    OptionsTabWrapper,
    Sidebar,
    SidebarContainer,
    SidebarWrapper,
} from './styled-components';

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

export default GovernancePage;
