import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { navigateTo } from 'utils/routes';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { isNetworkSupported } from 'utils/network';
import MarketHeader from 'pages/Options/Home/MarketHeader';
import Loader from 'components/Loader';
import { Background, FlexDivCentered, FlexDivColumn, FlexDiv } from 'theme/common';
import { snapshotEndpoint, SpaceKey } from 'constants/governance';
import ProposalList from './ProposalList';
import ProposalDetails from './ProposalDetails';
import History from './ProposalDetails/History';
import Results from './ProposalDetails/Results';
import { Proposal } from 'types/governance';
import CouncilMembers from './CouncilMembers';
import { RouteComponentProps } from 'react-router-dom';
import request, { gql } from 'graphql-request';

type GovernancePageProps = RouteComponentProps<{
    space: string;
    id: string;
}>;

const GovernancePage: React.FC<GovernancePageProps> = (props) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>(undefined);
    const [selectedTab, setSelectedTab] = useState<SpaceKey>(SpaceKey.TIPS);

    console.log(location);

    const fetchPreloadedProposal = useCallback(() => {
        const fetch = async () => {
            const { params } = props.match;
            const hash = params.id;
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
                            space {
                                id
                                name
                            }
                        }
                    }
                `,
                { id: hash }
            );
            setSelectedProposal(proposal);
        };
        fetch();
    }, [props.match]);

    useEffect(() => {
        const { params } = props.match;

        if (params && params.space && (params.space === SpaceKey.TIPS || params.space === SpaceKey.COUNCIL)) {
            if (params.id) {
                fetchPreloadedProposal();
            }
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
        <Background style={{ minHeight: '100vh' }}>
            {networkId && isNetworkSupported(networkId) ? (
                <>
                    <Container>
                        <FlexDivColumn style={{ width: '100%' }} className="earn">
                            <MarketHeader route={ROUTES.Governance.Home} />
                        </FlexDivColumn>
                    </Container>
                    <Container>
                        <FlexDivColumn>
                            <Title style={{ alignSelf: 'flex-start' }}>Governance</Title>
                            <FlexDiv>
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
                                                            navigateTo(`/governance/${tab.id}`, true);
                                                            setSelectedTab(tab.id);
                                                        }}
                                                        className={`${tab.id === selectedTab ? 'selected' : ''}`}
                                                    >
                                                        {tab.name}
                                                    </OptionsTab>
                                                ))}
                                            </OptionsTabContainer>
                                            {selectedTab === SpaceKey.TIPS && (
                                                <ProposalList
                                                    spaceKey={SpaceKey.TIPS}
                                                    setSelectedProposal={setSelectedProposal}
                                                />
                                            )}
                                            {selectedTab === SpaceKey.COUNCIL && (
                                                <ProposalList
                                                    spaceKey={SpaceKey.COUNCIL}
                                                    setSelectedProposal={setSelectedProposal}
                                                />
                                            )}
                                        </>
                                    )}
                                    {selectedProposal && (
                                        <ProposalDetails
                                            proposal={selectedProposal}
                                            onClose={() => {
                                                setSelectedProposal(undefined);
                                            }}
                                        />
                                    )}
                                </MainContentContainer>
                                {!selectedProposal && (
                                    <SidebarContainer>
                                        <CouncilMembers />
                                    </SidebarContainer>
                                )}
                                {selectedProposal && (
                                    <FlexDivColumn>
                                        <SidebarContainer style={{ marginBottom: 20 }}>
                                            <Results proposal={selectedProposal} />
                                        </SidebarContainer>
                                        <SidebarContainer>
                                            <History proposal={selectedProposal} />
                                        </SidebarContainer>
                                    </FlexDivColumn>
                                )}
                            </FlexDiv>
                        </FlexDivColumn>
                    </Container>
                </>
            ) : (
                <Loader />
            )}
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
        padding-left: 10px;
        padding-right: 10px;
    }
`;

const MainContentContainer = styled.div`
    width: 808px;
    background: #04045a;
    border: 2px solid rgba(202, 145, 220, 0.2);
    border-radius: 5px;
    padding: 25px 30px;
`;

const SidebarContainer = styled.div`
    background: #04045a;
    border: 2px solid rgba(202, 145, 220, 0.2);
    border-radius: 5px;
    padding: 35px 0px;
    width: 470px;
    margin-left: 10px;
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
    padding-bottom: 65px;
    color: #f6f6fe;
    @media (max-width: 1024px) {
        font-size: 31px;
        padding-top: 30px;
        padding-bottom: 0;
    }
`;

export default GovernancePage;
