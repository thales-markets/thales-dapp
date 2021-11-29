import React from 'react';
import { FlexDivColumnCentered } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import useProposalQuery from 'queries/governance/useProposalQuery';
import { SidebarContent, SidebarTitle, SidebarContentWrapper } from 'pages/Governance/components';
import { useTranslation } from 'react-i18next';
import { COUNCIL_PROPOSAL_ID, SpaceKey } from 'constants/governance';
import Results from '../ProposalDetails/Results';

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
                    />
                </SidebarContent>
            </SidebarContentWrapper>
        </FlexDivColumnCentered>
    );
};

export default CouncilMembers;
