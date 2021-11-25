import { StatusEnum } from 'constants/governance';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow, FlexDivRowCentered, FlexDivCentered } from 'theme/common';
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

    return (
        <CardContainer onClick={onClick}>
            <Card>
                <FlexDivRowCentered>
                    <Status status={proposal.state}>{t(`governance.status.${proposal.state}`)}</Status>
                    {!closed && (
                        <div>
                            <span>{t(`governance.proposal.${pending ? 'starts-in-label' : 'ends-in-label'}`)}: </span>
                            <TimeRemaining end={(pending ? proposal.start : proposal.end) * 1000} fontSize={16} />
                        </div>
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
    background: linear-gradient(150.74deg, #ca91dc -7.89%, #6ac1d5 107.94%);
    height: 320px;
    padding: 2px;
    border-radius: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    align-items: center;
    color: #f6f6fe;
    cursor: pointer;
    &:hover {
        background: #64d9fe;
        box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    }
`;

const Card = styled.div`
    border-radius: 15px;
    background: #04045a;
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
    border-radius: 10px;
    width: 100px;
    height: 36px;
    text-align: center;
`;

const Title = styled(FlexDivRow)<{ status: string }>`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => (props.status === StatusEnum.Closed ? '#B8C6E5' : '#F6F6FE')};
    margin-top: 25px;
    margin-bottom: 25px;
`;

const Body = styled(FlexDivRow)<{ status: string }>`
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => (props.status === StatusEnum.Closed ? '#B8C6E5' : '#F6F6FE')};
`;

export default ProposalCard;
