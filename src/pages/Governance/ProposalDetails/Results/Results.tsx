import React, { useEffect, useMemo, useState } from 'react';
import { FlexDivColumnCentered, FlexDiv } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import { Proposal, ProposalResults } from 'types/governance';
import useProposalQuery from 'queries/governance/useProposalQuery';
import { formatPercentage, formatCurrency } from 'utils/formatters/number';
import SimpleLoader from 'components/SimpleLoader';
import {
    Label,
    LoaderContainer,
    Percentage,
    RowPercentage,
    RowPercentageIndicator,
    SidebarContainer,
    SidebarRow,
    SidebarRowData,
    SidebarScrollWrapper,
    SidebarTitle,
    SidebarWrapper,
    Votes,
} from 'pages/Governance/components';
// import externalLink from 'remarkable-external-link';

type ResultsProps = {
    proposal: Proposal;
};

const Results: React.FC<ResultsProps> = ({ proposal }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const proposalResultsQuery = useProposalQuery(proposal.space.id, proposal.id, walletAddress);
    const [proposalResults, setProposalResults] = useState<ProposalResults | undefined>(undefined);

    useEffect(() => {
        if (proposalResultsQuery.isSuccess && proposalResultsQuery.data) {
            setProposalResults(proposalResultsQuery.data);
        }
    }, [proposalResultsQuery.isSuccess, proposalResultsQuery.data]);

    console.log(proposal);
    const spaceSymbol = proposal.space.symbol;

    const choices = useMemo(() => {
        if (proposalResults) {
            const choices = proposal.choices.map((choice: any, i: number) => ({
                i,
                choice,
            }));
            if (proposalResults && proposalResults.results.resultsByVoteBalance) {
                return choices.sort(
                    (a: any, b: any) =>
                        proposalResults.results.resultsByVoteBalance[b.i] -
                        proposalResults.results.resultsByVoteBalance[a.i]
                );
            }
            return choices;
        }
        return [];
    }, [proposalResults, proposal]);

    function getNumberLabel(labelValue: number) {
        // Nine Zeroes for Billions
        return labelValue >= 1.0e9
            ? formatCurrency(labelValue / 1.0e9, 2, true) + 'b'
            : // Six Zeroes for Millions
            labelValue >= 1.0e6
            ? formatCurrency(labelValue / 1.0e6, 2, true) + 'm'
            : // Three Zeroes for Thousands
            labelValue >= 1.0e3
            ? formatCurrency(labelValue / 1.0e3, 2, true) + 'k'
            : formatCurrency(labelValue, 2, true);
    }

    const isLoading = proposalResultsQuery.isLoading;

    return (
        <FlexDivColumnCentered>
            <SidebarTitle>Results</SidebarTitle>
            <SidebarWrapper>
                {!isLoading && (
                    <SidebarScrollWrapper>
                        <SidebarContainer>
                            {choices.map((choice: any) => {
                                const label =
                                    choice.choice.length > 12 ? `${choice.choice.substring(0, 12)}...` : choice.choice;

                                return (
                                    <SidebarRow key={label}>
                                        <SidebarRowData>
                                            <FlexDiv>
                                                <Label>{label}</Label>
                                                <Votes>{`${getNumberLabel(
                                                    proposalResults &&
                                                        proposalResults.results &&
                                                        proposalResults.results.resultsByVoteBalance
                                                        ? proposalResults.results.resultsByVoteBalance[choice.i]
                                                        : 0
                                                )} ${spaceSymbol}`}</Votes>
                                            </FlexDiv>
                                            <Percentage>
                                                {formatPercentage(
                                                    proposalResults && proposalResults.results.sumOfResultsBalance
                                                        ? proposalResults.results.resultsByVoteBalance[choice.i] /
                                                              proposalResults.results.sumOfResultsBalance
                                                        : 0
                                                )}
                                            </Percentage>
                                        </SidebarRowData>
                                        <div
                                            style={{
                                                position: 'relative',
                                            }}
                                        >
                                            <RowPercentage />
                                            <RowPercentageIndicator
                                                width={
                                                    proposalResults && proposalResults.results.sumOfResultsBalance
                                                        ? (proposalResults.results.resultsByVoteBalance[choice.i] *
                                                              100) /
                                                          proposalResults.results.sumOfResultsBalance
                                                        : 0
                                                }
                                            ></RowPercentageIndicator>
                                        </div>
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
    );
};

export default Results;
