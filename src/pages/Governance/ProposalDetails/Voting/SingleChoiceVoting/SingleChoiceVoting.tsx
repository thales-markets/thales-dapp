import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { useTranslation } from 'react-i18next';
import { VoteContainer, VoteButton, VoteConfirmation } from 'pages/Governance/components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import axios from 'axios';
import { refetchProposal } from 'utils/queryConnector';
import { dispatchMarketNotification } from 'utils/options';
import { MESSAGE_VERSION, MESSAGE_VOTE_TYPE, SNAPSHOT_MESSAGE_API_URL, ProposalTypeEnum } from 'constants/governance';
import ValidationMessage from 'components/ValidationMessage';
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
            const msg: any = {
                address: walletAddress,
                msg: JSON.stringify({
                    version: MESSAGE_VERSION,
                    timestamp: (Date.now() / 1e3).toFixed(),
                    type: MESSAGE_VOTE_TYPE,
                    space: proposal.space.id,
                    payload: { proposal: proposal.id, choice: selectedChoices, metadata: {} },
                }),
            };

            msg.sig = await (snxJSConnector as any).signer.signMessage(msg.msg);

            await axios.post(SNAPSHOT_MESSAGE_API_URL, msg, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
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
                <VoteButton disabled={!selectedChoices || isVoting || !hasVotingRights} onClick={handleVote}>
                    {!isVoting ? t(`governance.proposal.vote-label`) : t(`governance.proposal.vote-progress-label`)}
                </VoteButton>
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
    height: 60px;
    border: 2px solid #748bc6;
    border-radius: 5px;
    margin-bottom: 20px;
    color: #b8c6e5;
    font-weight: bold;
    font-size: 20px;
    line-height: 48px;
    text-align: center;
    &.selected {
        border: 2px solid #64d9fe;
        color: #f6f6fe;
        background: #03044e;
    }
    &:hover {
        border: 2px solid #64d9fe;
        color: #f6f6fe;
        cursor: pointer;
        background: #03044e;
    }
    @media (max-width: 767px) {
        height: 50px;
        font-size: 16px;
        line-height: 46px;
    }
`;

export default SingleChoiceVoting;
