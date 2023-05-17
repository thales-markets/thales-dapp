import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FlexDivRow, FlexDivColumn, FlexDivColumnCentered, FlexDivCentered, FlexDivRowCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { truncateAddress } from 'utils/formatters/string';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { getEtherscanAddressLink, getEtherscanBlockLink } from 'utils/etherscan';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { useTranslation } from 'react-i18next';
import { ArrowIcon, DetailsTitle, Divider, getColor, StyledLink, Blockie, VotingPowerTitle } from '../components';
import { Network } from 'utils/network';
import { ProposalTypeEnum, SpaceKey, StatusEnum } from 'constants/governance';
import SingleChoiceVoting from './Voting/SingleChoiceVoting';
import WeightedVoting from './Voting/WeightedVoting';
import snxJSConnector from 'utils/snxJSConnector';
import makeBlockie from 'ethereum-blockies-base64';
import { getProposalApprovalData, getProposalUrl } from 'utils/governance';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import useVotingPowerQuery from 'queries/governance/useVotingPowerQuery';

type ProposalDetailsProps = {
    proposal: Proposal;
};

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [authorEns, setAuthorEns] = useState<string | null>(null);
    const { numberOfCouncilMembers, proposalApprovalVotes } = getProposalApprovalData(proposal.start);

    const votingPowerQuery = useVotingPowerQuery(proposal, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const votingPower: number = votingPowerQuery.isSuccess && votingPowerQuery.data ? votingPowerQuery.data : 0;

    const getRawMarkup = (value?: string | null) => {
        const remarkable = new Remarkable({
            html: false,
            breaks: true,
            typographer: false,
        }).use(linkify);

        if (!value) return { __html: '' };

        return { __html: remarkable.render(value) };
    };

    useEffect(() => {
        const fetchAuthorEns = async () => {
            const authorEns = await (snxJSConnector as any).provider.lookupAddress(proposal.author);
            setAuthorEns(authorEns);
        };
        if (networkId === Network.Mainnet) {
            fetchAuthorEns();
        }
    }, [proposal]);

    return (
        <Container>
            <Title>{proposal.title}</Title>
            <StatusContainer>
                <Label>{t(`governance.proposal.status-label`)}</Label>
                <StatusWrapper status={proposal.state}>
                    <Status status={proposal.state}>{t(`governance.status.${proposal.state}`)}</Status>
                </StatusWrapper>
            </StatusContainer>
            <DetailsWrapper>
                <DetailsContainer>
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.author-label`)}</Text>
                        <StyledLink
                            href={getEtherscanAddressLink(Network.Mainnet, proposal.author)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Blockie
                                src={makeBlockie(proposal.author)}
                                style={{ width: '16px', height: '16px', marginBottom: '-3px' }}
                            />
                            <Text>{authorEns != null ? authorEns : truncateAddress(proposal.author)}</Text>
                            <ArrowIcon />
                        </StyledLink>
                    </FlexDivRowCentered>
                    <Divider />
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.proposal-label`)}</Text>
                        <StyledLink
                            href={getProposalUrl(proposal.space.id, proposal.id)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Text>{truncateAddress(proposal.id)}</Text>
                            <ArrowIcon />
                        </StyledLink>
                    </FlexDivRowCentered>
                    <Divider />
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.voting-system-label`)}</Text>
                        <Text style={{ textAlign: 'right' }}>{t(`governance.proposal.type.${proposal.type}`)}</Text>
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
                    <Divider />
                    <FlexDivRowCentered>
                        <Text>{t(`governance.proposal.snapshot-label`)}</Text>
                        <StyledLink
                            href={getEtherscanBlockLink(Network.Mainnet, proposal.snapshot)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Text>{formatCurrency(proposal.snapshot, 0)}</Text>
                            <ArrowIcon />
                        </StyledLink>
                    </FlexDivRowCentered>
                </DetailsContainer>
            </DetailsWrapper>
            <DetailsTitle>{t(`governance.proposal.details-label`)}</DetailsTitle>
            <Divider />
            <Body dangerouslySetInnerHTML={getRawMarkup(proposal.body)}></Body>
            {proposal.state === StatusEnum.Active && (
                <>
                    <VoteHeader>
                        <FlexDivRow>
                            <DetailsTitle>{t(`governance.proposal.vote-label`)}</DetailsTitle>
                            {proposal.space.id === SpaceKey.TIPS && (
                                <VoteNote>
                                    (
                                    {t(`governance.proposal.vote-note`, {
                                        approvalVotes: proposalApprovalVotes,
                                        totalVotes: numberOfCouncilMembers,
                                    })}
                                    )
                                </VoteNote>
                            )}
                        </FlexDivRow>
                        <VotingPowerTitle>{`${t(`governance.proposal.voting-power-label`)}: ${
                            isWalletConnected && !votingPowerQuery.isLoading
                                ? formatCurrencyWithKey(proposal.space.symbol, votingPower)
                                : '-'
                        }`}</VotingPowerTitle>
                    </VoteHeader>
                    <Divider />
                </>
            )}
            {proposal.state === StatusEnum.Active && proposal.type === ProposalTypeEnum.Single && (
                <SingleChoiceVoting proposal={proposal} hasVotingRights={votingPower > 0} />
            )}
            {proposal.state === StatusEnum.Active && proposal.type === ProposalTypeEnum.Weighted && (
                <WeightedVoting proposal={proposal} hasVotingRights={votingPower > 0} />
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    padding: 10px 40px;
    @media (max-width: 767px) {
        padding: 10px 20px;
    }
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

const DetailsWrapper = styled(FlexDivRow)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const DetailsContainer = styled(FlexDivColumnCentered)`
    padding: 15px;
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    border-radius: 5px;
    border: 2px solid #242371;
    color: #f6f6fe;
    &:first-child {
        margin-right: 40px;
        @media (max-width: 767px) {
            flex-direction: column;
            margin-right: 0px;
            margin-bottom: 10px;
        }
    }
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
    background: var(--color-primary);
    border-radius: 10px;
    text-transform: uppercase;
    width: 198px;
`;

const Body = styled(FlexDivColumn)`
    margin-top: 15px;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
    p {
        margin-bottom: 15px;
    }
    a {
        color: #b8c6e5;
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

const VoteHeader = styled(FlexDivRowCentered)`
    @media (max-width: 767px) {
        flex-direction: column;
        align-items: start;
    }
`;

const VoteNote = styled(FlexDivRow)`
    font-weight: 300;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #b8c6e5;
    text-transform: uppercase;
    margin-top: 42px;
    margin-left: 5px;
`;

export default ProposalDetails;
