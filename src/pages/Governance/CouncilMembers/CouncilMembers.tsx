import React, { useEffect, useState } from 'react';
import { FlexDivColumnCentered } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import { ProposalResults } from 'types/governance';
import useProposalQuery from 'queries/governance/useProposalQuery';
import SimpleLoader from 'components/SimpleLoader';
import {
    LoaderContainer,
    SidebarContent,
    SidebarContentScrollWrapper,
    SidebarTitle,
    SidebarContentWrapper,
} from 'pages/Governance/components';
import { useTranslation } from 'react-i18next';
import { COUNCIL_PROPOSAL_ID, SpaceKey } from 'constants/governance';
import Results from '../ProposalDetails/Results';

const CouncilMembers: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const proposalResultsQuery = useProposalQuery(SpaceKey.COUNCIL, COUNCIL_PROPOSAL_ID, walletAddress);
    const [proposalResults, setProposalResults] = useState<ProposalResults | undefined>(undefined);

    useEffect(() => {
        if (proposalResultsQuery.isSuccess && proposalResultsQuery.data) {
            setProposalResults(proposalResultsQuery.data);
        }
    }, [proposalResultsQuery.isSuccess, proposalResultsQuery.data]);

    const isLoading = proposalResultsQuery.isLoading;

    return (
        <FlexDivColumnCentered>
            <SidebarTitle>{t(`governance.sidebar.title.council-members`)}</SidebarTitle>
            <SidebarContentWrapper>
                {!isLoading && (
                    <SidebarContentScrollWrapper maxHeight={1100}>
                        <SidebarContent>
                            {proposalResults && (
                                <Results
                                    proposalChoices={proposalResults.choices}
                                    results={proposalResults.results}
                                    spaceSymbol={proposalResults.spaceSymbol}
                                    isCouncilResults={true}
                                />
                            )}
                        </SidebarContent>
                    </SidebarContentScrollWrapper>
                )}
                {isLoading && (
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                )}
            </SidebarContentWrapper>
        </FlexDivColumnCentered>
    );
};

export default CouncilMembers;
