import { DialogTitle } from '@material-ui/core';
import { StyledModal } from 'pages/Options/Market/TradeOptions/Orderbook/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Text } from 'theme/common';
import { RoyaleBackground } from '../../ThalesRoyal';
import './media.scss';

type WrongNetworkDialogProps = {
    open: boolean;
    setOpen: (data: any) => void;
};

export const WrongNetworkDialog: React.FC<WrongNetworkDialogProps> = ({ open, setOpen }) => {
    const { t } = useTranslation();
    const onClose = () => {
        setOpen(false);
    };

    const switchOrAddKovanOptimisticNetwork = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await (window.ethereum as any).request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x45' }],
                });
                onClose();
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    try {
                        await (window.ethereum as any).request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x45',
                                    chainName: 'Optimistic Ethereum Testnet Kovan',
                                    rpcUrls: ['https://kovan.optimism.io/'],
                                    nativeCurrency: {
                                        name: 'Ether',
                                        symbol: 'ETH',
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io/'],
                                },
                            ],
                        });
                        await (window.ethereum as any).request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x45' }],
                        });
                        onClose();
                    } catch (addError) {
                        console.log(addError);
                    }
                } else {
                    console.log(switchError);
                }
            }
        }
    };

    return (
        <RoyaleBackground>
            <StyledModal
                open={open}
                onClose={onClose}
                disableBackdropClick
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
                        className="wrong-network-modal-font"
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '25px',
                            lineHeight: '28px',
                        }}
                    >
                        {t('options.royale.wrong-network-dialog.title')}
                    </Text>
                    <Text
                        className="wrong-network-modal-font"
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            lineHeight: '22px',
                        }}
                    >
                        {t('options.royale.wrong-network-dialog.message')}
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
                    {window.innerWidth < 900 && (
                        <>
                            <Link
                                className="wrong-network-modal-font"
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    lineHeight: '22px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                href="/markets"
                            >
                                <i className="icon icon--left wrong-network-dialog-icon wrong-network-dialog-icon--left" />
                                {t('options.royale.wrong-network-dialog.return-to-dapp')}
                            </Link>
                            <Text
                                className="wrong-network-modal-font"
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
                                className="wrong-network-modal-font"
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    lineHeight: '22px',
                                    display: 'block',
                                    color: 'var(--color-wrapper)',
                                }}
                                href="https://community.optimism.io/docs/infra/networks.html#optimistic-kovan"
                                target="_blank"
                            >
                                {t('options.royale.wrong-network-dialog.parameters')}
                                <i className="icon icon--right wrong-network-dialog-icon wrong-network-dialog-icon--params" />
                            </Link>
                        </>
                    )}
                    {window.innerWidth > 900 && (
                        <>
                            <Link
                                className="wrong-network-modal-font"
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    lineHeight: '22px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                                href="/markets"
                            >
                                <i className="icon icon--left wrong-network-dialog-icon wrong-network-dialog-icon--left" />
                                {t('options.royale.wrong-network-dialog.return-to-dapp')}
                            </Link>
                            <Text
                                className="wrong-network-modal-font"
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
                                className="wrong-network-modal-font"
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    lineHeight: '22px',
                                    display: 'block',
                                }}
                                onClick={switchOrAddKovanOptimisticNetwork}
                            >
                                {t('options.royale.wrong-network-dialog.button')}
                                <i className="icon icon--right wrong-network-dialog-icon wrong-network-dialog-icon--right" />
                            </Link>
                        </>
                    )}
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

export default WrongNetworkDialog;
