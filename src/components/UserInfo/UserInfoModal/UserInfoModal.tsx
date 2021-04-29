import React from 'react';
import { Modal } from '@material-ui/core';
import { Button, FlexDiv, FlexDivColumn, Image, Text } from 'theme/common';
import styled from 'styled-components';
import xSign from 'assets/images/x-sign.svg';
import metamask from 'assets/images/metamask.svg';
import onboardConnector from 'utils/onboardConnector';

type UserInfoModalProps = {
    open: boolean;
    handleClose: (open: boolean) => void;
    address: any;
    network: any;
};

const ModalWrapper = styled(FlexDivColumn)`
    width: 600px;
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border-radius: 23px;
    margin: 240px auto;
    padding-bottom: 40px;
`;

const Header = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
`;

const WalletWrapper = styled(FlexDiv)`
    background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    box-shadow: 0px 2px 6px #101a76;
    border-radius: 23px;
    padding: 15px 35px;
    margin: 0 25px;
    align-items: center;
`;

const UserInfoModal: React.FC<UserInfoModalProps> = ({ open, handleClose, address, network }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <ModalWrapper>
                <Header>
                    <Text className="text-m bold pale-grey">Connected Wallet</Text>
                    <Image src={xSign} style={{ width: 14, height: 14 }}></Image>
                </Header>
                <WalletWrapper>
                    <Image src={metamask} style={{ width: 55, height: 49 }}></Image>
                    <FlexDivColumn style={{ alignItems: 'center', flex: 2 }}>
                        <Text className="text-m bold pale-grey">{address}</Text>
                        <Text className="text-xs bold pale-grey capitalize">{network}</Text>
                    </FlexDivColumn>
                    <FlexDivColumn>
                        <Button
                            className="primary text-xs"
                            style={{
                                width: 150,
                                height: 40,
                                marginBottom: 10,
                                padding: '4px 24px',
                                alignSelf: 'flex-end',
                            }}
                            onClick={() => {
                                onboardConnector.onboard.walletSelect();
                            }}
                        >
                            Switch Wallet
                        </Button>
                        <Button
                            className="primary text-xs"
                            style={{ width: 150, height: 40, padding: '4px 24px', alignSelf: 'flex-end' }}
                            onClick={() => {
                                onboardConnector.disconnectWallet();
                                handleClose(false);
                            }}
                        >
                            Disconnect Wallet
                        </Button>
                    </FlexDivColumn>
                </WalletWrapper>
            </ModalWrapper>
        </Modal>
    );
};

export default UserInfoModal;
