import { DialogTitle } from '@material-ui/core';
import styled from 'styled-components';
import warning from 'assets/images/warning-triangle-white.svg';
import { StyledModal } from 'pages/Options/Market/TradeOptions/Orderbook/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'theme/common';
import './media.scss';

type RedirectDialogProps = {
    open: boolean;
    setOpen: (data: any) => void;
};

export const RedirectDialog: React.FC<RedirectDialogProps> = ({ open, setOpen }) => {
    const { t } = useTranslation();
    const onClose = () => {
        console.log('closed');
        setOpen(false);
    };

    return (
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
                        color: 'black',
                        textAlign: 'center',
                        display: 'block',
                        position: 'relative',
                        fontSize: 60,
                    }}
                />
                <LinkImage
                    className="redirect-modal-font"
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        lineHeight: '22px',
                        display: 'block',
                    }}
                    href="/thales-royal"
                >
                    {t('options.royale.redirect-dialog.message')}
                    <i
                        className="icon icon--right"
                        style={{
                            color: 'black',
                            fontSize: 28,
                            position: 'absolute',
                            marginLeft: 59,
                        }}
                    />
                </LinkImage>
            </DialogTitle>
        </StyledModal>
    );
};

export const LinkImage = styled.a`
    &:after {
        // content: url(${warning});
        // margin-left: 60px;
    }
    &:visited {
        color: rgba(0, 0, 0, 0.87);
    }
`;

export default RedirectDialog;
