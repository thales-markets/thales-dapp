import Button from 'components/ButtonV2/Button';
import SimpleLoader from 'components/SimpleLoader';
import { SpaceKey, StatusEnum } from 'enums/governance';
import useProposalsQuery from 'queries/governance/useProposalsQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { Proposal } from 'types/governance';
import { navigateToGovernance } from 'utils/routes';
import ProposalCard from '../ProposalCard';
import { LoaderContainer } from '../styled-components';
import { NoProposals, NoProposalsText, Wrapper } from './styled-components';

type ProposalListProps = {
    spaceKey: SpaceKey;
    onItemClick: any;
    statusFilter: StatusEnum;
    resetFilters: any;
};

const ProposalList: React.FC<ProposalListProps> = ({ spaceKey, onItemClick, statusFilter, resetFilters }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const proposalsQuery = useProposalsQuery(spaceKey, { enabled: isAppReady });
    const proposals = proposalsQuery.isSuccess && proposalsQuery.data ? proposalsQuery.data : [];

    const filteredProposals = useMemo(() => {
        return statusFilter === StatusEnum.All
            ? proposals
            : proposals.filter((proposal: Proposal) => proposal.state === statusFilter);
    }, [proposals, statusFilter]);

    const hasProposals = filteredProposals.length > 0;
    const isLoading = proposalsQuery.isLoading;

    return (
        <>
            {hasProposals && !isLoading && (
                <Wrapper>
                    {filteredProposals.map((proposal: Proposal) => (
                        <ProposalCard
                            key={proposal.id}
                            proposal={proposal}
                            onClick={() => {
                                navigateToGovernance(proposal.space.id, proposal.id);
                                onItemClick(proposal);
                                document.getElementById('proposal-details')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        />
                    ))}
                </Wrapper>
            )}
            {!hasProposals && !isLoading && (
                <NoProposals>
                    <>
                        <NoProposalsText>{t('governance.proposal.no-proposals-found')}</NoProposalsText>
                        <Button onClick={resetFilters}>{t('governance.proposal.view-all-proposals')}</Button>
                    </>
                </NoProposals>
            )}
            {isLoading && (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            )}
        </>
    );
};

export default ProposalList;
