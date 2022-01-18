import ValidationMessage from 'components/ValidationMessage';
import { ethers } from 'ethers';
import {
    CurrencyLabel,
    DefaultSubmitButton,
    Divider,
    InputContainer,
    InputLabel,
    SubmitButtonContainer,
} from 'pages/Options/Market/components';
import NumericInput from 'pages/Options/Market/components/NumericInput';
import React, { useEffect, useState } from 'react';
import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';
import { useTranslation } from 'react-i18next';
import { getIsWalletConnected, getNetwork, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { APPROVAL_EVENTS } from 'constants/events';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { formatGasLimit } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import { OP_THALES_CURRENCY, THALES_CURRENCY } from 'constants/currency';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { ReactComponent as ArrowDown } from 'assets/images/arrow-down-blue.svg';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import { getIsAppReady } from 'redux/modules/app';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import FieldValidationMessage from 'components/FieldValidationMessage';
import useOpThalesBalanceQuery from 'queries/walletBalances/useOpThalesBalanceQuery';
import {
    ArrowContainer,
    MaxButton,
    MaxInnerButton,
    NetworkLabel,
    Result,
    ResultContainer,
    ThalesWalletAmountLabel,
} from '../components';

const Swap: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const [amount, setAmount] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [opThalesBalance, setOpThalesBalance] = useState<number | string>('');
    const [thalesBalance, setThalesBalance] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance = Number(opThalesBalance) < Number(amount) || Number(opThalesBalance) === 0;

    const isButtonDisabled = isSubmitting || !isWalletConnected || !isAmountEntered || insufficientBalance;

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(Number(thalesBalanceQuery.data.balance));
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    const opThalesBalanceQuery = useOpThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (opThalesBalanceQuery.isSuccess && opThalesBalanceQuery.data) {
            setOpThalesBalance(Number(opThalesBalanceQuery.data.balance));
        }
    }, [opThalesBalanceQuery.isSuccess, opThalesBalanceQuery.data]);

    useEffect(() => {
        const { opThalesTokenContract, thalesExchangerContract } = snxJSConnector as any;

        if (opThalesTokenContract && thalesExchangerContract) {
            const opThalesTokenContractWithSigner = opThalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = thalesExchangerContract.address;

            const getAllowance = async () => {
                try {
                    const allowance = await opThalesTokenContractWithSigner.allowance(walletAddress, addressToApprove);
                    setAllowance(!!bigNumberFormatter(allowance));
                } catch (e) {
                    console.log(e);
                }
            };

            const registerAllowanceListener = () => {
                opThalesTokenContractWithSigner.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                    if (owner === walletAddress && spender === getAddress(addressToApprove)) {
                        setAllowance(true);
                        setIsAllowing(false);
                    }
                });
            };
            if (isWalletConnected) {
                getAllowance();
                registerAllowanceListener();
            }
            return () => {
                opThalesTokenContractWithSigner.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
            };
        }
    }, [walletAddress, isWalletConnected, hasAllowance, networkId]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const { thalesExchangerContract } = snxJSConnector as any;

            if (thalesExchangerContract) {
                try {
                    const thalesExchangerContractWithSigner = thalesExchangerContract.connect(
                        (snxJSConnector as any).signer
                    );
                    const parsedAmount = ethers.utils.parseEther(amount.toString());
                    const gasEstimate = await thalesExchangerContractWithSigner.estimateGas.exchangeOpThalesToThales(
                        parsedAmount
                    );
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, amount, hasAllowance, walletAddress]);

    const handleAllowance = async () => {
        const { opThalesTokenContract, thalesExchangerContract } = snxJSConnector as any;

        if (opThalesTokenContract && thalesExchangerContract) {
            const opThalesTokenContractWithSigner = opThalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = thalesExchangerContract.address;

            try {
                setIsAllowing(true);
                const gasEstimate = await opThalesTokenContractWithSigner.estimateGas.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256
                );
                const tx = (await opThalesTokenContractWithSigner.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256,
                    {
                        gasLimit: formatGasLimit(gasEstimate, networkId),
                    }
                )) as ethers.ContractTransaction;

                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    setAllowance(true);
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsAllowing(false);
            }
        }
    };

    const handleSubmit = async () => {
        setTxErrorMessage(null);
        setIsSubmitting(true);

        try {
            const { thalesExchangerContract } = snxJSConnector as any;
            const thalesExchangerContractWithSigner = thalesExchangerContract.connect((snxJSConnector as any).signer);

            const parsedAmount = ethers.utils.parseEther(amount.toString());
            const tx = await thalesExchangerContractWithSigner.exchangeOpThalesToThales(parsedAmount);
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('migration.swap-button.confirmation-message'));
                setIsSubmitting(false);
                setAmount('');
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsSubmitting(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }
        if (insufficientBalance) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.insufficient-balance`)}</DefaultSubmitButton>;
        }
        if (!isAmountEntered) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-amount`)}</DefaultSubmitButton>;
        }
        if (!hasAllowance) {
            return (
                <DefaultSubmitButton disabled={isAllowing} onClick={handleAllowance}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: OP_THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: OP_THALES_CURRENCY,
                          })}
                </DefaultSubmitButton>
            );
        }
        return (
            <DefaultSubmitButton disabled={isButtonDisabled || !gasLimit} onClick={handleSubmit}>
                {!isSubmitting ? t('migration.swap-button.label') : t('migration.swap-button.progress-label')}
            </DefaultSubmitButton>
        );
    };

    const onMaxClick = () => {
        setAmount(truncToDecimals(opThalesBalance));
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= opThalesBalance));
    }, [amount, opThalesBalance]);

    return (
        <>
            <InputContainer>
                <NumericInput
                    value={amount}
                    onChange={(_, value) => setAmount(value)}
                    disabled={isSubmitting}
                    className={isAmountValid ? '' : 'error'}
                />
                <InputLabel>
                    {t('migration.from-label')}
                    <NetworkLabel>{network.networkName}</NetworkLabel>
                </InputLabel>
                <CurrencyLabel className={isSubmitting ? 'disabled' : ''}>{OP_THALES_CURRENCY}</CurrencyLabel>
                <ThalesWalletAmountLabel>
                    {formatCurrencyWithKey(OP_THALES_CURRENCY, opThalesBalance)}
                    <MaxButton disabled={isSubmitting}>
                        <MaxInnerButton onClick={onMaxClick}>{t('common.max')}</MaxInnerButton>
                    </MaxButton>
                </ThalesWalletAmountLabel>
                <FieldValidationMessage
                    showValidation={!isAmountValid}
                    message={t(`common.errors.insufficient-balance-wallet`, { currencyKey: OP_THALES_CURRENCY })}
                />
            </InputContainer>
            <ArrowContainer>
                <ArrowDown />
            </ArrowContainer>
            <ResultContainer>
                <Result>{amount}</Result>
                <InputLabel>
                    {t('migration.to-label')}
                    <NetworkLabel>{network.networkName}</NetworkLabel>
                </InputLabel>
                <CurrencyLabel>{THALES_CURRENCY}</CurrencyLabel>
                <ThalesWalletAmountLabel>
                    {formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)}
                </ThalesWalletAmountLabel>
            </ResultContainer>
            <Divider />
            <NetworkFees gasLimit={gasLimit} disabled={isSubmitting} />
            <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
        </>
    );
};

export default Swap;
