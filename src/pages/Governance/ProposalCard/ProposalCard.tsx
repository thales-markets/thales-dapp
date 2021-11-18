import React from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { Proposal } from 'types/governance';

type ProposalCardProps = {
    proposal: Proposal;
    onClick: any;
};

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onClick }) => {
    return (
        <Card className="cardWrapper" isClosed={proposal.state === 'closed'} onClick={onClick}>
            <Container>
                <Status>{proposal.state}</Status>
                <Title>{proposal.title}</Title>
                <Body>{proposal.body.length > 200 ? `${proposal.body.substring(0, 200)} ...` : proposal.body}</Body>
            </Container>
        </Card>
    );
};

export const Card = styled(FlexDivColumnCentered)<{ isClosed: boolean }>`
    width: 100%;
    max-width: 362px;
    align-items: center;
    position: relative;
    background: ${(props) =>
        props.isClosed ? 'linear-gradient(rgba(202, 145, 220, 0.3), rgba(106, 193, 213, 0.3))' : '#64D9FE'};
    height: 320px;
    padding: 2px;
    border-radius: 15px;
    color: #f6f6fe;
    cursor: pointer;
    opacity: ${(props) => (props.isClosed ? 0.6 : 1)};
    @media (max-width: 767px) {
        max-width: 400px;
        @supports (-webkit-touch-callout: none) {
            height: 51vmin;
        }
    }
    &:hover {
        &:after {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 100%;
            height: 100%;
            background: rgba(10, 46, 102, 0.3);
            border-radius: 15px;
        }
    }
`;

const Container = styled.div`
    border-radius: 15px;
    background: #04045a;
    width: 100%;
    height: 100%;
    padding: 20px;
`;

const Status = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: right;
    color: #f6f6fe;
    text-transform: uppercase;
    margin-bottom: 25px;
    justify-content: end;
`;

const Title = styled(FlexDivRow)`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
    margin-bottom: 25px;
`;

const Body = styled(FlexDivRow)`
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: #b8c6e5;
`;

export default ProposalCard;
