import React, { useEffect, useState } from 'react';
import { FlexDivRow, FlexDivRowCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { truncateAddress } from 'utils/formatters/string';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { getEtherscanAddressLink, getEtherscanBlockLink } from 'utils/etherscan';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { useTranslation } from 'react-i18next';
import { StyledLink, Blockie } from '../styled-components';
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
import {
    DetailsTitle,
    Divider,
    VotingPowerTitle,
    ArrowIcon,
    Container,
    Title,
    StatusContainer,
    Label,
    StatusWrapper,
    Status,
    DetailsWrapper,
    DetailsContainer,
    Text,
    VoteHeader,
    VoteNote,
    Body,
} from './styled-components';

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

export default ProposalDetails;
