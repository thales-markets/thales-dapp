import React, { useEffect, useState } from 'react';
import { FlexDivColumnCentered } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import { Proposal, ProposalResults } from 'types/governance';
import useProposalQuery from 'queries/governance/useProposalQuery';
import SimpleLoader from 'components/SimpleLoader';
import {
    LoaderContainer,
    SidebarContent,
    SidebarContentScrollWrapper,
    SidebarTitle,
    SidebarContentWrapper,
} from 'pages/Governance/components';
import Results from '../Results';
import History from '../History';
import { useTranslation } from 'react-i18next';
// import externalLink from 'remarkable-external-link';

type SidebarType = 'results' | 'history';

type SidebarDetailsProps = {
    proposal: Proposal;
    type: SidebarType;
};

const SidebarDetails: React.FC<SidebarDetailsProps> = ({ proposal, type }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const proposalResultsQuery = useProposalQuery(proposal.space.id, proposal.id, walletAddress);
    const [proposalResults, setProposalResults] = useState<ProposalResults | undefined>(undefined);

    useEffect(() => {
        if (proposalResultsQuery.isSuccess && proposalResultsQuery.data) {
            setProposalResults(proposalResultsQuery.data);
        }
    }, [proposalResultsQuery.isSuccess, proposalResultsQuery.data]);

    const isLoading = proposalResultsQuery.isLoading;

    return (
        <FlexDivColumnCentered>
            <SidebarTitle>{t(`governance.sidebar.title.${type}`)}</SidebarTitle>
            <SidebarContentWrapper>
                {!isLoading && (
                    <SidebarContentScrollWrapper>
                        <SidebarContent type={type}>
                            {proposalResults && type === 'results' && (
                                <Results proposal={proposal} results={proposalResults.results} />
                            )}
                            {proposalResults && type === 'history' && (
                                <History proposal={proposal} votes={proposalResults.votes} />
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

export default SidebarDetails;
