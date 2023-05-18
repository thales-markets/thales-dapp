import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { BigNumber, ethers } from 'ethers';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import Checkbox from 'components/Checkbox';
import Button from 'components/ButtonV2';
import Modal from 'components/Modal';
import { getAmountForApproval } from 'utils/amm';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Input from 'components/Input';

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
            >
                {!isAllowing
                    ? t('common.enable-wallet-access.approve-label', { currencyKey: tokenSymbol })
                    : t('common.enable-wallet-access.approve-progress-label', {
                          currencyKey: tokenSymbol,
                      })}
            </Button>
        );
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= maxApproveAmount));
    }, [amount, maxApproveAmount]);

    return (
        <Modal
            title={t('common.enable-wallet-access.approve-label', { currencyKey: tokenSymbol })}
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
                <Text>{t('common.or')}</Text>
                <Text>{t('common.enable-wallet-access.custom-amount-label')}</Text>
                <Input
                    value={amount}
                    valueChange={setAmount}
                    disabled={approveAll || isAllowing}
                    subValue={tokenSymbol}
                    showValidation={!approveAll && !isAmountValid}
                    validationMessage={t('common.errors.invalid-amount-max', { max: maxApproveAmount })}
                />
                <ButtonContainer>{getSubmitButton()}</ButtonContainer>
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    width: 450px;
    @media (max-width: 575px) {
        width: auto;
    }
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 30px 0 10px 0;
`;

const CheckboxContainer = styled(FlexDivCentered)`
    margin: 40px 0 5px 0;
    label {
        font-size: 25px;
        line-height: 52px;
        padding-left: 32px;
        font-weight: bold;
    }
    span {
        :after {
            height: 14px;
            width: 5px;
            left: 5px;
            top: -1px;
            border-width: 0 3px 3px 0;
        }
        height: 25px;
        width: 25px;
        border-radius: 5px;
        margin-top: 12px;
        border: 3px solid ${(props) => props.theme.borderColor.secondary};
    }
`;

const Text = styled(FlexDivCentered)`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 20px;
`;

export default ApprovalModal;
