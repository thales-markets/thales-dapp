import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
import Button from 'components/Button/Button';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { ProposalTypeEnum } from 'enums/governance';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { VoteConfirmation, VoteContainer } from 'pages/Governance/styled-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import { Proposal } from 'types/governance';
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

    useEffect(() => {
        if (selectedChoices !== undefined) {
            setSelectedChoices(undefined);
        }
    }, [walletAddress, selectedChoices]);

    const handleVote = async () => {
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
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
            toast.update(id, getSuccessToastOptions(t('governance.proposal.vote-confirmation-message'), id));
            setIsVoting(false);
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
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
                            isDisabled={!hasVotingRights}
                            onClick={() => hasVotingRights && setSelectedChoices(i + 1)}
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
        </>
    );
};

const SingleChoice = styled(FlexDivColumnCentered)<{ isDisabled?: boolean }>`
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
    opacity: ${(props) => (props.isDisabled ? '0.5' : '1')};
    &.selected {
        margin: -1px;
        margin-bottom: 19px;
        border: 2px solid ${(props) => props.theme.borderColor.quaternary};
    }
    &:hover {
        ${(props) => (props.isDisabled ? '' : 'margin: -1px;')}
        ${(props) => (props.isDisabled ? '' : 'margin-bottom: 19px;')}
        ${(props) => (props.isDisabled ? '' : `border: 2px solid ${props.theme.borderColor.quaternary};`)}        
        ${(props) => (props.isDisabled ? '' : 'cursor: pointer;')}
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 46px;
        font-size: 16px;
        line-height: 46px;
    }
`;

export default SingleChoiceVoting;
