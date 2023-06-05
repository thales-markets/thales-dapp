import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
import Button from 'components/ButtonV2/Button';
import ValidationMessage from 'components/ValidationMessage';
import { ProposalTypeEnum } from 'enums/governance';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { VoteConfirmation, VoteContainer } from 'pages/Governance/styled-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { dispatchMarketNotification } from 'utils/options';
import { refetchProposal } from 'utils/queryConnector';
import voting from 'utils/voting';

type SingleChoiceVotingProps = {
    proposal: Proposal;
    hasVotingRights: boolean;
};

const SingleChoiceVoting: React.FC<SingleChoiceVotingProps> = ({ proposal, hasVotingRights }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [selectedChoices, setSelectedChoices] = useState<number | undefined>(undefined);
    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const handleVote = async () => {
        setTxErrorMessage(null);
        setIsVoting(true);
        try {
            const hub = 'https://hub.snapshot.org';
            const client = new snapshot.Client712(hub);

            // using Web3Provider instead of wagmi provider due to an error _signTypedData is not a function
            await client.vote(new Web3Provider(window.ethereum as any, 'any'), walletAddress, {
                space: proposal.space.id,
                proposal: proposal.id,
                type: proposal.type as ProposalType,
                choice: Number(selectedChoices),
                reason: '',
                app: 'thales',
            });

            refetchProposal(proposal.space.id, proposal.id, walletAddress);
            dispatchMarketNotification(t('governance.proposal.vote-confirmation-message'));
            setIsVoting(false);
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsVoting(false);
        }
    };

    const formattedChoiceString = new voting[ProposalTypeEnum.Single](
        proposal,
        [],
        [],
        selectedChoices
    ).getChoiceString();

    return (
        <>
            <VoteContainer>
                {proposal.choices.map((choice: any, i: number) => {
                    return (
                        <SingleChoice
                            key={choice}
                            className={selectedChoices === i + 1 ? 'selected' : ''}
                            onClick={() => setSelectedChoices(i + 1)}
                        >
                            {choice}
                        </SingleChoice>
                    );
                })}
                {selectedChoices && hasVotingRights && (
                    <VoteConfirmation>
                        {t(`governance.proposal.vote-confirmation`, { choice: formattedChoiceString })}
                    </VoteConfirmation>
                )}
            </VoteContainer>
            <FlexDivCentered>
                <Button
                    disabled={!selectedChoices || isVoting || !hasVotingRights}
                    onClick={handleVote}
                    margin="20px 0"
                >
                    {!isVoting
                        ? t(`governance.proposal.submit-vote-label`)
                        : t(`governance.proposal.vote-progress-label`)}
                </Button>
            </FlexDivCentered>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
        </>
    );
};

const SingleChoice = styled(FlexDivColumnCentered)`
    box-sizing: content-box;
    height: 48px;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 5px;
    margin-bottom: 20px;
    color: ${(props) => props.theme.textColor.primary};
    font-weight: bold;
    font-size: 20px;
    line-height: 48px;
    text-align: center;
    &.selected {
        margin: -1px;
        margin-bottom: 19px;
        border: 2px solid ${(props) => props.theme.borderColor.quaternary};
    }
    &:hover {
        margin: -1px;
        margin-bottom: 19px;
        border: 2px solid ${(props) => props.theme.borderColor.quaternary};
        cursor: pointer;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 46px;
        font-size: 16px;
        line-height: 46px;
    }
`;

export default SingleChoiceVoting;
