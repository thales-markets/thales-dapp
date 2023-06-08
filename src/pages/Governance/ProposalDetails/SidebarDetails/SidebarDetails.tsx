import { VOTING_COUNCIL_PROPOSAL_ID, VOTING_ORACLE_COUNCIL_PROPOSAL_ID } from 'constants/governance';
import { SpaceKey } from 'enums/governance';
import { SidebarContent, SidebarContentWrapper, SidebarTitle, VotesCount } from 'pages/Governance/styled-components';
import useProposalQuery from 'queries/governance/useProposalQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import { Proposal } from 'types/governance';
import History from '../History';
import Results from '../Results';
import TipsApprovalBox from '../TipsApprovalBox';

type SidebarType = 'results' | 'history' | 'approval-box';

type SidebarDetailsProps = {
    proposal: Proposal;
    type: SidebarType;
};

const SidebarDetails: React.FC<SidebarDetailsProps> = ({ proposal, type }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const proposalResultsQuery = useProposalQuery(proposal.space.id, proposal.id, walletAddress);
    const proposalResults =
        proposalResultsQuery.isSuccess && proposalResultsQuery.data ? proposalResultsQuery.data : undefined;
    const isCouncilVoting = useMemo(
        () =>
            proposal.space.id === SpaceKey.COUNCIL &&
            (proposal.id === VOTING_COUNCIL_PROPOSAL_ID || proposal.id === VOTING_ORACLE_COUNCIL_PROPOSAL_ID),
        [proposal]
    );

    return (
        <>
            {type === 'approval-box' && (
                <SidebarContent>
                    <TipsApprovalBox
                        proposal={proposal}
                        proposalResults={proposalResults}
                        isLoading={proposalResultsQuery.isLoading}
                    />
                </SidebarContent>
            )}
            {type !== 'approval-box' && (
                <FlexDivColumnCentered>
                    <FlexDivCentered>
                        <FlexDivCentered>
                            <SidebarTitle>{t(`governance.sidebar.title.${type}`)}</SidebarTitle>
                            {type === 'history' && proposalResults && proposalResults.votes.length > 0 && (
                                <VotesCount>{proposalResults.votes.length}</VotesCount>
                            )}
                        </FlexDivCentered>
                    </FlexDivCentered>
                    <SidebarContentWrapper>
                        <SidebarContent type={type} isCouncilVoting={isCouncilVoting}>
                            {type === 'results' && (
                                <Results
                                    isCouncilVoting={isCouncilVoting}
                                    proposalResults={proposalResults}
                                    isLoading={proposalResultsQuery.isLoading}
                                    proposalId={proposal.id}
                                />
                            )}
                            {type === 'history' && (
                                <History
                                    proposal={proposal}
                                    proposalResults={proposalResults}
                                    isLoading={proposalResultsQuery.isLoading}
                                />
                            )}
                        </SidebarContent>
                    </SidebarContentWrapper>
                </FlexDivColumnCentered>
            )}
        </>
    );
};

export default SidebarDetails;
