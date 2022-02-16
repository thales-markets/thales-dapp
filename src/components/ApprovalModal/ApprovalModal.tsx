import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { BigNumber, ethers } from 'ethers';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import {
    CloseIconContainer,
    ModalContainer,
    ModalTitle,
    StyledModal,
    ModalHeader,
} from 'pages/Options/Market/TradeOptions/Orderbook/components';
import ValidationMessage from 'components/ValidationMessage';
import {
    DefaultSubmitButton,
    SubmitButtonContainer,
    InputContainer,
    InputLabel,
    CurrencyLabel,
} from 'pages/Options/Market/components';
import onboardConnector from 'utils/onboardConnector';
import { FlexDivRow, FlexDivColumnCentered, FlexDivCentered } from 'theme/common';
import NumericInput from 'pages/Options/Market/components/NumericInput';
import styled from 'styled-components';
import Checkbox from 'components/Checkbox';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { Dialog, withStyles } from '@material-ui/core';

type ApprovalModalProps = {
    defaultAmount: number | string;
    tokenSymbol: string;
    isAllowing: boolean;
    onSubmit: (approveAmount: BigNumber) => void;
    onClose: () => void;
    isRoyale?: boolean;
};

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
    defaultAmount,
    tokenSymbol,
    isAllowing,
    onSubmit,
    onClose,
    isRoyale,
}) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [amount, setAmount] = useState<number | string>(defaultAmount);
    const [approveAll, setApproveAll] = useState<boolean>(true);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);

    const maxApproveAmount = bigNumberFormatter(ethers.constants.MaxUint256);
    const isAmountEntered = Number(amount) > 0;
    const isButtonDisabled = !isWalletConnected || isAllowing || (!approveAll && (!isAmountEntered || !isAmountValid));

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <ApprovalSubmitButton isRoyale={isRoyale} onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </ApprovalSubmitButton>
            );
        }
        if (!approveAll && !isAmountEntered) {
            return (
                <ApprovalSubmitButton isRoyale={isRoyale} disabled={true}>
                    {t(`common.errors.enter-amount`)}
                </ApprovalSubmitButton>
            );
        }
        return (
            <ApprovalSubmitButton
                isRoyale={isRoyale}
                disabled={isButtonDisabled}
                onClick={() =>
                    onSubmit(
                        approveAll ? ethers.constants.MaxUint256 : ethers.utils.parseEther(Number(amount).toString())
                    )
                }
            >
                {!isAllowing
                    ? t('common.enable-wallet-access.approve-label', { currencyKey: tokenSymbol })
                    : t('common.enable-wallet-access.approve-progress-label', {
                          currencyKey: tokenSymbol,
                      })}
            </ApprovalSubmitButton>
        );
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= maxApproveAmount));
    }, [amount]);

    const getModalContent = () => (
        <ApprovalModalContainer isRoyale={isRoyale}>
            <ModalHeader>
                <ApprovalModalTitle isRoyale={isRoyale}>
                    {t('common.enable-wallet-access.approve-label', { currencyKey: tokenSymbol })}
                </ApprovalModalTitle>
                <FlexDivRow>
                    <CloseIconContainer onClick={onClose} />
                </FlexDivRow>
            </ModalHeader>
            <FlexDivColumnCentered>
                <FlexDivColumnCentered>
                    <CheckboxContainer isRoyale={isRoyale}>
                        <Checkbox
                            disabled={isAllowing}
                            checked={approveAll}
                            value={approveAll.toString()}
                            onChange={(e: any) => setApproveAll(e.target.checked || false)}
                            label={t('common.enable-wallet-access.approve-all-label')}
                        />
                    </CheckboxContainer>
                </FlexDivColumnCentered>
                <OrText isRoyale={isRoyale}>{t('common.or')}</OrText>
                <InputContainer>
                    <ApprovalNumericInput
                        isRoyale={isRoyale}
                        value={amount}
                        onChange={(_, value) => setAmount(value)}
                        className={approveAll || isAmountValid ? '' : 'error'}
                        disabled={approveAll || isAllowing}
                    />
                    <ApprovalInputLabel isRoyale={isRoyale} className={approveAll || isAllowing ? 'disabled' : ''}>
                        {t('common.enable-wallet-access.custom-amount-label')}
                    </ApprovalInputLabel>
                    <ApprovalCurrencyLabel isRoyale={isRoyale} className={approveAll || isAllowing ? 'disabled' : ''}>
                        {tokenSymbol}
                    </ApprovalCurrencyLabel>
                    <FieldValidationMessage
                        showValidation={!approveAll && !isAmountValid}
                        message={t('common.errors.invalid-amount-max', { max: maxApproveAmount })}
                    />
                </InputContainer>
            </FlexDivColumnCentered>
            <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
        </ApprovalModalContainer>
    );

    return (
        <>
            {isRoyale ? (
                <StyledRoyaleModal open disableBackdropClick onClose={onClose}>
                    {getModalContent()}
                </StyledRoyaleModal>
            ) : (
                <StyledModal open disableBackdropClick onClose={onClose}>
                    {getModalContent()}
                </StyledModal>
            )}
        </>
    );
};

const StyledRoyaleModal = withStyles(() => ({
    paper: {
        borderRadius: '5px',
        width: '500px',
        background: 'var(--color)',
        padding: '1px',
        overflow: 'hidden',
    },
}))(Dialog);

const ApprovalModalTitle = styled(ModalTitle)<{ isRoyale?: boolean }>`
    color: ${(props) => (props.isRoyale ? 'var(--color) !important' : '')};
    font-family: ${(props) => (props.isRoyale ? 'Sansation !important' : '')};
`;

const ApprovalModalContainer = styled(ModalContainer)<{ isRoyale?: boolean }>`
    background: ${(props) => (props.isRoyale ? 'var(--color-wrapper)' : '')};
    border-radius: ${(props) => (props.isRoyale ? '5px' : '')};
`;

const ApprovalNumericInput = styled(NumericInput)<{ isRoyale?: boolean }>`
    font-size: ${(props) => (props.isRoyale ? '20px' : '')};
    background: ${(props) => (props.isRoyale ? 'var(--color-wrapper)' : '')};
    border: ${(props) => (props.isRoyale ? '5px solid var(--color)' : '')};
    color: ${(props) => (props.isRoyale ? 'var(--color)' : '')};
    font-family: ${(props) => (props.isRoyale ? 'Sansation !important' : '')};
    margin-bottom: ${(props) => (props.isRoyale ? '4px' : '')};
    border-radius: ${(props) => (props.isRoyale ? '5px' : '')};
    height: ${(props) => (props.isRoyale ? '80px' : '')};
    &:focus {
        border: ${(props) => (props.isRoyale ? '5px solid var(--color)' : '')};
    }
`;

const ApprovalInputLabel = styled(InputLabel)<{ isRoyale?: boolean }>`
    color: ${(props) => (props.isRoyale ? 'var(--color) !important' : '')};
    font-family: ${(props) => (props.isRoyale ? 'Sansation !important' : '')};
    padding: ${(props) => (props.isRoyale ? '12px 0 0 24px' : '')};
    &.disabled {
        opacity: ${(props) => (props.isRoyale ? '0.4' : '')};
        cursor: ${(props) => (props.isRoyale ? 'default' : '')};
    }
`;

const ApprovalCurrencyLabel = styled(CurrencyLabel)<{ isRoyale?: boolean }>`
    color: ${(props) => (props.isRoyale ? 'var(--color) !important' : '')};
    font-family: ${(props) => (props.isRoyale ? 'Sansation !important' : '')};
    padding: ${(props) => (props.isRoyale ? '41px 16px 17px 0' : '')};
`;

const ApprovalSubmitButton = styled(DefaultSubmitButton)<{ isRoyale?: boolean }>`
    color: ${(props) => (props.isRoyale ? 'var(--color-wrapper) !important' : '')};
    font-family: ${(props) => (props.isRoyale ? 'Sansation !important' : '')};
    background: ${(props) => (props.isRoyale ? 'var(--color)' : '')};
    border-radius: ${(props) => (props.isRoyale ? '20px' : '')};
    box-shadow: ${(props) => (props.isRoyale ? '0px 0px 30px var(--color)' : '')};
    &:hover:not(:disabled) {
        background: ${(props) => (props.isRoyale ? 'var(--color)' : '')};
    }
`;

const CheckboxContainer = styled(FlexDivCentered)<{ isRoyale?: boolean }>`
    margin: 40px 0 5px 0;
    label {
        color: ${(props) => (props.isRoyale ? 'var(--color) !important' : '')};
        font-family: ${(props) => (props.isRoyale ? 'Sansation !important' : '')};
        font-size: 16px;
        input:checked ~ .checkmark {
            background-color: ${(props) => (props.isRoyale ? 'var(--color)' : '')};
        }
    }
    border: ${(props) => (props.isRoyale ? 'var(--color)' : '')};
    span {
        :after {
            height: 12px;
            width: 5px;
            left: 4px;
            top: -1px;
            border-width: 0 3px 3px 0;
            border: ${(props) => (props.isRoyale ? 'solid var(--color-wrapper)' : '')};
            border-width: 0 2px 2px 0;
        }
        height: 18px;
        width: 18px;
        margin-top: 2px;
        border: ${(props) => (props.isRoyale ? '1px solid var(--color)' : '')};
    }
`;

const OrText = styled(FlexDivCentered)<{ isRoyale?: boolean }>`
    text-align: center;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: ${(props) => (props.isRoyale ? 'var(--color) !important' : '#f6f6fe')};
    font-family: ${(props) => (props.isRoyale ? 'Sansation !important' : '')};
    margin-bottom: 20px;
`;

export default ApprovalModal;
