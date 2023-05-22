import React, { useMemo } from 'react';
import { Colors, FlexDivColumnCentered } from 'theme/common';
import { LoaderContainer } from 'pages/Governance/styled-components';
import { StatusEnum } from 'constants/governance';
import SimpleLoader from 'components/SimpleLoader';
import { Proposal, ProposalResults } from 'types/governance';
import { useTranslation } from 'react-i18next';
import { Pie, Cell } from 'recharts';
import { getProposalApprovalData } from 'utils/governance';
import {
    ChartInnerText,
    Container,
    StyledPieChart,
    StyledPieChartContainer,
    VoteNote,
    VotedIn,
    VotedInLabel,
    Votes,
} from './styled-components';

type TipsApprovalBoxProps = {
    proposal: Proposal;
    proposalResults?: ProposalResults;
    isLoading: boolean;
};

const TipsApprovalBox: React.FC<TipsApprovalBoxProps> = ({ proposal, proposalResults, isLoading }) => {
    const { t } = useTranslation();
    const closed = proposal.state === StatusEnum.Closed;
    const pending = proposal.state === StatusEnum.Pending;
    const active = proposal.state === StatusEnum.Active;
    const { numberOfCouncilMembers, proposalApprovalVotes } = getProposalApprovalData(proposal.start);
    const isPassed =
        proposalResults &&
        proposalResults.results &&
        proposalResults.results.resultsByVoteBalance &&
        proposalResults.results.resultsByVoteBalance[0] >= proposalApprovalVotes;

    const chartColor = isPassed ? Colors.GREEN : closed ? Colors.RED : Colors.GREEN;

    const pieData = useMemo(() => {
        const data = [];
        const numberOfVotes =
            proposalResults && proposalResults.results && proposalResults.results.resultsByVoteBalance
                ? proposalResults.results.resultsByVoteBalance[0]
                : 0;

        for (let index = 0; index < numberOfCouncilMembers; index++) {
            const piece = {
                name: 'vote',
                value: 1,
                color: index < numberOfVotes ? chartColor : Colors.GRAY,
            };
            data.push(piece);
        }

        return data;
    }, [proposalResults]);

    const chartInnerText = isPassed
        ? t(`governance.proposal.voting-approval-status.passed`)
        : closed
        ? t(`governance.proposal.voting-approval-status.not-passed`)
        : pending
        ? ''
        : t(`governance.proposal.voting-approval-status.in-progress`);

    const statusLabel = isPassed
        ? t(`governance.proposal.voted-in-label`)
        : closed
        ? t(`governance.proposal.not-voted-in-label`)
        : pending
        ? ''
        : t(`governance.proposal.voting-label`);

    return (
        <>
            {!isLoading && proposalResults && (
                <Container>
                    <VotedIn>
                        <FlexDivColumnCentered>
                            <VotedInLabel>{statusLabel}</VotedInLabel>
                            <VoteNote>
                                (
                                {t(`governance.proposal.vote-note`, {
                                    approvalVotes: proposalApprovalVotes,
                                    totalVotes: numberOfCouncilMembers,
                                })}
                                )
                            </VoteNote>
                        </FlexDivColumnCentered>
                        <Votes>{t(`governance.proposal.votes`, { votes: proposalResults.votes.length })}</Votes>
                    </VotedIn>
                    <StyledPieChartContainer>
                        <StyledPieChart width={132} height={132}>
                            <Pie
                                isAnimationActive={false}
                                blendStroke={true}
                                data={pieData}
                                dataKey={'value'}
                                outerRadius={65}
                                innerRadius={53}
                                paddingAngle={4}
                                startAngle={88}
                                endAngle={-272}
                            >
                                {pieData.map((slice, index) => (
                                    <Cell key={index} fill={slice.color} />
                                ))}
                            </Pie>
                        </StyledPieChart>
                        <ChartInnerText isInProgress={active && !isPassed}>{chartInnerText}</ChartInnerText>
                    </StyledPieChartContainer>
                </Container>
            )}
            {isLoading && (
                <LoaderContainer height={200}>
                    <SimpleLoader />
                </LoaderContainer>
            )}
        </>
    );
};

export default TipsApprovalBox;
