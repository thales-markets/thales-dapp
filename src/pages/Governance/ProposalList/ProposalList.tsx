import React, { useMemo } from 'react';
import useProposalsQuery from 'queries/governance/useProposalsQuery';
import { snapshotEndpoint, SpaceKey, StatusEnum } from 'constants/governance';
import { Proposal } from 'types/governance';
import ProposalCard from '../ProposalCard';
import styled from 'styled-components';
import { navigateToGovernance } from 'utils/routes';

type ProposalListProps = {
    spaceKey: SpaceKey;
    onItemClick: any;
    statusFilter: StatusEnum;
};

const ProposalList: React.FC<ProposalListProps> = ({ spaceKey, onItemClick, statusFilter }) => {
    const proposalsQuery = useProposalsQuery(snapshotEndpoint, spaceKey);
    const proposals = proposalsQuery.isSuccess && proposalsQuery.data ? proposalsQuery.data : [];

    const filteredProposals = useMemo(() => {
        return statusFilter === StatusEnum.All
            ? proposals
            : proposals.filter((proposal: Proposal) => proposal.state === statusFilter);
    }, [proposals, statusFilter]);

    return (
        <Wrapper>
            {filteredProposals.map((proposal: Proposal) => (
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
    @media (max-width: 767px) {
        grid-template-columns: repeat(1, 1fr);
    }
    padding: 0 30px;
`;

export default ProposalList;
