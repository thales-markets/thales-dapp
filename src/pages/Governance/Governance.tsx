import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { navigateToGovernance } from 'utils/routes';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { isNetworkSupported } from 'utils/network';
import MarketHeader from 'pages/Options/Home/MarketHeader';
import Loader from 'components/Loader';
import { Background, FlexDivCentered, FlexDivColumn, FlexDiv, Wrapper, FlexDivRow } from 'theme/common';
import { snapshotEndpoint, SpaceKey } from 'constants/governance';
import ProposalList from './ProposalList';
import ProposalDetails from './ProposalDetails';
import History from './ProposalDetails/History';
import Results from './ProposalDetails/Results';
import { Proposal } from 'types/governance';
import CouncilMembers from './CouncilMembers';
import { RouteComponentProps } from 'react-router-dom';
import request, { gql } from 'graphql-request';
import { ReactComponent as ArrowBackIcon } from 'assets/images/arrow-back.svg';

type GovernancePageProps = RouteComponentProps<{
    space: string;
    id: string;
}>;

const GovernancePage: React.FC<GovernancePageProps> = (props) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>(undefined);
    const [selectedTab, setSelectedTab] = useState<SpaceKey>(SpaceKey.TIPS);

    const fetchPreloadedProposal = useCallback(() => {
        const fetch = async () => {
            const { params } = props.match;
            const { proposal }: { proposal: Proposal } = await request(
                snapshotEndpoint,
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
                            space {
                                id
                                name
                                symbol
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

        if (params && params.space && (params.space === SpaceKey.TIPS || params.space === SpaceKey.COUNCIL)) {
            if (params.id) {
                fetchPreloadedProposal();
            } else {
                setSelectedTab(params.space as SpaceKey);
            }
        } else {
            setSelectedTab(SpaceKey.TIPS);
        }
    }, [props.match]);

    const optionsTabContent: Array<{
        id: SpaceKey;
        name: string;
    }> = useMemo(
        () => [
            {
                id: SpaceKey.TIPS,
                name: 'TIPS',
            },
            {
                id: SpaceKey.COUNCIL,
                name: 'Council',
            },
        ],
        [t]
    );

    return (
        <Background>
            <Wrapper>
                {networkId && isNetworkSupported(networkId) ? (
                    <>
                        <MarketHeader route={ROUTES.Governance.Home} />
                        <Title style={{ alignSelf: 'flex-start' }}>Governance</Title>
                        <BackLinkWrapper>
                            {selectedProposal && (
                                <BackLink
                                    onClick={() => {
                                        setSelectedProposal(undefined);
                                        navigateToGovernance(selectedProposal.space.id);
                                    }}
                                >
                                    <ArrowIcon />
                                    Back to proposals overview
                                </BackLink>
                            )}
                        </BackLinkWrapper>
                        <FlexDivRow style={{ width: '100%' }}>
                            <MainContentContainer>
                                {!selectedProposal && (
                                    <>
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
                                        {selectedTab === SpaceKey.TIPS && (
                                            <ProposalList spaceKey={SpaceKey.TIPS} onItemClick={setSelectedProposal} />
                                        )}
                                        {selectedTab === SpaceKey.COUNCIL && (
                                            <ProposalList
                                                spaceKey={SpaceKey.COUNCIL}
                                                onItemClick={setSelectedProposal}
                                            />
                                        )}
                                    </>
                                )}
                                {selectedProposal && <ProposalDetails proposal={selectedProposal} />}
                            </MainContentContainer>
                            {!selectedProposal && (
                                <SidebarContainer>
                                    <Sidebar>
                                        <CouncilMembers />
                                    </Sidebar>
                                </SidebarContainer>
                            )}
                            {selectedProposal && (
                                <SidebarContainer>
                                    <Sidebar style={{ marginBottom: 20 }}>
                                        <Results proposal={selectedProposal} />
                                    </Sidebar>
                                    <Sidebar>
                                        <History proposal={selectedProposal} />
                                    </Sidebar>
                                </SidebarContainer>
                            )}
                        </FlexDivRow>
                    </>
                ) : (
                    <Loader />
                )}
            </Wrapper>
        </Background>
    );
};

const MainContentContainer = styled.div`
    width: 66%;
    background: #04045a;
    border: 2px solid rgba(202, 145, 220, 0.2);
    border-radius: 5px;
    padding: 25px 30px;
`;

const SidebarContainer = styled(FlexDivColumn)`
    width: 33%;
    margin-left: 10px;
`;

const Sidebar = styled.div`
    background: #04045a;
    border: 2px solid rgba(202, 145, 220, 0.2);
    border-radius: 5px;
    padding: 10px 0px 0px 0px;
`;

const OptionsTabContainer = styled(FlexDiv)`
    height: 40px;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 48px;
    color: #748bc6;
    user-select: none;
    border-bottom: 5px solid #04045a;
    margin-left: 25px;
    margin-right: 25px;
    &.selected {
        transition: 0.2s;
        color: #f6f6fe;
        border-bottom: 5px solid #64d9fe;
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: #00f9ff;
    }
`;

const Title = styled.p`
    font-weight: bold;
    line-height: 64px;
    letter-spacing: -1px;
    font-size: 39px;
    padding-bottom: 25px;
    color: #f6f6fe;
    @media (max-width: 1024px) {
        font-size: 31px;
        padding-top: 30px;
        padding-bottom: 0;
    }
`;

const BackLinkWrapper = styled(FlexDiv)`
    height: 36px;
    align-self: start;
    margin-bottom: 10px;
`;

const BackLink = styled(FlexDivCentered)`
    font-weight: normal;
    font-size: 20px;
    line-height: 36px;
    color: #b8c6e5;
    &path {
        fill: #b8c6e5;
    }
    &:hover {
        cursor: pointer;
        color: #00f9ff;
        & path {
            fill: #00f9ff;
        }
    }
`;

const ArrowIcon = styled(ArrowBackIcon)`
    height: 20px;
    width: 24px;
    margin-right: 6px;
    margin-left: 4px;
`;

export default GovernancePage;
