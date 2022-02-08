import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import axios from 'axios';

import { UserCardSectionHeader } from 'theme/common';

import { useTranslation } from 'react-i18next';

import useDisplayNameQuery from 'queries/user/useDisplayNameQuery';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';

const ethEnabled = () => {
    if (window.ethereum) {
        window.web3 = new Web3(Web3.givenProvider) as any;
        return true;
    }
    return false;
};

const DisplayNameForm: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const displayNameQuery = useDisplayNameQuery(walletAddress, { enabled: true });
    const currentDisplayName = displayNameQuery.isSuccess ? displayNameQuery.data.name : '';

    const [displayName, setDisplayName] = useState(currentDisplayName);

    const dispatchDisplayName = async (walletAddress: string, displayName: string) => {
        if (!ethEnabled()) {
            alert('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!');
        }

        (window.web3?.eth as any).personal.sign(displayName, walletAddress, async (_test: any, signature: any) => {
            try {
                await axios.post('https://api.thales.market/display-name', {
                    walletAddress,
                    displayName,
                    signature,
                });
                displayNameQuery.refetch();
            } catch (e) {
                console.log(e);
            }
        });
    };

    useEffect(() => {
        if (currentDisplayName !== '') setDisplayName(currentDisplayName);
    }, [currentDisplayName]);

    const { t } = useTranslation();

    return (
        <Wrapper>
            <UserCardSectionHeader>{t('common.user-info-card.display-name')}</UserCardSectionHeader>
            <DisplayNameInput value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            <Button onClick={() => dispatchDisplayName(walletAddress, displayName)}>
                {t('common.user-info-card.change-display-name')}
            </Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px 0px;
`;

const DisplayNameInput = styled.input`
    margin: 7px 0px;
    border: 2px solid var(--icon-color);
    color: var(--icon-color);
    background: rgba(0, 0, 0, 0);
    border-radius: 20px;
    text-align: center;
    font-size: 12.5px;
    line-height: 14px;
    width: 100%;
    padding: 0px 5px;
    height: 28px;
    &:focus {
        border: 2px solid var(--icon-color);
        font-size: 12.5px;
        line-height: 14px;
    }
`;

const Button = styled.div`
    width: 100%;
    background-color: var(--input-border-color);
    font-size: 11px;
    font-family: Titillium Regular !important;
    color: var(--background);
    font-weight: 600;
    border-radius: 20px;
    padding-top: 6px;
    padding-bottom: 6px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
`;

export default DisplayNameForm;
