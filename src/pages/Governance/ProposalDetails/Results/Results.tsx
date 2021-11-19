import React from 'react';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import { Proposal } from 'types/governance';
import useProposalQuery from 'queries/governance/useProposalQuery';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
// import externalLink from 'remarkable-external-link';

type ResultsProps = {
    proposal: Proposal;
};

const Results: React.FC<ResultsProps> = ({ proposal }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const proposalResultsQuery = useProposalQuery(proposal.space.id, proposal.id, walletAddress);

    let mappedResults: any = [];
    let spaceSymbol = '';
    let totalVotes = 1;
    if (proposalResultsQuery.isSuccess && proposalResultsQuery.data) {
        const proposalResults = proposalResultsQuery.data;
        totalVotes = proposalResults.totalVotesBalances !== 0 ? proposalResults.totalVotesBalances : 1;
        console.log(totalVotes);

        mappedResults = proposalResults.totalBalances
            .map((balance, key) => {
                return {
                    label: proposalResults.choices[key],
                    balance: balance,
                };
            })
            .sort((a: any, b: any) => b.balance - a.balance);
        spaceSymbol = proposalResults.spaceSymbol;
    }

    return (
        <FlexDivColumnCentered>
            <Title>Results</Title>
            <Wrapper>
                <Container>
                    {mappedResults.map((result: any) => (
                        <Row key={result.address}>
                            {result.label} {formatCurrencyWithKey(spaceSymbol, result.balance)}{' '}
                            {formatPercentage(result.balance / totalVotes)}
                        </Row>
                    ))}
                </Container>
            </Wrapper>
        </FlexDivColumnCentered>
    );
};

const Title = styled(FlexDivColumnCentered)`
    font-weight: 500;
    font-size: 25px;
    line-height: 48px;
    color: #f6f6fe;
    margin-bottom: 25px;
    text-align: center;
`;

const Wrapper = styled(FlexDivColumn)`
    background: linear-gradient(rgba(202, 145, 220, 0.3), rgba(106, 193, 213, 0.3));
    padding: 1px 0;
`;

const Container = styled(FlexDivColumn)`
    background-color: #04045a;
`;

const Row = styled(FlexDivRow)`
    margin: 20px;
    font-weight: bold;
    font-size: 16px;
    line-height: 36px;
    color: #f6f6fe;
`;

export default Results;
