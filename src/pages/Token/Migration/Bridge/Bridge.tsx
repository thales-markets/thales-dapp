import { BigNumber, ethers } from 'ethers';
import { InputContainer } from 'pages/Token/components/styled-components';
import NumericInput from 'components/fields/NumericInput';
import React, { useEffect, useState } from 'react';
import snxJSConnector from 'utils/snxJSConnector';
import { useTranslation } from 'react-i18next';
import { getIsWalletConnected, getNetwork, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { checkAllowance } from 'utils/network';
import { THALES_CURRENCY } from 'constants/currency';
import { L1_TO_L2_NETWORK_MAPPER, SUPPORTED_NETWORKS_NAMES } from 'constants/network';
import { ReactComponent as ArrowDown } from 'assets/images/arrow-down-blue.svg';
import { getIsAppReady } from 'redux/modules/app';
import { formatCurrencyWithKey, truncToDecimals } from 'thales-utils';
import InfoMessage from 'components/InfoMessage';
import InfoWarningMessage from 'components/InfoWarningMessage';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import styled from 'styled-components';
import ApprovalModal from 'components/ApprovalModal';
import useOpThalesBalanceQuery from 'queries/walletBalances/useOpThalesBalanceQuery';
import { thalesContract as thalesTokenContract } from 'utils/contracts/thalesContract';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/Button';
import { toast } from 'react-toastify';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { Network } from 'enums/network';

const Bridge: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const [amount, setAmount] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [opThalesBalance, setOpThalesBalance] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance = Number(opThalesBalance) < Number(amount) || Number(opThalesBalance) === 0;

    const isButtonDisabled =
        isSubmitting || !isWalletConnected || !isAmountEntered || insufficientBalance || !hasAllowance;

    const opThalesBalanceQuery = useOpThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (opThalesBalanceQuery.isSuccess && opThalesBalanceQuery.data) {
            setOpThalesBalance(Number(opThalesBalanceQuery.data.balance));
        }
    }, [opThalesBalanceQuery.isSuccess, opThalesBalanceQuery.data]);

    useEffect(() => {
        const { opThalesTokenContract, bridgeContract } = snxJSConnector as any;

        if (opThalesTokenContract && bridgeContract) {
            const opThalesTokenContractWithSigner = opThalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = bridgeContract.address;

            const getAllowance = async () => {
                try {
                    const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                    const allowance = await checkAllowance(
                        parsedAmount,
                        opThalesTokenContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected && opThalesTokenContractWithSigner.signer) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasAllowance, networkId, amount, isAllowing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { opThalesTokenContract, bridgeContract } = snxJSConnector as any;

        if (opThalesTokenContract && bridgeContract) {
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
            const opThalesTokenContractWithSigner = opThalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = bridgeContract.address;

            try {
                setIsAllowing(true);
                const tx = (await opThalesTokenContractWithSigner.approve(
                    addressToApprove,
                    approveAmount
                )) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t(`common.transaction.successful`), id));
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsAllowing(false);
                setOpenApprovalModal(false);
            }
        }
    };

    const handleSubmit = async () => {
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        setIsSubmitting(true);

        try {
            const { bridgeContract, opThalesTokenContract } = snxJSConnector as any;
            const bridgeContractWithSigner = bridgeContract.connect((snxJSConnector as any).signer);

            const parsedAmount = ethers.utils.parseEther(amount.toString());
            const tx = await bridgeContractWithSigner.depositERC20To(
                opThalesTokenContract.address,
                (thalesTokenContract as any).addresses[L1_TO_L2_NETWORK_MAPPER[networkId]],
                walletAddress,
                parsedAmount,
                2000000,
                '0x'
            );
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t('migration.bridge-button.confirmation-message'), id));
                setIsSubmitting(false);
                setAmount('');
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsSubmitting(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (insufficientBalance) {
            return <Button disabled={true}>{t(`common.errors.insufficient-balance`)}</Button>;
        }
        if (!isAmountEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-amount`)}</Button>;
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </Button>
            );
        }
        return (
            <Button disabled={isButtonDisabled} onClick={handleSubmit}>
                {!isSubmitting ? t('migration.bridge-button.label') : t('migration.bridge-button.progress-label')}
            </Button>
        );
    };

    const onMaxClick = () => {
        setAmount(truncToDecimals(opThalesBalance, 8));
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= Number(opThalesBalance)));
    }, [amount, opThalesBalance]);

    return (
        <>
            <InfoSection>{t('migration.info-messages.bridge')}</InfoSection>
            <InputContainer mediaMarginBottom={10}>
                <NumericInput
                    value={amount}
                    onChange={(_, value) => setAmount(value)}
                    disabled={isSubmitting}
                    currencyLabel={THALES_CURRENCY}
                    placeholder={t('common.enter-amount')}
                    label={`${t('migration.from-label')} ${network.networkName}`}
                    onMaxButton={onMaxClick}
                    showValidation={!isAmountValid}
                    validationMessage={t(`common.errors.insufficient-balance-wallet`, { currencyKey: THALES_CURRENCY })}
                    balance={
                        isWalletConnected
                            ? `${t('common.balance')}: ${formatCurrencyWithKey(THALES_CURRENCY, opThalesBalance)}`
                            : undefined
                    }
                    isBalanceLoading={opThalesBalanceQuery.isLoading}
                />
            </InputContainer>
            <ArrowContainer>
                <ArrowDown />
            </ArrowContainer>
            <InputContainer mediaMarginBottom={10}>
                <NumericInput
                    value={amount}
                    onChange={() => {}}
                    disabled={true}
                    currencyLabel={THALES_CURRENCY}
                    label={`${t('migration.to-label')} ${
                        SUPPORTED_NETWORKS_NAMES[L1_TO_L2_NETWORK_MAPPER[networkId] as Network]
                    }`}
                />
            </InputContainer>
            <MessageContainer>
                <InfoMessage message={t('migration.migration-delay-info')}></InfoMessage>
            </MessageContainer>
            <MessageContainer>
                <InfoWarningMessage message={t('migration.migration-multisig-contact-warning')}></InfoWarningMessage>
            </MessageContainer>
            <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amount}
                    tokenSymbol={THALES_CURRENCY}
                    isNonStable={true}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </>
    );
};

const MessageContainer = styled(FlexDiv)`
    margin-top: 10px;
`;

const InfoSection = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    margin: 30px 0;
    font-size: 15px;
    margin-bottom: 35px;
    text-align: justify;
`;

const ArrowContainer = styled(FlexDivCentered)`
    margin-bottom: 15px;
    margin-top: -5px;
    @media (max-width: 1192px) {
        margin-bottom: 5px;
    }
`;

const SubmitButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    align-items: center;
`;

export default Bridge;
