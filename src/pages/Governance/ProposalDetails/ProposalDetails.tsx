import React from 'react';
import styled from 'styled-components';
import { FlexDivRow, FlexDivColumn, FlexDivColumnCentered, FlexDivCentered, FlexDivRowCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { truncateAddress } from 'utils/formatters/string';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { getEtherscanAddressLink, getEtherscanBlockLink } from 'utils/etherscan';
import { formatCurrency } from 'utils/formatters/number';
import { useTranslation } from 'react-i18next';
import { ArrowIcon, getColor, StyledLink } from '../components';
import { NetworkId } from '@synthetixio/contracts-interface';

type ProposalDetailsProps = {
    proposal: Proposal;
};

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
    const { t } = useTranslation();

    const getRawMarkup = (value?: string | null) => {
        const remarkable = new Remarkable({
            html: false,
            breaks: true,
            typographer: false,
        }).use(linkify);

        if (!value) return { __html: '' };

        return { __html: remarkable.render(value) };
    };

    return (
        <Container>
            <Title>{proposal.title}</Title>
            <StatusContainer>
                <Label>{t(`governance.proposal.status-label`)}</Label>
                <StatusWrapper status={proposal.state}>
                    <Status status={proposal.state}>{t(`governance.status.${proposal.state}`)}</Status>
                </StatusWrapper>
            </StatusContainer>
            <FlexDivRow>
                <DetailsContainer>
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.author-label`)}</Text>
                        <StyledLink
                            href={getEtherscanAddressLink(NetworkId.Mainnet, proposal.author)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Text>{truncateAddress(proposal.author)}</Text>
                            <ArrowIcon />
                        </StyledLink>
                    </FlexDivRowCentered>
                    <Divider />
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.snapshot-label`)}</Text>
                        <StyledLink
                            href={getEtherscanBlockLink(NetworkId.Mainnet, proposal.snapshot)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Text>{formatCurrency(proposal.snapshot, 0)}</Text>
                            <ArrowIcon />
                        </StyledLink>
                    </FlexDivRowCentered>
                </DetailsContainer>
                <DetailsContainer>
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.start-date-label`)}</Text>
                        <Text>{formatShortDateWithTime(proposal.start * 1000)}</Text>
                    </FlexDivRowCentered>
                    <Divider />
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.end-date-label`)}</Text>
                        <Text>{formatShortDateWithTime(proposal.end * 1000)}</Text>
                    </FlexDivRowCentered>
                </DetailsContainer>
            </FlexDivRow>
            <BodyTitle>{t(`governance.proposal.details-label`)}</BodyTitle>
            <Divider />
            <Body dangerouslySetInnerHTML={getRawMarkup(proposal.body)}></Body>
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    padding: 10px;
`;

const StatusContainer = styled(FlexDivColumnCentered)`
    margin-bottom: 30px;
    align-items: center;
`;

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
    &:first-child {
        margin-right: 40px;
    }
`;

const BodyTitle = styled(FlexDivRow)`
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
    margin-bottom: 10px;
    margin-top: 40px;
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
    background: ${(props) => getColor(props.status)};
`;

const Status = styled(FlexDivColumnCentered)<{ status: string }>`
    height: 48px;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 2px;
    color: ${(props) => getColor(props.status)};
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
