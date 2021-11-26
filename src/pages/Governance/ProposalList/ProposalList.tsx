import React, { useMemo } from 'react';
import useProposalsQuery from 'queries/governance/useProposalsQuery';
import { SpaceKey, StatusEnum } from 'constants/governance';
import { Proposal } from 'types/governance';
import ProposalCard from '../ProposalCard';
import styled from 'styled-components';
import { navigateToGovernance } from 'utils/routes';
import { Button, FlexDivColumn, Text } from 'theme/common';
import { useTranslation } from 'react-i18next';

type ProposalListProps = {
    spaceKey: SpaceKey;
    onItemClick: any;
    statusFilter: StatusEnum;
    resetFilters: any;
};

const ProposalList: React.FC<ProposalListProps> = ({ spaceKey, onItemClick, statusFilter, resetFilters }) => {
    const { t } = useTranslation();
    const proposalsQuery = useProposalsQuery(spaceKey);
    const proposals = proposalsQuery.isSuccess && proposalsQuery.data ? proposalsQuery.data : [];

    const filteredProposals = useMemo(() => {
        return statusFilter === StatusEnum.All
            ? proposals
            : proposals.filter((proposal: Proposal) => proposal.state === statusFilter);
    }, [proposals, statusFilter]);

    const hasProposals = filteredProposals.length > 0;

    return (
        <>
            {hasProposals && (
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
            )}
            {!hasProposals && (
                <NoProposals>
                    <>
                        <Text className="text-l bold pale-grey">{t('governance.proposal.no-proposals-found')}</Text>
                        <Button className="primary" onClick={resetFilters}>
                            {t('governance.proposal.view-all-proposals')}
                        </Button>
                    </>
                </NoProposals>
            )}
        </>
    );
};

const NoProposals = styled(FlexDivColumn)`
    margin-top: 30px;
    min-height: 400px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    align-self: center;
`;

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
