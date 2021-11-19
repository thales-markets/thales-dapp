import React from 'react';
import useProposalsQuery from 'queries/governance/useProposalsQuery';
import { snapshotEndpoint, SpaceKey } from 'constants/governance';
import { Proposal } from 'types/governance';
import ProposalCard from '../ProposalCard';
import styled from 'styled-components';
import { navigateToGovernance } from 'utils/routes';

type ProposalListProps = {
    spaceKey: SpaceKey;
    onItemClick: any;
};

const ProposalList: React.FC<ProposalListProps> = ({ spaceKey, onItemClick }) => {
    const proposalsQuery = useProposalsQuery(snapshotEndpoint, spaceKey);
    const proposals = proposalsQuery.isSuccess && proposalsQuery.data ? proposalsQuery.data : [];

    return (
        <Wrapper>
            {proposals.map((proposal: Proposal) => (
                <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onClick={() => {
                        navigateToGovernance(proposal.space.id, proposal.id);
                        onItemClick(proposal);
                    }}
                />
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
