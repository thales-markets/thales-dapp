import React from 'react';
import { FlexDiv, FlexDivColumnCentered } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import { Proposal } from 'types/governance';
import useProposalQuery from 'queries/governance/useProposalQuery';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import voting from 'utils/voting';
import { truncateAddress } from 'utils/formatters/string';
import {
    Label,
    LoaderContainer,
    Percentage,
    SidebarContainer,
    SidebarRow,
    SidebarRowData,
    SidebarScrollWrapper,
    SidebarTitle,
    SidebarWrapper,
    Votes,
} from 'pages/Governance/components';
import SimpleLoader from 'components/SimpleLoader';
// import externalLink from 'remarkable-external-link';

type HistoryProps = {
    proposal: Proposal;
};

const History: React.FC<HistoryProps> = ({ proposal }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const proposalResultsQuery = useProposalQuery(proposal.space.id, proposal.id, walletAddress);

    const isWeightedChoice = proposal.type === 'weighted';
    const isLoading = proposalResultsQuery.isLoading;

    return (
        <>
            {proposalResultsQuery.isSuccess && proposalResultsQuery.data && (
                <FlexDivColumnCentered>
                    <SidebarTitle>History</SidebarTitle>
                    <SidebarWrapper>
                        {!isLoading && (
                            <SidebarScrollWrapper>
                                <SidebarContainer>
                                    {proposalResultsQuery.data.votes.map((vote: any) => {
                                        return (
                                            <SidebarRow key={vote.voter}>
                                                <SidebarRowData>
                                                    <FlexDiv>
                                                        <Label>{truncateAddress(vote.voter)}</Label>
                                                        <Votes>
                                                            {isWeightedChoice
                                                                ? new voting['weighted'](
                                                                      proposal,
                                                                      [],
                                                                      [],
                                                                      vote.choice
                                                                  ).getChoiceString()
                                                                : proposal.choices[vote.choice - 1]}
                                                        </Votes>
                                                    </FlexDiv>
                                                    <Percentage>
                                                        {formatCurrencyWithKey(proposal.space.symbol, vote.balance)}
                                                    </Percentage>
                                                </SidebarRowData>
                                            </SidebarRow>
                                        );
                                    })}
                                </SidebarContainer>
                            </SidebarScrollWrapper>
                        )}
                        {isLoading && (
                            <LoaderContainer>
                                <SimpleLoader />
                            </LoaderContainer>
                        )}
                    </SidebarWrapper>
                </FlexDivColumnCentered>
            )}
        </>
    );
};

export default History;
