import React from 'react';
import useProposalsQuery from 'queries/governance/useProposalsQuery';
import { snapshotEndpoint, SpaceKey } from 'constants/governance';
import { Proposal } from 'types/governance';
import ProposalCard from '../ProposalCard';
import styled from 'styled-components';

type ProposalListProps = {
    spaceKey: SpaceKey;
    setSelectedProposal: any;
};

const ProposalList: React.FC<ProposalListProps> = ({ spaceKey, setSelectedProposal }) => {
    const proposalsQuery = useProposalsQuery(snapshotEndpoint, spaceKey);
    const proposals = proposalsQuery.isSuccess && proposalsQuery.data ? proposalsQuery.data : [];

    return (
        <Wrapper>
            {proposals.map((proposal: Proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} onClick={() => setSelectedProposal(proposal)} />
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    margin-top: 25px;
    .cardWrapper:nth-child(even) {
        justify-self: end;
    }
    @media (max-width: 767px) {
        grid-template-columns: repeat(1, 1fr);
        .cardWrapper {
            justify-self: center !important;
        }
    }
`;

export default ProposalList;
