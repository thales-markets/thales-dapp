import { DialogTitle } from '@material-ui/core';
import { StyledModal } from 'pages/Options/Market/TradeOptions/Orderbook/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Text } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';
import { RoyaleBackground } from '../../Royal/ThalesRoyal';
import './media.scss';

type WalletNotConnectedDialogProps = {
    open: boolean;
    setOpen: (data: any) => void;
};

export const WalletNotConnectedDialog: React.FC<WalletNotConnectedDialogProps> = ({ open, setOpen }) => {
    const { t } = useTranslation();
    const onClose = () => {
        setOpen(false);
    };

    return (
        <RoyaleBackground>
            <StyledModal
                open={open}
                onClose={onClose}
                PaperProps={{
                    style: {
                        backgroundColor: '#64D9FE',
                        boxShadow: '0px 4px 50px rgba(100, 217, 254, 0.5)',
                        borderRadius: 5,
                        border: '5px solid #EFEFEF',
                    },
                }}
                BackdropProps={{
                    style: {
                        backdropFilter: 'blur(20px)',
                    },
                }}
            >
                <DialogTitle>
                    <Text
                        className="wallet-not-connected-modal-font"
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '25px',
                            lineHeight: '28px',
                        }}
                    >
                        {t('options.royale.wallet-not-connected-dialog.title')}
                    </Text>
                    <Text
                        className="wallet-not-connected-modal-font"
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            lineHeight: '22px',
                        }}
                    >
                        {t('options.royale.wallet-not-connected-dialog.message')}
                    </Text>

                    <i
                        className="icon icon--warning"
                        style={{
                            color: '#04045a',
                            textAlign: 'center',
                            display: 'block',
                            position: 'relative',
                            fontSize: 60,
                        }}
                    />
                    <Link
                        className="wallet-not-connected-modal-font"
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            lineHeight: '22px',
                            display: 'block',
                        }}
                        onClick={onboardConnector.connectWallet}
                    >
                        {t('options.royale.wallet-not-connected-dialog.button')}
                        <i
                            className="icon icon--right"
                            style={{
                                color: '#04045a',
                                fontSize: 28,
                                position: 'absolute',
                                marginLeft: 59,
                            }}
                        />
                    </Link>
                </DialogTitle>
            </StyledModal>
        </RoyaleBackground>
    );
};

const Link = styled.a`
    &:visited {
        color: rgba(0, 0, 0, 0.87);
    }
    cursor: pointer;
`;

export default WalletNotConnectedDialog;
