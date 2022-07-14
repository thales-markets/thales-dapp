import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDivColumnCentered, FlexDivRowCentered, XButton } from 'theme/common';
import { Modal } from '@material-ui/core';
import TextInput from 'components/TextInput';
// import { getAddress } from 'utils/formatters/ethers';
import { DefaultSubmitButton, InputContainer, InputLabel } from '../components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import onboardConnector from 'utils/onboardConnector';
import ValidationMessage from 'components/ValidationMessage';
import snxJSConnector from 'utils/snxJSConnector';
import { dispatchMarketNotification } from 'utils/options';
import { MAX_L2_GAS_LIMIT } from 'constants/options';

type MergeAccountModalProps = {
    onClose: () => void;
};

const MergeAccountModal: React.FC<MergeAccountModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '-';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [destAddress, setDestAddress] = useState<string>('');
    const [isMerging, setIsMerging] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const { stakingThalesContract } = snxJSConnector as any;

    const isDestAddressEntered = destAddress !== undefined && destAddress.trim() !== '';
    const isDestAddressValid = destAddress === undefined || destAddress.trim() === '' || isAddress(destAddress);

    const isButtonDisabled = isMerging || !isDestAddressEntered || !isDestAddressValid || !isWalletConnected;

    const handleMerge = async () => {
        try {
            setTxErrorMessage(null);
            setIsMerging(true);

            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);

            const tx = await stakingThalesContractWithSigner.mergeAccount(getAddress(destAddress), {
                gasLimit: MAX_L2_GAS_LIMIT,
            });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.earn.merge-account.confirmation-message'));
                setDestAddress('');
                setIsMerging(false);
                onClose();
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsMerging(false);
        }
    };

    const getMergeButton = () => {
        if (!isWalletConnected) {
            return (
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }
        if (!isDestAddressValid) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.invalid-address`)}</DefaultSubmitButton>;
        }
        if (!isDestAddressEntered) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-address`)}</DefaultSubmitButton>;
        }

        return (
            <DefaultSubmitButton disabled={isButtonDisabled} onClick={handleMerge}>
                {!isMerging
                    ? t('options.earn.merge-account.merge-button.label')
                    : t('options.earn.merge-account.merge-button.progress-label')}
            </DefaultSubmitButton>
        );
    };

    return (
        <Modal
            open={true}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') onClose();
            }}
            style={{ backdropFilter: 'blur(10px)' }}
        >
            <Container>
                <Header>
                    <div>{t('options.earn.merge-account.title')}</div>
                    <XButton onClick={onClose} />
                </Header>
                <Source>
                    <Label>{t('options.earn.merge-account.source-account-label')}:</Label>
                    <Text>{walletAddress}</Text>
                </Source>
                <InputContainer>
                    <TextInput
                        value={destAddress}
                        onChange={(e: any) => setDestAddress(e.target.value)}
                        disabled={isMerging}
                        className={isDestAddressValid ? '' : 'error'}
                    />
                    <InputLabel>{t('options.earn.merge-account.destination-account-label')}:</InputLabel>
                    <FieldValidationMessage
                        showValidation={!isDestAddressValid}
                        message={t(`common.errors.invalid-address`)}
                    />
                </InputContainer>
                <ButtonContainer>
                    {getMergeButton()}
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </ButtonContainer>
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    font-size: 12px;
    line-height: 24px;
    border-radius: 15px;
    min-width: 70px;
    background: #04045a;
    border: 2px solid #64d9fe;
    box-shadow: 0px 0px 90px 10px #64d9fe;
    margin: auto;
    position: relative;
    top: 200px;
    padding: 20px;
    width: 460px;
    height: fit-content;
`;

const Header = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    padding: 0px 2px 50px 2px;
`;

const Source = styled(FlexDivColumnCentered)`
    margin: 0 20px 25px 20px;
`;

const Label = styled(FlexDivRowCentered)`
    font-weight: bold;
    font-size: 9px;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #b8c6e5;
`;

const Text = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 14px;
    line-height: 30px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
`;

const ButtonContainer = styled(FlexDivColumnCentered)`
    padding-top: 15px;
    padding-bottom: 10px;
    align-items: center;
`;

export default MergeAccountModal;
