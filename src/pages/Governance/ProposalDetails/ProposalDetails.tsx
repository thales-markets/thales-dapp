import React from 'react';
import styled from 'styled-components';
import { FlexDivRow, FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { getWalletAddress } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import useProposalQuery from 'queries/governance/useProposalQuery';
// import externalLink from 'remarkable-external-link';

type ProposalDetailsProps = {
    proposal: Proposal;
};

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

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

    const proposalResultsQuery = useProposalQuery(proposal.space.id, proposal.id, walletAddress);
    const proposalResults =
        proposalResultsQuery.isSuccess && proposalResultsQuery.data ? proposalResultsQuery.data : {};
    console.log(proposalResults);

    return (
        <FlexDivColumnCentered style={{ paddingLeft: 30, paddingRight: 30 }}>
            <Title>{proposal.title}</Title>
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

const Label = styled.span`
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #b8c6e5;
    margin-bottom: 10px;
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

export default ProposalDetails;
