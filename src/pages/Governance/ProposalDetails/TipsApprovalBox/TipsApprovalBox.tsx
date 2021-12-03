import React, { useMemo } from 'react';
import { FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { LoaderContainer } from 'pages/Governance/components';
import styled from 'styled-components';
import { PROPOSAL_APPROVAL_VOTES, NUMBER_OF_COUNCIL_MEMBERS, StatusEnum } from 'constants/governance';
import SimpleLoader from 'components/SimpleLoader';
import { Proposal, ProposalResults } from 'types/governance';
import { useTranslation } from 'react-i18next';
import { Pie, PieChart, Cell } from 'recharts';
import { PieChartContainer } from 'pages/Options/Earn/components';

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
    const isPassed = proposalResults && proposalResults.votes.length >= PROPOSAL_APPROVAL_VOTES;

    const pieData = useMemo(() => {
        const data = [];
        const numberOfVotes = proposalResults ? proposalResults.votes.length : 0;

        for (let index = 0; index < NUMBER_OF_COUNCIL_MEMBERS; index++) {
            const piece = {
                name: 'vote',
                value: 1,
                color: index < numberOfVotes ? (closed && !isPassed ? 'rgba(130, 8, 252, 0.6)' : '#8208FC') : '#0C1C68',
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

    return (
        <>
            {!isLoading && proposalResults && (
                <Container>
                    <VotedIn>
                        <VotedInLabel>{t(`governance.proposal.voted-in-label`)}</VotedInLabel>
                        <VoteNote>
                            (
                            {t(`governance.proposal.vote-note`, {
                                approvalVotes: PROPOSAL_APPROVAL_VOTES,
                                totalVotes: NUMBER_OF_COUNCIL_MEMBERS,
                            })}
                            )
                        </VoteNote>

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

const Container = styled(FlexDivRow)`
    width: 100%;
`;

const VotedIn = styled(FlexDivColumnCentered)`
    margin: 0 15px 15px 15px;
`;

const VotedInLabel = styled.span`
    font-weight: 500;
    font-size: 25px;
    line-height: 30px;
    color: #f6f6fe;
    text-align: center;
    margin-top: 15px;
`;

const VoteNote = styled.span`
    font-weight: 300;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: #b8c6e5;
    text-transform: uppercase;
`;

const Votes = styled.span`
    font-weight: 500;
    font-size: 20px;
    line-height: 48px;
    text-align: center;
    color: #f6f6fe;
    margin-top: 6px;
`;

const StyledPieChartContainer = styled(PieChartContainer)`
    margin: 0 15px 15px 0;
`;

const StyledPieChart = styled(PieChart)``;

const ChartInnerText = styled(FlexDivColumnCentered)<{ isInProgress: boolean }>`
    position: absolute;
    bottom: 36%;
    left: 50%;
    transform: translate(-50%, 0);
    font-weight: ${(props) => (props.isInProgress ? 300 : 500)};
    font-size: 16px;
    line-height: ${(props) => (props.isInProgress ? 24 : 36)}px;
    color: #f6f6fe;
    text-transform: uppercase;
    text-align: center;
    width: 95px;
`;

export default TipsApprovalBox;
