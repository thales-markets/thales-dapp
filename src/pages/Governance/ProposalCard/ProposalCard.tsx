import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow, FlexDivRowCentered, FlexDivCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { getCurrentTimestampSeconds } from 'utils/formatters/date';

type ProposalCardProps = {
    proposal: Proposal;
    onClick: any;
};

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onClick }) => {
    const currentTimestampSeconds = getCurrentTimestampSeconds();
    const closed = proposal.end < currentTimestampSeconds ? true : false;
    const pending = currentTimestampSeconds < proposal.start ? true : false;
    const body = proposal.body.length > 200 ? `${proposal.body.substring(0, 200)} ...` : proposal.body;

    return (
        <Card className="cardWrapper" status={proposal.state} onClick={onClick}>
            <Container>
                <FlexDivRowCentered style={{ marginBottom: 25 }}>
                    <Status status={proposal.state}>{proposal.state}</Status>
                    {!closed && (
                        <div>
                            <span>{pending ? 'Starts in: ' : 'Ends in: '}</span>
                            <TimeRemaining end={(pending ? proposal.start : proposal.end) * 1000} fontSize={16} />
                        </div>
                    )}
                </FlexDivRowCentered>
                <Title status={proposal.state}>{proposal.title}</Title>
                <Body status={proposal.state}>{body}</Body>
            </Container>
        </Card>
    );
};

const getBackgroundColor = (status: string) => {
    switch (status) {
        case 'pending':
            return '#748BC6';
        case 'closed':
            return '#8208FC';
        default:
            return '#64D9FE';
    }
};

export const Card = styled(FlexDivColumnCentered)<{ status: string }>`
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
    @media (max-width: 767px) {
        max-width: 400px;
        @supports (-webkit-touch-callout: none) {
            height: 51vmin;
        }
    }
    &:hover {
        background: #64d9fe;
        box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    }
`;

const Container = styled.div`
    border-radius: 15px;
    background: #04045a;
    width: 100%;
    height: 100%;
    padding: 20px;
`;

const Status = styled(FlexDivCentered)<{ status: string }>`
    font-weight: bold;
    color: ${(props) => getBackgroundColor(props.status)};
    text-transform: uppercase;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.5px;
    border: 2px solid ${(props) => getBackgroundColor(props.status)};
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
    color: ${(props) => (props.status === 'active' ? '#F6F6FE' : '#B8C6E5')};
    margin-bottom: 25px;
`;

const Body = styled(FlexDivRow)<{ status: string }>`
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => (props.status === 'active' ? '#F6F6FE' : '#B8C6E5')};
`;

export default ProposalCard;
