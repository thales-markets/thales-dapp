import { Modal } from '@material-ui/core';
import metamask from 'assets/images/metamask.svg';
import axios from 'axios';
import { Input, InputLabel, ShortInputContainer } from 'pages/Options/Market/components';
import useDisplayNameQuery from 'queries/user/useDisplayNameQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivCentered, FlexDivColumn, Image, Text, XButton } from 'theme/common';
import { truncateAddress } from 'utils/formatters/string';
import onboardConnector from 'utils/onboardConnector';
import Web3 from 'web3';
import { Theme } from '../../ThalesRoyal';
import './media.scss';

type UserInfoRoyaleDialogProps = {
    open: boolean;
    handleClose: (open: boolean) => void;
    walletAddress: any;
    network: any;
    theme: any;
};

const ethEnabled = () => {
    if (window.ethereum) {
        window.web3 = new Web3(Web3.givenProvider) as any;
        return true;
    }
    return false;
};

const DISPLAY_NAME_REGEX = /^[a-zA-Z0-9 ]+$/;

const UserInfoRoyaleDialog: React.FC<UserInfoRoyaleDialogProps> = ({
    open,
    handleClose,
    walletAddress,
    network,
    theme,
}) => {
    const { t } = useTranslation();

    const displayNameQuery = useDisplayNameQuery(walletAddress, { enabled: open });

    const currentDisplayName = displayNameQuery.isSuccess ? displayNameQuery.data.name : '';

    useEffect(() => {
        if (currentDisplayName !== '') {
            setName(currentDisplayName);
        }
    }, [currentDisplayName]);

    const [displayName, setName] = useState(currentDisplayName);

    const isNameValid = useMemo(() => {
        return DISPLAY_NAME_REGEX.test(displayName);
    }, [displayName]);

    const setDisplayName = async (walletAddress: string, displayName: string) => {
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

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <ModalWrapper className={theme === Theme.Light ? 'light-theme' : 'dark-theme'}>
                <Header>
                    <Text className="text-m bold font-sansation">{currentDisplayName}</Text>
                    <XButton onClick={() => handleClose(false)} />
                </Header>
                <WalletWrapper>
                    <Image src={metamask} style={{ width: 55, height: 49 }}></Image>
                    <FlexDivColumn style={{ alignItems: 'center', flex: 2 }}>
                        <Text className="text-m bold font-sansation">{truncateAddress(walletAddress, 13, 4)}</Text>
                        <Text className="text-xs bold capitalize font-sansation">{network}</Text>
                    </FlexDivColumn>
                    <FlexDivColumn>
                        <DialogButton
                            className="primary text-xs"
                            style={{
                                width: 180,
                                height: 40,
                                marginBottom: 10,
                                padding: '4px 24px',
                                alignSelf: 'flex-end',
                            }}
                            onClick={() => {
                                onboardConnector.onboard.walletSelect();
                            }}
                        >
                            {t(`user-info.wallet.switch-wallet`)}
                        </DialogButton>
                        <DialogButton
                            className="primary text-xs"
                            style={{
                                width: 180,
                                height: 40,
                                padding: '4px 24px',
                                alignSelf: 'flex-end',
                            }}
                            onClick={() => {
                                onboardConnector.disconnectWallet();
                                handleClose(false);
                            }}
                        >
                            {t(`user-info.wallet.disconnect-wallet`)}
                        </DialogButton>
                    </FlexDivColumn>
                </WalletWrapper>
                <FlexDivCentered style={{ justifyContent: 'space-around', margin: 25 }}>
                    <ShortInputContainer style={{ margin: 0, width: '45%' }}>
                        <InputLabel className="font-sansation">{t(`user-info.wallet.display-name`)}</InputLabel>
                        <InputField
                            className="font-sansation"
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                            value={displayName}
                        />
                    </ShortInputContainer>
                    <DialogButton
                        style={{ height: 40, maxWidth: 220 }}
                        onClick={() => {
                            setDisplayName(walletAddress, displayName);
                        }}
                        disabled={!isNameValid}
                        className="primary"
                    >
                        {t(`user-info.wallet.change-display-name`)}
                    </DialogButton>
                </FlexDivCentered>
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

const WalletWrapper = styled(FlexDiv)`
    border-radius: 23px;
    padding: 15px 35px;
    margin: 0 25px;
    align-items: center;
    font-family: Sansation !important;
    color: var(--color);
`;

const DialogButton = styled(Button)`
    border: 1px solid var(--color);
    box-sizing: border-box;
    border-radius: 20px;
    height: 28px;
    padding: 4px 6px;
    flex: 1;
    background: var(--color-wrapper) !important;
    color: var(--color) !important;
    cursor: pointer;
    font-family: Sansation !important;
`;

const InputField = styled(Input)`
    border: 1px solid var(--color);
    background: var(--color-wrapper) !important;
`;

export default UserInfoRoyaleDialog;
