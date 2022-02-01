import { DialogTitle } from '@material-ui/core';
import { StyledModal } from 'pages/Options/Market/TradeOptions/Orderbook/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Text } from 'theme/common';
import './media.scss';

type RedirectDialogProps = {
    open: boolean;
    setOpen: (data: any) => void;
};

const RedirectDialog: React.FC<RedirectDialogProps> = ({ open, setOpen }) => {
    const { t } = useTranslation();

    const onClose = () => {
        setOpen(false);
    };

    const switchToMainnetEthNetwork = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await (window.ethereum as any).request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }],
                });
                location.reload();
            } catch (switchError) {
                console.log(switchError);
            }
        }
    };

    return (
        <StyledModal
            open={open}
            onClose={(_event, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
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
                    className="redirect-modal-font"
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '25px',
                        lineHeight: '28px',
                    }}
                >
                    {t('options.royale.redirect-dialog.title')}
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
                    className="redirect-modal-font"
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        lineHeight: '22px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                    href="/royale"
                >
                    <i className="icon icon--left redirect-dialog-icon redirect-dialog-icon--left" />
                    {t('options.royale.redirect-dialog.message')}
                </Link>
                <Text
                    className="redirect-modal-font"
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        lineHeight: '30px',
                        display: 'block',
                    }}
                >
                    {t('options.royale.redirect-dialog.or')}
                </Text>
                <Link
                    className="redirect-modal-font"
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        lineHeight: '22px',
                        display: 'flex',
                        cursor: 'pointer',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                    onClick={switchToMainnetEthNetwork}
                >
                    {t('options.royale.redirect-dialog.switch-to-mainnet')}
                    <i className="icon icon--right redirect-dialog-icon redirect-dialog-icon--right" />
                </Link>
            </DialogTitle>
        </StyledModal>
    );
};

export const Link = styled.a`
    &:visited {
        color: rgba(0, 0, 0, 0.87);
    }
`;

export default RedirectDialog;
