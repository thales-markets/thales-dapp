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

type ApprovalModalProps = {
    defaultAmount: number | string;
    tokenSymbol: string;
    isAllowing: boolean;
    onSubmit: (approveAmount: BigNumber) => void;
    onClose: () => void;
};

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
    defaultAmount,
    tokenSymbol,
    isAllowing,
    onSubmit,
    onClose,
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
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }
        if (!approveAll && !isAmountEntered) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-amount`)}</DefaultSubmitButton>;
        }
        return (
            <DefaultSubmitButton
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
            </DefaultSubmitButton>
        );
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= maxApproveAmount));
    }, [amount]);

    return (
        <StyledModal open disableBackdropClick onClose={onClose}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        {t('common.enable-wallet-access.approve-label', { currencyKey: tokenSymbol })}
                    </ModalTitle>
                    <FlexDivRow>
                        <CloseIconContainer onClick={onClose} />
                    </FlexDivRow>
                </ModalHeader>
                <FlexDivColumnCentered>
                    <FlexDivColumnCentered>
                        <CheckboxContainer>
                            <Checkbox
                                disabled={isAllowing}
                                checked={approveAll}
                                value={approveAll.toString()}
                                onChange={(e: any) => setApproveAll(e.target.checked || false)}
                                label={t('common.enable-wallet-access.approve-all-label')}
                            />
                        </CheckboxContainer>
                    </FlexDivColumnCentered>
                    <OrText>{t('common.or')}</OrText>
                    <InputContainer>
                        <NumericInput
                            value={amount}
                            onChange={(_, value) => setAmount(value)}
                            className={approveAll || isAmountValid ? '' : 'error'}
                            disabled={approveAll || isAllowing}
                        />
                        <InputLabel>{t('common.enable-wallet-access.custom-amount-label')}</InputLabel>
                        <CurrencyLabel className={approveAll || isAllowing ? 'disabled' : ''}>
                            {tokenSymbol}
                        </CurrencyLabel>
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
            </ModalContainer>
        </StyledModal>
    );
};

export const CheckboxContainer = styled(FlexDivCentered)`
    margin: 40px 0 5px 0;
    label {
        font-size: 16px;
    }
    span {
        :after {
            height: 12px;
            width: 5px;
            left: 4px;
            top: -1px;
            border-width: 0 3px 3px 0;
        }
        height: 18px;
        width: 18px;
        margin-top: 2px;
    }
`;

const OrText = styled(FlexDivCentered)`
    text-align: center;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #f6f6fe;
    margin-bottom: 20px;
`;

export default ApprovalModal;
