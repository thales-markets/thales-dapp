import React from 'react';
import { FlexDivCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { formatNumberShort } from 'utils/formatters/number';
import voting from 'utils/voting';
import { truncateAddress, truncateText } from 'utils/formatters/string';
import {
    Blockie,
    VoteLabel,
    Percentage,
    VoteRow,
    SidebarRowData,
    Votes,
    StyledLink,
    NoVotes,
} from 'pages/Governance/components';
import makeBlockie from 'ethereum-blockies-base64';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { NetworkId } from '@synthetixio/contracts-interface';
import { ProposalTypeEnum } from 'constants/governance';
import { useTranslation } from 'react-i18next';
import { LightMediumTooltip } from 'pages/Options/Market/components';

type HistoryProps = {
    proposal: Proposal;
    votes: any;
};

const History: React.FC<HistoryProps> = ({ proposal, votes }) => {
    const { t } = useTranslation();
    const spaceSymbol = proposal.space.symbol;
    const isWeightedChoice = proposal.type === ProposalTypeEnum.Weighted;
    const hasVotes = votes.length > 0;

    return (
        <>
            {!hasVotes && <NoVotes>{t(`governance.no-votes`)}</NoVotes>}
            {hasVotes &&
                votes.map((vote: any) => {
                    const votes = isWeightedChoice
                        ? new voting[ProposalTypeEnum.Weighted](proposal, [], [], vote.choice).getChoiceString()
                        : proposal.choices[vote.choice - 1];

                    const formattedVotes = truncateText(votes, 12);

                    return (
                        <VoteRow key={vote.voter}>
                            <SidebarRowData>
                                <FlexDivCentered>
                                    <StyledLink
                                        href={getEtherscanAddressLink(NetworkId.Mainnet, vote.voter)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <FlexDivCentered>
                                            <Blockie src={makeBlockie(vote.voter)} />
                                            <VoteLabel>{truncateAddress(vote.voter)}</VoteLabel>
                                        </FlexDivCentered>
                                    </StyledLink>
                                    <LightMediumTooltip title={votes}>
                                        <Votes>{formattedVotes}</Votes>
                                    </LightMediumTooltip>
                                </FlexDivCentered>
                                <Percentage>{`${formatNumberShort(vote.balance)} ${spaceSymbol}`}</Percentage>
                            </SidebarRowData>
                        </VoteRow>
                    );
                })}
        </>
    );
};

export default History;
