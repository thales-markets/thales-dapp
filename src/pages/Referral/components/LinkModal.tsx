import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: 'var(--color-highlight)',
            border: '2px solid #000',
            borderRadius: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            color: ' var(--color-primary)',
            boxShadow: theme.shadows[5],
            padding: '5px',
            [theme.breakpoints.between(200, 520)]: {
                width: '90%',
            },
        },
    })
);

const LinkModal: React.FC<{ showModal: boolean; onClose: () => void; link: string }> = ({
    showModal,
    onClose,
    link,
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [buttonText, setButtonText] = useState<string>(t('referral-page.modal.copy-link'));

    const copyButtonHandler = () => {
        setButtonText(t('referral-page.modal.copied'));
        navigator.clipboard.writeText(link);
        setTimeout(() => {
            setButtonText(t('copy-link'));
        }, 5000);
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={showModal}
                onClose={onClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={showModal}>
                    <div className={classes.paper}>
                        <p
                            id="transition-modal-description"
                            style={{
                                width: '80%',
                                textAlign: 'center',
                                paddingBottom: '10px',
                                paddingTop: '10px',
                                height: 'auto',
                                wordWrap: 'break-word',
                            }}
                        >
                            {link}
                        </p>
                        <br />
                        <Button
                            inactiveBgColor={' var(--color-primary)'}
                            inactiveTextColor={'var(--color-highlight)'}
                            padding={'5px 10px'}
                            margin={'10px 10px'}
                            onClickHandler={() => copyButtonHandler()}
                        >
                            {buttonText}
                        </Button>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default LinkModal;
