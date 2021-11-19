import React from 'react';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import { Proposal } from 'types/governance';
import useProposalQuery from 'queries/governance/useProposalQuery';
import { formatCurrencyWithKey } from 'utils/formatters/number';
// import externalLink from 'remarkable-external-link';

type HistoryProps = {
    proposal: Proposal;
};

const History: React.FC<HistoryProps> = ({ proposal }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const proposalResultsQuery = useProposalQuery(proposal.space.id, proposal.id, walletAddress);

    return (
        <>
            {proposalResultsQuery.isSuccess && proposalResultsQuery.data && (
                <FlexDivColumnCentered>
                    <Title>History</Title>
                    <Wrapper>
                        <Container>
                            {proposalResultsQuery.data.voteList.map((vote: any) => (
                                <Row key={vote.voter}>
                                    {vote.voter} {proposalResultsQuery.data.choices[vote.choice - 1]}{' '}
                                    {formatCurrencyWithKey(proposalResultsQuery.data.spaceSymbol, vote.balance)}
                                </Row>
                            ))}
                        </Container>
                    </Wrapper>
                </FlexDivColumnCentered>
            )}
        </>
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

export default History;
