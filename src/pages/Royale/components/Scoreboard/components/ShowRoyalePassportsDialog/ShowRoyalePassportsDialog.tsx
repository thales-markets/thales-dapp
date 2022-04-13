import { Modal } from '@material-ui/core';
import { Theme } from 'pages/Royale/ThalesRoyal';
import React from 'react';
// import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, Image, Text, XButton } from 'theme/common';
import Cookies from 'universal-cookie';
import { getIsOVM } from 'utils/network';
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
    // const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isL2 = getIsOVM(networkId);

    const royalePassportQuery = useRoyalePassportsURIsQuery(royalePassportIds, {
        enabled: isL2 && isWalletConnected,
    });
    const royalePassports = royalePassportQuery.isSuccess ? royalePassportQuery.data : {};

    const theme = Number(cookies.get('theme') === 0 ? Theme.Light : Theme.Dark);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <ModalWrapper
                className={'royale-passports-modal ' + (theme === Theme.Light ? 'light-theme' : 'dark-theme')}
            >
                <Header>
                    <Text className="text-m font-sansation">My royale passports ({royalePassportIds.length})</Text>
                    <XButton onClick={() => handleClose()} />
                </Header>
                <PassportsWrapper>
                    {royalePassportIds.map((passportId: number, key: number) => (
                        <FlexDiv key={key} style={{ flexDirection: 'column', gap: 5 }}>
                            <UserLabel>
                                Passport ID:{' '}
                                <Text style={{ display: 'contents' }} className="bold font-sansation">
                                    {parseInt(passportId as any, 16)}
                                </Text>
                            </UserLabel>
                            <NftImage src={(royalePassports as any).nfts?.get(passportId)} />
                        </FlexDiv>
                    ))}
                </PassportsWrapper>
            </ModalWrapper>
        </Modal>
    );
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
    height: 295px;
    width: 100%;
    padding: 34px 70px;
    background: var(--color-wrapper);
    gap: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-top: 14px;
    margin-bottom: 50px;
    @media (max-width: 1024px) {
        padding: 15px;
        height: auto;
    }
`;

const NftImage = styled(Image)`
    width: 130px;
    height: 170px;
`;

const UserLabel = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-size: 15px;
    color: var(--color);
    align-self: center;
`;

export default ShowRoyalePassportsDialog;
