import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivCentered } from 'theme/common';
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

type SingleChoiceVotingProps = {
    proposal: Proposal;
};

export const MESSAGE_URL = `https://hub.snapshot.org/api/message`;

const SingleChoiceVoting: React.FC<SingleChoiceVotingProps> = ({ proposal }) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<number | undefined>(undefined);
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const handleVote = async () => {
        const version = '0.1.3';
        const msg: any = {
            address: walletAddress,
            msg: JSON.stringify({
                version,
                timestamp: (Date.now() / 1e3).toFixed(),
                type: 'vote',
                space: proposal.space.id,
                payload: { proposal: proposal.id, choice: selected, metadata: {} },
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
                    return (
                        <SingleChoice
                            key={choice}
                            className={selected === i + 1 ? 'selected' : ''}
                            onClick={() => setSelected(i + 1)}
                        >
                            <InnerContainer>{choice}</InnerContainer>
                        </SingleChoice>
                    );
                })}
            </Container>
            <FlexDivCentered>
                <VoteButton disabled={!selected} onClick={handleVote}>
                    {t(`governance.proposal.vote-label`)}
                </VoteButton>
            </FlexDivCentered>
        </>
    );
};

const Container = styled(FlexDivColumnCentered)`
    margin-top: 15px;
`;

const SingleChoice = styled(FlexDivColumnCentered)`
    height: 60px;
    border: 1px solid #748bc6;
    border-radius: 5px;
    margin-bottom: 20px;
    &.selected {
        border: 1px solid #64d9fe;
        color: #f6f6fe;
        background: #f6f6fe;
        div {
            border: 1px solid #64d9fe;
            color: #f6f6fe;
        }
    }
    &:hover {
        border: 1px solid #64d9fe;
        color: #f6f6fe;
        cursor: pointer;
        background: #f6f6fe;
        div {
            border: 1px solid #64d9fe;
            color: #f6f6fe;
        }
    }
`;

const InnerContainer = styled(FlexDivColumnCentered)`
    background: #04045a;
    border: 1px solid #04045a;
    border-radius: 5px;
    font-weight: bold;
    font-size: 20px;
    line-height: 48px;
    color: #b8c6e5;
    text-align: center;
`;

const VoteButton = styled(DefaultSubmitButton)`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 264px;
    height: 48px;
`;

export default SingleChoiceVoting;
