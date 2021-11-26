import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivCentered, FlexDivRowCentered, FlexDiv, FlexDivSpaceBetween } from 'theme/common';
import { Proposal } from 'types/governance';
import { useTranslation } from 'react-i18next';
import { DetailsTitle, Divider, VoteContainer, VoteButton, VoteConfirmation } from 'pages/Governance/components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import axios from 'axios';
import { refetchProposal } from 'utils/queryConnector';
import { dispatchMarketNotification } from 'utils/options';
import { percentageOfTotal } from 'utils/voting/weighted';
import { MESSAGE_VERSION, MESSAGE_VOTE_TYPE, SNAPSHOT_MESSAGE_API_URL, ProposalTypeEnum } from 'constants/governance';
import ValidationMessage from 'components/ValidationMessage';
import voting from 'utils/voting';

type WeightedVotingProps = {
    proposal: Proposal;
};

const WeightedVoting: React.FC<WeightedVotingProps> = ({ proposal }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [selectedChoices, setSelectedChoices] = useState<number[]>(new Array(proposal.choices.length + 1).fill(0));
    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    function addVote(i: number, selectedChoices: number[]) {
        selectedChoices[i] = selectedChoices[i] ? (selectedChoices[i] += 1) : 1;
    }

    function removeVote(i: number, selectedChoices: number[]) {
        if (selectedChoices[i]) selectedChoices[i] = selectedChoices[i] < 1 ? 0 : (selectedChoices[i] -= 1);
    }

    function percentage(i: number, selectedChoices: number[]) {
        const newSelectedChoices = selectedChoices.map((choice) => {
            if (choice) {
                return choice;
            }
            return 0;
        });

        return Math.round(percentageOfTotal(i + 1, newSelectedChoices, Object.values(newSelectedChoices)) * 10) / 10;
    }

    const handleVote = async () => {
        setTxErrorMessage(null);
        setIsVoting(true);
        try {
            const formattedChoices = { ...selectedChoices };
            delete formattedChoices[0];
            const msg: any = {
                address: walletAddress,
                msg: JSON.stringify({
                    version: MESSAGE_VERSION,
                    timestamp: (Date.now() / 1e3).toFixed(),
                    type: MESSAGE_VOTE_TYPE,
                    space: proposal.space.id,
                    payload: { proposal: proposal.id, choice: formattedChoices, metadata: {} },
                }),
            };

            console.log(msg);

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

    const isOptionSelected = selectedChoices.find((choice) => choice > 0);
    const formattedChoiceString = new voting[ProposalTypeEnum.Weighted](
        proposal,
        [],
        [],
        selectedChoices
    ).getChoiceString();

    return (
        <>
            <DetailsTitle>{t(`governance.proposal.vote-label`)}</DetailsTitle>
            <Divider />
            <VoteContainer>
                {proposal.choices.map((choice: any, i: number) => {
                    const selectedChoiceValue = selectedChoices[i + 1] ?? 0;
                    const selected = selectedChoiceValue > 0;

                    return (
                        <Weighted key={choice} className={selected ? 'selected' : ''}>
                            <Option>{choice}</Option>
                            <Selection>
                                <PlusMinus
                                    onClick={() => {
                                        const newSelectedChoices = [...selectedChoices];
                                        removeVote(i + 1, newSelectedChoices);
                                        setSelectedChoices(newSelectedChoices);
                                    }}
                                >
                                    -
                                </PlusMinus>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={selectedChoiceValue}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        const parsedInt = parseInt(value);
                                        const newSelectedChoices = [...selectedChoices];
                                        if (isNaN(parsedInt)) {
                                            newSelectedChoices[i + 1] = 0;
                                        } else {
                                            newSelectedChoices[i + 1] = parsedInt;
                                        }
                                        setSelectedChoices(newSelectedChoices);
                                    }}
                                    onFocus={(e) => e.target.select()}
                                />
                                <PlusMinus
                                    onClick={() => {
                                        const newSelectedChoices = [...selectedChoices];
                                        addVote(i + 1, newSelectedChoices);
                                        setSelectedChoices(newSelectedChoices);
                                    }}
                                >
                                    +
                                </PlusMinus>
                                <Percentage>{percentage(i, selectedChoices)}%</Percentage>
                            </Selection>
                        </Weighted>
                    );
                })}
                {isOptionSelected && (
                    <VoteConfirmation>
                        {t(`governance.proposal.vote-confirmation`, { choice: formattedChoiceString })}
                    </VoteConfirmation>
                )}
            </VoteContainer>
            <FlexDivCentered>
                <VoteButton disabled={!isOptionSelected || isVoting} onClick={handleVote}>
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

const Weighted = styled(FlexDivSpaceBetween)`
    height: 60px;
    border: 2px solid #748bc6;
    border-radius: 5px;
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 20px;
    line-height: 56px;
    color: #b8c6e5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &.selected {
        border: 2px solid #64d9fe;
        color: #f6f6fe;
        background: #03044e;
        input {
            color: #f6f6fe;
        }
    }
    &:hover {
        border: 2px solid #64d9fe;
        color: #f6f6fe;
        background: #03044e;
        input {
            color: #f6f6fe;
        }
    }
`;

const Option = styled(FlexDivRowCentered)`
    padding-left: 30px;
`;

const Selection = styled(FlexDiv)`
    width: 250px;
`;

const PlusMinus = styled(FlexDivColumnCentered)`
    text-align: center;
    max-width: 45px;
    border-left: 2px solid #748bc6;
    border-right: 2px solid #748bc6;
    &:hover {
        border-left: 2px solid #64d9fe;
        border-right: 2px solid #64d9fe;
        cursor: pointer;
    }
`;

const Percentage = styled(FlexDivColumnCentered)`
    text-align: right;
    max-width: 100px;
    padding-right: 10px;
`;

const Input = styled.input`
    background: transparent;
    border: none;
    display: block;
    padding: 0 10px;
    outline: none !important;
    max-width: 60px;
    font-weight: bold;
    font-size: 20px;
    color: #b8c6e5;
    text-align: right;
    overfloe: hidden;
    text-overflow: ellipsis;
`;

export default WeightedVoting;
