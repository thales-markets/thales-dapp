import React, { useEffect, useState } from 'react';
import { FlexDivCentered, FlexDivColumn } from 'theme/common';
import { Proposal, ProposalResults } from 'types/governance';
import { formatNumberShort } from 'utils/formatters/number';
import voting from 'utils/voting';
import { truncateAddress, truncateText } from 'utils/formatters/string';
import {
    Blockie,
    Percentage,
    SidebarRowData,
    Votes,
    StyledLink,
    LoaderContainer,
    ViewMore,
} from 'pages/Governance/styled-components';
import makeBlockie from 'ethereum-blockies-base64';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { Network } from 'enums/network';
import { FIRST_COUNCIL_ELECTIONS_ID } from 'constants/governance';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import SimpleLoader from 'components/SimpleLoader';
import snxJSConnector from 'utils/snxJSConnector';
import Tooltip from 'components/TooltipV2/Tooltip';
import { VoteRow, VoteLabel, NoVotes } from './styled-components';
import { ProposalTypeEnum } from 'enums/governance';

type HistoryProps = {
    proposal: Proposal;
    proposalResults?: ProposalResults;
    isLoading: boolean;
};

const History: React.FC<HistoryProps> = ({ proposal, proposalResults, isLoading }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const spaceSymbol =
        proposal.id.toLowerCase() === FIRST_COUNCIL_ELECTIONS_ID.toLowerCase() ? 'WD' : proposal.space.symbol;
    const isWeightedChoice = proposal.type === ProposalTypeEnum.Weighted;
    const hasVotes = proposalResults && proposalResults.votes.length > 0;
    const [viewCount, setViewCount] = useState<number>(10);

    return (
        <>
            {hasVotes && !isLoading && proposalResults && (
                <FlexDivColumn>
                    {proposalResults.votes.slice(0, viewCount).map((vote: any) => {
                        const votes = isWeightedChoice
                            ? new voting[ProposalTypeEnum.Weighted](proposal, [], [], vote.choice).getChoiceString()
                            : proposal.choices[vote.choice - 1];

                        const formattedVotes = truncateText(votes, 12);

                        return (
                            <VoteRow key={vote.voter}>
                                <SidebarRowData fontWeight={300}>
                                    <FlexDivCentered>
                                        <StyledLink
                                            href={getEtherscanAddressLink(Network.Mainnet, vote.voter)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FlexDivCentered>
                                                <Blockie src={makeBlockie(vote.voter)} />
                                                <Voter address={vote.voter} walletAddress={walletAddress} />
                                            </FlexDivCentered>
                                        </StyledLink>
                                        <Tooltip overlay={votes}>
                                            <Votes>{formattedVotes}</Votes>
                                        </Tooltip>
                                    </FlexDivCentered>
                                    <Percentage>{`${formatNumberShort(vote.balance)} ${spaceSymbol}`}</Percentage>
                                </SidebarRowData>
                            </VoteRow>
                        );
                    })}
                    {proposalResults.votes.length > viewCount && (
                        <FlexDivCentered>
                            <ViewMore onClick={() => setViewCount(viewCount + 10)}>
                                {t(`governance.view-more`)}
                            </ViewMore>
                        </FlexDivCentered>
                    )}
                </FlexDivColumn>
            )}
            {!hasVotes && !isLoading && <NoVotes>{t(`governance.no-votes`)}</NoVotes>}
            {isLoading && (
                <LoaderContainer height={200}>
                    <SimpleLoader />
                </LoaderContainer>
            )}
        </>
    );
};

type StakerCellProps = {
    address: string;
    walletAddress: string;
};

const Voter: React.FC<StakerCellProps> = ({ address, walletAddress }) => {
    const { t } = useTranslation();
    const [voterEns, setVoterEns] = useState<string | null>(null);
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    useEffect(() => {
        const fetchVoterEns = async () => {
            const stakerEns = await (snxJSConnector as any).provider.lookupAddress(address);
            setVoterEns(stakerEns);
        };
        if (networkId === Network.Mainnet) {
            fetchVoterEns();
        }
    }, [address]);

    const voter =
        address.toLowerCase() === walletAddress.toLowerCase()
            ? t(`governance.you`)
            : voterEns != null
            ? truncateText(voterEns, 12)
            : truncateAddress(address);
    const voterTooltip =
        address.toLowerCase() === walletAddress.toLowerCase()
            ? t(`governance.you`)
            : voterEns != null
            ? voterEns
            : address;

    return (
        <Tooltip overlay={voterTooltip}>
            <VoteLabel>{voter}</VoteLabel>
        </Tooltip>
    );
};

export default History;
