import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { FlexDiv, UserCardSectionHeader } from 'theme/common';

import { useTranslation } from 'react-i18next';

import useDisplayNameQuery from 'queries/user/useDisplayNameQuery';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';

const DISPLAY_NAME_REGEX = /^[a-zA-Z0-9 ]+$/;
const AVATAR_LINK_REGEX = /^(.*?)\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|webp)$/;

const DisplayNameForm: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const displayNameQuery = useDisplayNameQuery(walletAddress, { enabled: true });
    const currentDisplayName = displayNameQuery.isSuccess ? displayNameQuery.data.user.name : '';
    const currentAvatar = displayNameQuery.isSuccess ? displayNameQuery.data.user.avatar : '';

    const [displayName, setDisplayName] = useState(currentDisplayName);
    const [avatar, setAvatar] = useState(currentAvatar);

    const isNameValid = useMemo(() => {
        if (avatar !== currentAvatar && displayName !== currentDisplayName) {
            return (
                AVATAR_LINK_REGEX.test(avatar) &&
                avatar !== '' &&
                DISPLAY_NAME_REGEX.test(displayName) &&
                displayName !== ''
            );
        }
        if (displayName !== currentDisplayName) {
            return DISPLAY_NAME_REGEX.test(displayName) && displayName !== '';
        }
        if (avatar !== currentAvatar) {
            return AVATAR_LINK_REGEX.test(avatar) && avatar !== '';
        }
    }, [displayName, avatar]);

    const dispatchDisplayName = async (walletAddress: string, avatar: string, name: string) => {
        const signature = await (snxJSConnector as any).signer.signMessage(name);
        try {
            await axios.post('https://api.thales.market/royale-user-data', {
                walletAddress,
                name,
                avatar,
                signature,
            });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        setDisplayName(currentDisplayName);
    }, [currentDisplayName]);

    useEffect(() => {
        setAvatar(currentAvatar);
    }, [currentAvatar]);

    const { t } = useTranslation();

    return (
        <Wrapper>
            <UserCardSectionHeader> {t('options.royale.edit-user-data-dialog.avatar')}</UserCardSectionHeader>
            <FlexDiv style={{ margin: 10, gap: 20 }}>
                {avatar ? (
                    <UserAvatar src={avatar} style={{ width: 44, height: 44 }} />
                ) : (
                    <i className="icon icon--user-avatar" style={{ fontSize: 44 }} />
                )}
                <DisplayNameInput value={avatar} onChange={(event) => setAvatar(event.target.value)} />
            </FlexDiv>

            <UserCardSectionHeader>{t('common.user-info-card.display-name')}</UserCardSectionHeader>

            <DisplayNameInput value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            <Button disabled={!isNameValid} onClick={() => dispatchDisplayName(walletAddress, avatar, displayName)}>
                {t('options.royale.edit-user-data-dialog.change-display-name')}
            </Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const UserAvatar = styled.img`
    width: 44px;
    height: 44px;
    border-radius: 50%50%;
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

const Button = styled.div<{ disabled?: boolean }>`
    width: 100%;
    background-color: var(--input-border-color);
    font-size: 11px;
    font-family: Roboto !important;
    color: var(--background);
    font-weight: 600;
    border-radius: 20px;
    padding-top: 6px;
    padding-bottom: 6px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
    opacity: ${(_props) => (_props?.disabled ? '0.3' : '1')};
    pointer-events: ${(_props) => (_props?.disabled ? 'none' : 'auto')};
`;

export default DisplayNameForm;
