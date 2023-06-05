import { COUNCIL_PROPOSAL_ID } from 'constants/governance';
import { SidebarContent, SidebarContentWrapper, SidebarTitle } from 'pages/Governance/styled-components';
import useProposalQuery from 'queries/governance/useProposalQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumnCentered } from 'theme/common';
import Results from '../ProposalDetails/Results';
import { SpaceKey } from 'enums/governance';

const CouncilMembers: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const proposalResultsQuery = useProposalQuery(SpaceKey.COUNCIL, COUNCIL_PROPOSAL_ID, walletAddress);
    const proposalResults =
        proposalResultsQuery.isSuccess && proposalResultsQuery.data ? proposalResultsQuery.data : undefined;

    return (
        <FlexDivColumnCentered>
            <SidebarTitle>{t(`governance.sidebar.title.council-members`)}</SidebarTitle>
            <SidebarContentWrapper>
                <SidebarContent>
                    <Results
                        proposalResults={proposalResults}
                        isCouncilResults={true}
                        isLoading={proposalResultsQuery.isLoading}
                        showAll={true}
                        proposalId={COUNCIL_PROPOSAL_ID}
                    />
                </SidebarContent>
            </SidebarContentWrapper>
        </FlexDivColumnCentered>
    );
};

export default CouncilMembers;
