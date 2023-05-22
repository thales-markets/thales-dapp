import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/ButtonV2';
import Checkbox from 'components/fields/Checkbox';
import Input from 'components/Input';
import Modal from 'components/Modal';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { getAmountForApproval } from 'utils/amm';
import { bigNumberFormatter } from 'utils/formatters/ethers';

type ApprovalModalProps = {
    defaultAmount: number | string;
    collateralIndex?: number;
    tokenSymbol: string;
    isAllowing: boolean;
    onSubmit: (approveAmount: BigNumber) => void;
    onClose: () => void;
};

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
    defaultAmount,
    collateralIndex,
    tokenSymbol,
    isAllowing,
    onSubmit,
    onClose,
}) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [amount, setAmount] = useState<number | string>(defaultAmount);
    const [approveAll, setApproveAll] = useState<boolean>(true);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);

    const { openConnectModal } = useConnectModal();

    const maxApproveAmount = bigNumberFormatter(ethers.constants.MaxUint256);
    const isAmountEntered = Number(amount) > 0;
    const isButtonDisabled = !isWalletConnected || isAllowing || (!approveAll && (!isAmountEntered || !isAmountValid));

    const amountConverted = getAmountForApproval(
        collateralIndex ? collateralIndex : 0,
        Number(amount).toString(),
        networkId
    );

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={() => openConnectModal?.()}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (!approveAll && !isAmountEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-amount`)}</Button>;
        }
        return (
            <Button
                disabled={isButtonDisabled}
                onClick={() => onSubmit(approveAll ? ethers.constants.MaxUint256 : amountConverted)}
                additionalStyles={{ textTransform: 'none' }}
            >
                {!isAllowing
                    ? t('common.enable-wallet-access.approve').toUpperCase() + ' ' + tokenSymbol
                    : t('common.enable-wallet-access.approve-progress').toUpperCase() + ' ' + tokenSymbol + '...'}
            </Button>
        );
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= maxApproveAmount));
    }, [amount, maxApproveAmount]);

    return (
        <Modal
            title={t('common.enable-wallet-access.approve', { currencyKey: tokenSymbol })}
            onClose={onClose}
            shouldCloseOnOverlayClick={false}
            customStyle={{ overlay: { zIndex: 201 } }}
        >
            <Container>
                <CheckboxContainer>
                    <Checkbox
                        disabled={isAllowing}
                        checked={approveAll}
                        value={approveAll.toString()}
                        onChange={(e: any) => setApproveAll(e.target.checked || false)}
                        label={t('common.enable-wallet-access.approve-all-label')}
                    />
                </CheckboxContainer>
                <TextContainer>
                    <Text>{t('common.or')}</Text>
                </TextContainer>
                <InputLabel>
                    <Text>{t('common.enable-wallet-access.custom-amount-label')}</Text>
                </InputLabel>
                <Input
                    value={amount}
                    valueChange={setAmount}
                    disabled={approveAll || isAllowing}
                    subValue={tokenSymbol}
                    placeholder={t('common.enter-amount')}
                    showValidation={!approveAll && !isAmountValid}
                    validationMessage={t('common.errors.invalid-amount-max', { max: maxApproveAmount })}
                />
                <ButtonContainer>{getSubmitButton()}</ButtonContainer>
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    width: 306px;
    @media (max-width: 575px) {
        width: auto;
    }
`;

const CheckboxContainer = styled(FlexDivRow)`
    margin: 20px 0;
`;

const TextContainer = styled(FlexDivCentered)`
    margin-bottom: 20px;
`;

const InputLabel = styled(FlexDivRow)`
    margin-bottom: 10px;
`;

const Text = styled.span`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 10px 0;
`;

export default ApprovalModal;
