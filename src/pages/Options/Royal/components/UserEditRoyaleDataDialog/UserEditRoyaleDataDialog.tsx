import { Modal } from '@material-ui/core';
import axios from 'axios';
import React, { useMemo, useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumn, Image, Text, XButton } from 'theme/common';
import Cookies from 'universal-cookie';
import { truncateAddress } from 'utils/formatters/string';
import Web3 from 'web3';
import { User } from '../../Queries/useRoyalePlayersQuery';
import { Theme } from '../../ThalesRoyal';
import './media.scss';

type UserEditRoyaleDataDialogProps = {
    open: boolean;
    handleClose: () => void;
    user: User | undefined;
    walletAddress: string | null;
};

const cookies = new Cookies();
const ethEnabled = () => {
    if (window.ethereum) {
        window.web3 = new Web3(Web3.givenProvider) as any;
        return true;
    }
    return false;
};

const DISPLAY_NAME_REGEX = /^[a-zA-Z0-9 ]+$/;
const AVATAR_LINK_REGEX = /^(.*?)\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/;

const UserEditRoyaleDataDialog: React.FC<UserEditRoyaleDataDialogProps> = ({
    open,
    handleClose,
    user,
    walletAddress,
}) => {
    const { t } = useTranslation();
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;
    const theme = Number(cookies.get('theme') === 0 ? Theme.Light : Theme.Dark);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');

    const isNameValid = useMemo(() => {
        return DISPLAY_NAME_REGEX.test(name ?? '');
    }, [name]);

    const isAvatarLinkValid = useMemo(() => {
        return AVATAR_LINK_REGEX.test(avatar ?? '');
    }, [avatar]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setAvatar(user.avatar);
        } else {
            setName('');
            setAvatar('');
        }
    }, [user]);

    const setUserData = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(Web3.givenProvider) as any;

            if (!ethEnabled()) {
                alert('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!');
            }

            (window.web3?.eth as any).personal.sign(name, walletAddress, async (_test: any, signature: any) => {
                try {
                    await axios.post('http://localhost:3002/royale-user-data', {
                        walletAddress,
                        name,
                        avatar,
                        signature,
                    });
                } catch (e) {
                    console.log(e);
                }
            });
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <ModalWrapper
                className={'user-info-royale-modal ' + (theme === Theme.Light ? 'light-theme' : 'dark-theme')}
            >
                <Header>
                    <Text className="text-m bold font-sansation">{user?.name}</Text>
                    <XButton onClick={() => handleClose()} />
                </Header>
                <UserWrapper>
                    <FlexDivColumn style={{ margin: '20px 0' }}>
                        <FlexContainer>
                            <UserLabel>
                                <Trans
                                    i18nKey="options.royale.scoreboard.player-no"
                                    components={{ sans: <span style={{ fontFamily: 'sans-serif !important' }} /> }}
                                />

                                {' #'}
                                {user?.number}
                            </UserLabel>
                            <ImageWrapper>
                                {user?.avatar ? (
                                    <UserAvatar src={user.avatar} style={{ width: 44, height: 44 }} />
                                ) : (
                                    <i className="icon icon--user-avatar" style={{ fontSize: 44 }} />
                                )}
                            </ImageWrapper>
                        </FlexContainer>
                        <FlexContainer>
                            <UserLabel>{t('options.royale.edit-user-data-dialog.avatar')}</UserLabel>
                            <InputWrapper
                                onChange={(e) => setAvatar(e.target.value)}
                                value={avatar}
                                placeholder={t('options.royale.edit-user-data-dialog.change-avatar')}
                            />
                        </FlexContainer>
                        <FlexContainer>
                            <UserLabel>{t('options.leaderboard.display-name')}:</UserLabel>
                            <InputWrapper
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                placeholder={t('options.royale.edit-user-data-dialog.enter-display-name')}
                            />
                        </FlexContainer>
                        <FlexContainer>
                            <UserLabel></UserLabel>
                            <ConfirmButton
                                onClick={() => {
                                    setUserData();
                                }}
                                disabled={!isNameValid || !isAvatarLinkValid}
                            >
                                {t('options.royale.edit-user-data-dialog.change-display-name')}
                            </ConfirmButton>
                        </FlexContainer>
                        <FlexContainer>
                            <UserLabel>{t('options.leaderboard.address')}:</UserLabel>
                            <LabelWrapper>
                                {truncateAddress(
                                    walletAddress as any,
                                    truncateAddressNumberOfCharacters,
                                    truncateAddressNumberOfCharacters
                                )}
                            </LabelWrapper>
                        </FlexContainer>
                    </FlexDivColumn>
                </UserWrapper>
            </ModalWrapper>
        </Modal>
    );
};

const ModalWrapper = styled(FlexDivColumn)`
    width: 600px;
    max-height: min(90%, 800px);
    overflow-y: auto;
    border-radius: 23px;
    margin: 5% auto;
    background-color: var(--color-wrapper);
    box-shadow: 0px 4px 50px rgba(100, 217, 254, 0.5);
    border-radius: 5px;
    border: 5px solid var(--color);
`;

const Header = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    font-family: Sansation !important;
    color: var(--color);
`;

const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 295px;
    width: 100%;
    padding: 34px 70px;
    background: var(--color-wrapper);

    box-sizing: border-box;
    border-radius: 5px;
    margin-top: 14px;
    margin-bottom: 50px;
    @media (max-width: 1024px) {
        padding: 15px;
        height: auto;
    }
`;

const UserAvatar = styled(Image)<{ winner?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: 50%50%;
    border: ${(props) => (props.winner ? '2px solid #FFE489' : 'none')};
    filter: ${(props) => (props.winner ? 'drop-shadow(0px 0px 15px rgba(255, 232, 155, 0.7))' : 'none')};
    @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
    }
`;

const InputWrapper = styled.input`
    width: 220px;
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    background: #e3f7e9;
    color: var(--color-wrapper);
    text-overflow: ellipsis;
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const LabelWrapper = styled.div`
    width: 220px;
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    text-overflow: ellipsis;
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const ConfirmButton = styled.button`
    width: 220px;
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    background: var(--color);
    color: var(--color-wrapper);
    text-overflow: ellipsis;
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    @media (max-width: 1024px) {
        width: 150px;
    }\
    cursor: pointer;
`;

const ImageWrapper = styled.div`
    width: 220px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    text-overflow: ellipsis;
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const FlexContainer = styled(FlexDivCentered)`
    justify-content: space-between;
    margin: 7px 0;
`;

const UserLabel = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    color: var(--color);
`;

// const DialogButton = styled(Button)`
//     border: 1px solid var(--color);
//     box-sizing: border-box;
//     border-radius: 20px;
//     height: 28px;
//     padding: 4px 6px;
//     flex: 1;
//     background: var(--color-wrapper) !important;
//     color: var(--color) !important;
//     cursor: pointer;
//     font-family: Sansation !important;
// `;

export default UserEditRoyaleDataDialog;
