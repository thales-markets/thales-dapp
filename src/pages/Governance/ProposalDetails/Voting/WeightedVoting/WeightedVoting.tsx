import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivCentered, FlexDivRowCentered, FlexDiv, FlexDivSpaceBetween } from 'theme/common';
import { Proposal } from 'types/governance';
import { useTranslation } from 'react-i18next';
import { DetailsTitle, Divider } from 'pages/Governance/components';
import { DefaultSubmitButton } from 'pages/Options/Market/components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import axios from 'axios';
import { refetchProposal } from 'utils/queryConnector';
import { dispatchMarketNotification } from 'utils/options';
import { percentageOfTotal } from 'utils/voting/weighted';

type WeightedVotingProps = {
    proposal: Proposal;
};

export const MESSAGE_URL = `https://hub.snapshot.org/api/message`;

const WeightedVoting: React.FC<WeightedVotingProps> = ({ proposal }) => {
    const { t } = useTranslation();
    const [selectedChoices, setSelectedChoices] = useState<number[]>(new Array(proposal.choices.length + 1).fill(0));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

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
        const version = '0.1.3';
        const formattedChoices = { ...selectedChoices };
        delete formattedChoices[0];
        console.log(formattedChoices);
        const msg: any = {
            address: walletAddress,
            msg: JSON.stringify({
                version,
                timestamp: (Date.now() / 1e3).toFixed(),
                type: 'vote',
                space: proposal.space.id,
                payload: { proposal: proposal.id, choice: formattedChoices, metadata: {} },
            }),
        };

        msg.sig = await (snxJSConnector as any).signer.signMessage(msg.msg);

        await axios.post(MESSAGE_URL, msg, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        dispatchMarketNotification('Successfully voted');
        refetchProposal(proposal.space.id, proposal.id, walletAddress);
    };

    return (
        <>
            <DetailsTitle>{t(`governance.proposal.vote-label`)}</DetailsTitle>
            <Divider />
            <Container>
                {proposal.choices.map((choice: any, i: number) => {
                    const selectedChoiceValue = selectedChoices[i + 1] ?? 0;
                    const selected = selectedChoiceValue > 0;

                    return (
                        <SingleChoice key={choice} className={selected ? 'selected' : ''}>
                            <InnerContainer>
                                <FlexDivRowCentered>{choice}</FlexDivRowCentered>
                                <FlexDiv style={{ width: '260px' }}>
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
                                </FlexDiv>
                            </InnerContainer>
                        </SingleChoice>
                    );
                })}
            </Container>
            <FlexDivCentered>
                <VoteButton onClick={handleVote}>{t(`governance.proposal.vote-label`)}</VoteButton>
            </FlexDivCentered>
        </>
    );
};

const Container = styled(FlexDivColumnCentered)`
    margin-top: 15px;
`;

const SingleChoice = styled(FlexDivColumnCentered)`
    height: 60px;
    border: 2px solid #748bc6;
    border-radius: 5px;
    margin-bottom: 20px;
    &.selected {
        border: 2px solid #64d9fe;
        color: #f6f6fe;
        background: #f6f6fe;
        input {
            color: #f6f6fe;
        }
        div {
            color: #f6f6fe;
        }
    }
    &:hover {
        border: 2px solid #64d9fe;
        color: #f6f6fe;
        background: #f6f6fe;
        input {
            color: #f6f6fe;
        }
        div {
            color: #f6f6fe;
        }
    }
`;

const InnerContainer = styled(FlexDivSpaceBetween)`
    background: #04045a;
    border-radius: 5px;
    font-weight: bold;
    font-size: 20px;
    line-height: 48px;
    color: #b8c6e5;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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
    padding: 0 6px;
    outline: none !important;
    max-width: 70px;
    font-weight: bold;
    font-size: 20px;
    color: #b8c6e5;
    text-align: right;
`;

const VoteButton = styled(DefaultSubmitButton)`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 264px;
    height: 48px;
`;

export default WeightedVoting;
