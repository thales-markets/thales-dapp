import React from 'react';
import styled from 'styled-components';
import { FlexDivRow, FlexDivColumn, FlexDivColumnCentered, FlexDivEnd, FlexDivCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';
// import externalLink from 'remarkable-external-link';

type ProposalDetailsProps = {
    proposal: Proposal;
    onClose: any;
};

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal, onClose }) => {
    const getRawMarkup = (value?: string | null) => {
        const remarkable = new Remarkable({
            html: false,
            breaks: true,
            typographer: false,
        }).use(linkify);
        //.use(externalLink);

        if (!value) return { __html: '' };

        return { __html: remarkable.render(value) };
    };

    return (
        <FlexDivColumnCentered>
            <FlexDivEnd style={{ marginBottom: 20 }}>
                <CloseIconContainer onClick={onClose} />
            </FlexDivEnd>
            <Title>{proposal.title}</Title>
            <FlexDivColumnCentered style={{ alignItems: 'center', marginBottom: 30 }}>
                <Label>Status</Label>
                <StatusWrapper status={proposal.state}>
                    <Status status={proposal.state}>{proposal.state}</Status>
                </StatusWrapper>
            </FlexDivColumnCentered>
            <FlexDivRow style={{ marginBottom: 35 }}>
                <FlexDivColumnCentered>
                    <Label>Status</Label>
                    <Text>{proposal.state}</Text>
                </FlexDivColumnCentered>
                <FlexDivColumnCentered>
                    <Label>Time remaining</Label>
                    <TimeRemaining end={proposal.end * 1000} fontSize={20} />
                </FlexDivColumnCentered>
            </FlexDivRow>
            <BodyTitle>Details</BodyTitle>
            <Divider />
            <Body dangerouslySetInnerHTML={getRawMarkup(proposal?.body)}></Body>
        </FlexDivColumnCentered>
    );
};

const getBackgroundColor = (status: string) => {
    switch (status) {
        case 'pending':
            return '#c991db';
        case 'closed':
            return '#3f2e80';

        default:
            return '#64D9FE';
    }
};

const Title = styled(FlexDivColumnCentered)`
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #f6f6fe;
    margin-bottom: 25px;
`;

const BodyTitle = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
    margin-bottom: 10px;
`;

const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid #748bc6;
    margin-bottom: 20px;
`;

const Label = styled.span`
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #b8c6e5;
    margin-bottom: 5px;
`;

const Text = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #f6f6fe;
    text-transform: uppercase;
`;

const StatusWrapper = styled(FlexDivCentered)<{ status: string }>`
    padding: 1px;
    border-radius: 10px;
    width: 200px;
    background: ${(props) => getBackgroundColor(props.status)};
`;

const Status = styled(FlexDivColumnCentered)<{ status: string }>`
    padding: 15px 0;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 2px;
    color: ${(props) => getBackgroundColor(props.status)};
    background: #04045a;
    border-radius: 10px;
    text-transform: uppercase;
    width: 198px;
`;

const CloseIconContainer = styled(CloseIcon)`
    padding: 9px;
    height: 30px;
    width: 30px;
    :hover {
        cursor: pointer;
    }
`;

const Body = styled(FlexDivColumn)`
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: #b8c6e5;
    p {
        margin-bottom: 15px;
    }
    a {
        color: #ffffff;
        &:hover {
            color: #00f9ff;
        }
    }
    table {
        overflow-y: auto;
        display: block;
        th,
        td {
            border: 1px solid rgba(202, 145, 220, 0.2);
            padding: 6px 13px;
        }
    }
    h2 {
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        color: #f6f6fe;
        margin-top: 24px;
        margin-bottom: 16px;
    }
`;

export default ProposalDetails;
