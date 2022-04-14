import { Modal } from '@material-ui/core';
import { Theme } from 'pages/Royale/ThalesRoyal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, Image, Text, XButton } from 'theme/common';
import Cookies from 'universal-cookie';
import { getIsOVM, NetworkId } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import useRoyalePassportsURIsQuery from '../../queries/useRoyalePassportsURIsQuery';
import './media.scss';

type ShowRoyalePassportsDialogProps = {
    open: boolean;
    handleClose: () => void;
    royalePassportIds: number[];
};

const cookies = new Cookies();

const ShowRoyalePassportsDialog: React.FC<ShowRoyalePassportsDialogProps> = ({
    open,
    handleClose,
    royalePassportIds,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isL2 = getIsOVM(networkId);

    const royalePassportQuery = useRoyalePassportsURIsQuery(royalePassportIds, {
        enabled: isL2 && isWalletConnected,
    });
    const royalePassports = royalePassportQuery.isSuccess ? royalePassportQuery.data : {};

    const theme = Number(cookies.get('theme') === 0 ? Theme.Light : Theme.Dark);

    const [selectedPassport, setSelectedPassport] = useState<number>(0);

    const closeDialog = () => {
        setSelectedPassport(0);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={closeDialog}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <ModalWrapper
                className={'royale-passports-modal ' + (theme === Theme.Light ? 'light-theme' : 'dark-theme')}
            >
                <Header>
                    <Text className="text-m font-sansation">
                        {t('options.royale.my-passports-dialog.passport-amount', {
                            amount: royalePassportIds.length,
                        })}
                    </Text>
                    <XButton onClick={() => closeDialog()} />
                </Header>
                <PassportsWrapper>
                    {royalePassportIds.map((passportId: number, key: number) => (
                        <FlexDiv key={key} style={{ flexDirection: 'column', gap: 5 }}>
                            <UserLabel>
                                {t('options.royale.my-passports-dialog.passport-id')}
                                <Text style={{ display: 'contents' }} className="bold font-sansation">
                                    {parseInt(passportId as any, 16)}
                                </Text>
                            </UserLabel>
                            <ImageWrapper
                                className={selectedPassport === parseInt(passportId as any, 16) ? 'selected' : ''}
                                onClick={() => {
                                    selectedPassport === passportId
                                        ? setSelectedPassport(0)
                                        : setSelectedPassport(parseInt(passportId as any, 16));
                                }}
                            >
                                <NftImage src={(royalePassports as any).nfts?.get(passportId)} />
                            </ImageWrapper>
                        </FlexDiv>
                    ))}
                </PassportsWrapper>
                <Link
                    onClick={(e) => (selectedPassport === 0 ? e.preventDefault() : '')}
                    href={getQuixoticLink(networkId, selectedPassport)}
                    className={selectedPassport === 0 ? 'disabled' : ''}
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('options.royale.my-passports-dialog.sell-passport')}
                </Link>
            </ModalWrapper>
        </Modal>
    );
};

export const getQuixoticLink = (networkId: NetworkId, nftId?: number) => {
    const { thalesRoyalePassportContract } = snxJSConnector;
    if (networkId === 10) {
        const baseURL = 'https://quixotic.io';
        return `${baseURL}/asset/${thalesRoyalePassportContract?.address}/${nftId}`;
    }

    const baseURL = 'https://testnet.quixotic.io';
    return `${baseURL}/asset/${thalesRoyalePassportContract?.address}/${nftId}`;
};

const ModalWrapper = styled(FlexDivColumn)`
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
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

const PassportsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    padding: 34px 70px;
    background: var(--color-wrapper);
    gap: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-top: 14px;
    margin-bottom: 50px;
    height: auto;
    @media (max-width: 1024px) {
        justify-content: center;
    }
`;

const NftImage = styled(Image)`
    width: 130px;
    height: 170px;
    margin: 10px 0px;
`;

const UserLabel = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-size: 15px;
    color: var(--color);
    align-self: center;
`;

const ImageWrapper = styled(FlexDiv)`
    background: var(--background-color);
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;
    &.selected {
        box-sizing: border-box;
        box-shadow: 0px 0px 35.6889px var(--color);
    }
`;

const Link = styled.a`
    position: absolute;
    bottom: 0;
    right: 0px;
    margin: 20px 30px;
    width: fit-content;
    padding: 10px;
    cursor: pointer;
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 6px;
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
        position: relative;
        display: block;
        margin: 20px auto;
        line-height: 0px;
    }
`;

export default ShowRoyalePassportsDialog;
