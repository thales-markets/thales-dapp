import React from 'react';
import styled from 'styled-components';
import { FlexDivRow, FlexDivColumn, FlexDivColumnCentered, FlexDivCentered, FlexDivRowCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { truncateAddress } from 'utils/formatters/string';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { getEtherscanAddressLink, getEtherscanBlockLink } from 'utils/etherscan';
import { formatCurrency } from 'utils/formatters/number';
// import externalLink from 'remarkable-external-link';

type ProposalDetailsProps = {
    proposal: Proposal;
};

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
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
        <FlexDivColumnCentered style={{ padding: 10 }}>
            <Title>{proposal.title}</Title>
            <FlexDivColumnCentered style={{ alignItems: 'center', marginBottom: 30 }}>
                <Label>Status</Label>
                <StatusWrapper status={proposal.state}>
                    <Status status={proposal.state}>{proposal.state}</Status>
                </StatusWrapper>
            </FlexDivColumnCentered>
            <FlexDivRow style={{ marginBottom: 40 }}>
                <DetailsContainer style={{ marginRight: 40 }}>
                    <FlexDivRowCentered>
                        <Text>Author</Text>
                        <StyledLink href={getEtherscanAddressLink(1, proposal.author)} target="_blank" rel="noreferrer">
                            <Text>{truncateAddress(proposal.author)}</Text>
                            <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                        </StyledLink>
                    </FlexDivRowCentered>
                    <Divider />
                    <FlexDivRowCentered>
                        <Text>Snapshot</Text>
                        <StyledLink href={getEtherscanBlockLink(1, proposal.snapshot)} target="_blank" rel="noreferrer">
                            <Text>{formatCurrency(proposal.snapshot, 0)}</Text>
                            <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                        </StyledLink>
                    </FlexDivRowCentered>
                </DetailsContainer>
                <DetailsContainer>
                    <FlexDivRowCentered>
                        <Text>Start date</Text>
                        <Text>{formatShortDateWithTime(proposal.start * 1000)}</Text>
                    </FlexDivRowCentered>
                    <Divider />
                    <FlexDivRowCentered>
                        <Text>End date</Text>
                        <Text>{formatShortDateWithTime(proposal.end * 1000)}</Text>
                    </FlexDivRowCentered>
                </DetailsContainer>
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
            return '#748BC6';
        case 'closed':
            return '#8208FC';
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
    margin-bottom: 40px;
`;

const DetailsContainer = styled(FlexDivColumnCentered)`
    padding: 15px;
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    border-radius: 5px;
    border: 2px solid #242371;
    color: #f6f6fe;
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

const Label = styled.span`
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #b8c6e5;
    margin-bottom: 5px;
`;

const StyledLink = styled.a`
    color: #f6f6fe;
    &path {
        fill: #f6f6fe;
    }
    &:hover {
        color: #00f9ff;
        & path {
            fill: #00f9ff;
        }
    }
`;

const ArrowIcon = styled(ArrowHyperlinkIcon)``;

const Text = styled.span`
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
`;

const StatusWrapper = styled(FlexDivCentered)<{ status: string }>`
    padding: 1px;
    border-radius: 10px;
    width: 200px;
    background: ${(props) => getBackgroundColor(props.status)};
`;

const Status = styled(FlexDivColumnCentered)<{ status: string }>`
    height: 48px;
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

const Body = styled(FlexDivColumn)`
    margin-top: 15px;
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
