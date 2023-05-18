import { SpaceKey, StatusEnum } from 'constants/governance';
import { indexOf, max } from 'lodash';
import TimeRemaining from 'components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow, FlexDivRowCentered, FlexDivCentered, Colors } from 'theme/common';
import { Proposal } from 'types/governance';
import { truncateText } from 'utils/formatters/string';
import { getColor } from '../components';

type ProposalCardProps = {
    proposal: Proposal;
    onClick: any;
};

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onClick }) => {
    const { t } = useTranslation();
    const closed = proposal.state === StatusEnum.Closed;
    const pending = proposal.state === StatusEnum.Pending;

    const finalChoice = proposal.choices[indexOf(proposal.scores, max(proposal.scores))];

    return (
        <CardContainer onClick={onClick}>
            <Card>
                <FlexDivRowCentered>
                    <Status status={proposal.state}>{t(`governance.status.${proposal.state}`)}</Status>
                    {!closed && (
                        <RightSection>
                            <span>{t(`governance.proposal.${pending ? 'starts-in-label' : 'ends-in-label'}`)}: </span>
                            <TimeRemaining end={(pending ? proposal.start : proposal.end) * 1000} fontSize={16} />
                        </RightSection>
                    )}
                    {!!closed && proposal.space.id === SpaceKey.TIPS && (
                        <ResultContainer>
                            <span>{t(`governance.proposal.final-result-label`)}: </span>
                            <Result color={finalChoice.toUpperCase() === 'NO' ? Colors.RED : Colors.GREEN}>
                                {finalChoice}
                            </Result>
                        </ResultContainer>
                    )}
                </FlexDivRowCentered>
                <Title status={proposal.state}>{proposal.title}</Title>
                <Body status={proposal.state}>{truncateText(proposal.body, 200)}</Body>
            </Card>
        </CardContainer>
    );
};

export const CardContainer = styled(FlexDivColumnCentered)`
    width: 100%;
    position: relative;
    background: ${(props) => props.theme.background.secondary};
    min-height: 200px;
    padding: 2px;
    border-radius: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    align-items: center;
    color: ${(props) => props.theme.textColor.primary};
    cursor: pointer;
    &:hover {
        background: ${(props) => props.theme.background.secondary};
        box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    }
`;

const Card = styled.div`
    border-radius: 15px;
    background: ${(props) => props.theme.background.primary};
    width: 100%;
    height: 100%;
    padding: 20px;
`;

const Status = styled(FlexDivCentered)<{ status: string }>`
    font-weight: bold;
    color: ${(props) => getColor(props.status)};
    text-transform: uppercase;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.5px;
    border: 2px solid ${(props) => getColor(props.status)};
    border-radius: 4px;
    padding: 0px 20px;
    height: 36px;
    text-align: center;
    margin-right: 20px;
`;

const Title = styled(FlexDivRow)<{ status: string }>`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) =>
        props.status === StatusEnum.Closed ? props.theme.textColor.secondary : props.theme.textColor.primary};
    margin-top: 25px;
    margin-bottom: 25px;
`;

const Body = styled(FlexDivRow)<{ status: string }>`
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) =>
        props.status === StatusEnum.Closed ? props.theme.textColor.secondary : props.theme.textColor.primary};
`;

const ResultContainer = styled.div`
    color: ${(props) => props.theme.textColor.secondary};
    text-align: right;
`;

const Result = styled.span<{ color: string }>`
    color: ${(props) => props.color};
`;

const RightSection = styled.div`
    text-align: right;
`;

export default ProposalCard;
